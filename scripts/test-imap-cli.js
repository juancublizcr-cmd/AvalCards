import tls from "node:tls";

/**
 * Prueba de conexión IMAP real sobre TLS usando sockets nativos de Node.js.
 * Sin dependencias externas.
 */
export async function probarConexionImapReal({ host, port = 993, user, password }) {
  return new Promise((resolve) => {
    let responded = false;
    let buffer = "";

    const finish = (ok, mensaje) => {
      if (responded) return;
      responded = true;
      try {
        socket.destroy();
      } catch {}
      resolve({ ok, mensaje });
    };

    const timeout = setTimeout(() => {
      finish(false, `Tiempo de espera agotado al conectar con ${host}:${port}`);
    }, 10000);

    const socket = tls.connect(
      {
        host,
        port,
        servername: host,
        rejectUnauthorized: false,
      },
      () => {
        // Conexión TLS establecida
      }
    );

    socket.setEncoding("utf8");

    socket.on("data", (data) => {
      buffer += data;

      // Esperar saludo inicial del servidor IMAP (* OK ...)
      if (buffer.includes("* OK") && !buffer.includes("TAG1")) {
        const cleanUser = user.replace(/"/g, '\\"');
        const cleanPass = password.replace(/"/g, '\\"');
        socket.write(`TAG1 LOGIN "${cleanUser}" "${cleanPass}"\r\n`);
      }

      // Respuesta al comando LOGIN
      if (buffer.includes("TAG1 OK")) {
        clearTimeout(timeout);
        socket.write("TAG2 LOGOUT\r\n");
        finish(true, `Autenticación exitosa en ${host}:${port}. Credenciales correctas.`);
      } else if (buffer.includes("TAG1 NO") || buffer.includes("TAG1 BAD")) {
        clearTimeout(timeout);
        const match = buffer.match(/TAG1 (?:NO|BAD) (.*)/i);
        const detalle = match ? match[1].trim() : "Credenciales rechazadas";
        finish(false, `Servidor IMAP respondió: ${detalle}. Verifica tu usuario y contraseña de aplicación.`);
      }
    });

    socket.on("error", (err) => {
      clearTimeout(timeout);
      finish(false, `Error de conexión TLS/IMAP a ${host}:${port}: ${err.message}`);
    });

    socket.on("close", () => {
      clearTimeout(timeout);
      if (!responded) {
        finish(false, `La conexión con ${host}:${port} se cerró inesperadamente.`);
      }
    });
  });
}

// Si se ejecuta directamente desde terminal
if (process.argv[1]?.includes("test-imap-cli")) {
  const [, , host, port, user, pass] = process.argv;
  if (!host || !user || !pass) {
    console.log("Uso: node scripts/test-imap-cli.js <host> <puerto> <usuario> <password>");
    process.exit(1);
  }
  console.log(`Probando conexión IMAP a ${host}:${port} con ${user}...`);
  probarConexionImapReal({ host, port: Number(port) || 993, user, password: pass }).then((res) => {
    console.log(JSON.stringify(res, null, 2));
    process.exit(res.ok ? 0 : 1);
  });
}
