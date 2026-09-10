import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zdyygdivjhftirykvjjk.supabase.co";
const supabaseKey = "sb_publishable_V6TPJryhSdRjDPsW8f07OA_b11osYAw";
const supabase = createClient(supabaseUrl, supabaseKey);

const NOMBRES_HOMBRES = [
  "Carlos", "Juan", "Esteban", "Mauricio", "Rodrigo", "Diego", "Andrés", "Christian",
  "Fabricio", "Javier", "Alejandro", "Gustavo", "Kenneth", "Mario", "Álvaro", "Gabriel",
  "Oscar", "Ricardo", "Daniel", "José", "Luis", "Fernando", "Randall", "Alonso",
  "Kevin", "Walter", "Sergio", "David", "Bryan", "Felipe", "Minor", "Guillermo",
  "Rolando", "Víctor", "Manuel", "Jonathan", "Pablo", "Adrián", "Ignacio", "Erick",
];

const NOMBRES_MUJERES = [
  "María", "Valeria", "Karla", "Marcela", "Gabriela", "Natalia", "Lorena", "Andrea",
  "Sofía", "Daniela", "Tatiana", "Pamela", "Stephanie", "Jimena", "Laura", "Melissa",
  "Carolina", "Patricia", "Mónica", "Raquel", "Fiorella", "Adriana", "Priscilla", "Mariela",
  "Viviana", "Silvia", "Elena", "Fabiola", "Camila", "Lucía", "Paulina", "Rebeca",
  "Mariana", "Alejandra", "Verónica", "Irene", "Catalina", "Monserrat", "Beatriz", "Dayana",
];

const APELLIDOS = [
  "Rodríguez", "González", "Hernández", "Morales", "Vargas", "Castillo", "Jiménez",
  "Sánchez", "Pérez", "Ramírez", "Castro", "Guzmán", "Rojas", "Navarro", "Campos",
  "Alvarado", "Mora", "Céspedes", "Solano", "Chinchilla", "Ureña", "Fallas", "Sandí",
  "Cordero", "Esquivel", "Villalobos", "Cascante", "Madrigal", "Barquero", "Segura",
  "Zúñiga", "Retana", "Porras", "Monge", "Quirós", "Chaves", "Vega", "Araya",
  "Benavides", "Montero", "Carvajal", "Brenes", "Soto", "Valverde", "Moya", "Delgado",
  "Marín", "Salazar", "Méndez", "Calderón", "Bolaños", "Herrera", "Montiel", "Acosta",
];

const PROVINCIAS_CANTONES = [
  { p: "San José", c: "Central" },
  { p: "San José", c: "Escazú" },
  { p: "San José", c: "Desamparados" },
  { p: "San José", c: "Pérez Zeledón" },
  { p: "San José", c: "Curridabat" },
  { p: "San José", c: "Santa Ana" },
  { p: "Alajuela", c: "Central" },
  { p: "Alajuela", c: "San Ramón" },
  { p: "Alajuela", c: "San Carlos" },
  { p: "Alajuela", c: "Palmares" },
  { p: "Alajuela", c: "Grecia" },
  { p: "Cartago", c: "Central" },
  { p: "Cartago", c: "Paraíso" },
  { p: "Cartago", c: "La Unión" },
  { p: "Cartago", c: "Turrialba" },
  { p: "Heredia", c: "Central" },
  { p: "Heredia", c: "San Isidro" },
  { p: "Heredia", c: "Belén" },
  { p: "Heredia", c: "Santo Domingo" },
  { p: "Guanacaste", c: "Liberia" },
  { p: "Guanacaste", c: "Nicoya" },
  { p: "Guanacaste", c: "Santa Cruz" },
  { p: "Puntarenas", c: "Central" },
  { p: "Puntarenas", c: "Esparza" },
  { p: "Puntarenas", c: "Aguirre (Quepos)" },
  { p: "Limón", c: "Pococí" },
  { p: "Limón", c: "Central" },
  { p: "Limón", c: "Siquirres" },
];

const PREFIJOS_TEL = ["83", "84", "85", "86", "87", "88", "89", "70", "71", "72", "60", "61", "62", "63", "64"];
const SEGUNDOS_NOMBRES = [
  "Antonio", "Eduardo", "Alberto", "Enrique", "Alexander", "Fabián", "Alejandro", "Guillermo",
  "Isabel", "Cristina", "Beatriz", "Victoria", "Fernanda", "Guadalupe", "Eugenia", "Mercedes",
  "Ignacio", "Andrés", "Manuel", "David", "Javier", "René", "Arturo", "Ernesto"
];

const DOMINIOS_EMAIL = ["gmail.com", "outlook.com", "icloud.com", "hotmail.com", "yahoo.com"];

const PLAN_PAQUETES = [
  ...Array(700).fill({ cant: 4, precio: 4000 }),
  ...Array(500).fill({ cant: 8, precio: 8000 }),
  ...Array(500).fill({ cant: 12, precio: 12000 }),
  ...Array(300).fill({ cant: 24, precio: 20000 }),
];

// Barajar paquetes
for (let i = PLAN_PAQUETES.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [PLAN_PAQUETES[i], PLAN_PAQUETES[j]] = [PLAN_PAQUETES[j], PLAN_PAQUETES[i]];
}

async function ejecutar() {
  console.log("=== INICIANDO GENERACIÓN DE 2,000 PAQUETES Y 20,000 TOKENS ===");

  console.log("1. Limpiando tabla ordenes previa en Supabase...");
  const { error: delErr } = await supabase.from("ordenes").delete().neq("id", "none_to_delete_all");
  if (delErr) {
    console.error("Error limpiando órdenes:", delErr);
    return;
  }
  console.log("✓ Tabla ordenes limpiada exitosamente.");

  const tokensOcupados = new Set();
  const telsOcupados = new Set();
  const emailsOcupados = new Set();
  const nombresOcupados = new Set();
  const idsOcupados = new Set();

  function generarIdUnico() {
    while (true) {
      const azar = Math.floor(10000 + Math.random() * 90000);
      const id = `SG-${azar}`;
      if (!idsOcupados.has(id)) {
        idsOcupados.add(id);
        return id;
      }
    }
  }

  function generarTokenUnico() {
    while (true) {
      const azar = Math.floor(Math.random() * 100000);
      const str = String(azar).padStart(5, "0");
      if (!tokensOcupados.has(str)) {
        tokensOcupados.add(str);
        return str;
      }
    }
  }

  function generarTelefonoUnico() {
    while (true) {
      const prefijo = PREFIJOS_TEL[Math.floor(Math.random() * PREFIJOS_TEL.length)];
      const resto = Math.floor(100000 + Math.random() * 900000);
      const raw = `${prefijo}${resto}`;
      if (!telsOcupados.has(raw)) {
        telsOcupados.add(raw);
        return `${raw.slice(0, 4)}-${raw.slice(4)}`;
      }
    }
  }

  function generarNombreYEmailUnicos() {
    while (true) {
      const esHombre = Math.random() > 0.48;
      const primerNombre = esHombre
        ? NOMBRES_HOMBRES[Math.floor(Math.random() * NOMBRES_HOMBRES.length)]
        : NOMBRES_MUJERES[Math.floor(Math.random() * NOMBRES_MUJERES.length)];

      const usaSegundo = Math.random() > 0.4;
      const segundoNombre = usaSegundo
        ? SEGUNDOS_NOMBRES[Math.floor(Math.random() * SEGUNDOS_NOMBRES.length)]
        : "";

      const ap1 = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
      let ap2 = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
      while (ap2 === ap1) {
        ap2 = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];
      }

      const nombreCompleto = segundoNombre
        ? `${primerNombre} ${segundoNombre} ${ap1} ${ap2}`
        : `${primerNombre} ${ap1} ${ap2}`;

      if (nombresOcupados.has(nombreCompleto.toLowerCase())) continue;

      const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const dom = DOMINIOS_EMAIL[Math.floor(Math.random() * DOMINIOS_EMAIL.length)];
      const email = `${norm(primerNombre)}.${norm(ap1)}${Math.floor(10 + Math.random() * 990)}@${dom}`;

      if (emailsOcupados.has(email)) continue;

      nombresOcupados.add(nombreCompleto.toLowerCase());
      emailsOcupados.add(email);

      return { nombre: nombreCompleto, email };
    }
  }

  const listaPadrinos = [];
  const ordenes = [];
  const ahora = Date.now();
  const sieteDiasMs = 7 * 24 * 60 * 60 * 1000;
  const metodos = ["SINPE Móvil", "SINPE Móvil", "Tarjeta TiloPay", "Tarjeta TiloPay", "Apple Pay", "Google Pay"];

  console.log("2. Generando 2,000 órdenes y 20,000 tokens...");

  for (let i = 0; i < PLAN_PAQUETES.length; i++) {
    const pkg = PLAN_PAQUETES[i];
    const { nombre, email } = generarNombreYEmailUnicos();
    const telefono = generarTelefonoUnico();

    if (listaPadrinos.length < 200 && Math.random() > 0.5) {
      listaPadrinos.push(telefono.replace(/\D/g, ""));
    }

    const tokens = [];
    for (let t = 0; t < pkg.cant; t++) {
      tokens.push(generarTokenUnico());
    }

    const tieneSuper = Math.random() > 0.55;
    const montoSuper = tieneSuper ? (pkg.cant >= 24 ? 5000 : 1500) : 0;
    const precioTotal = pkg.precio + montoSuper;

    let refTag = "";
    if (listaPadrinos.length > 5 && Math.random() > 0.72) {
      const padrinoTel = listaPadrinos[Math.floor(Math.random() * listaPadrinos.length)];
      if (padrinoTel !== telefono.replace(/\D/g, "")) {
        refTag = ` [REF:${padrinoTel}]`;
      }
    }

    const fechaOffset = Math.floor(Math.random() * sieteDiasMs);
    const fecha = new Date(ahora - fechaOffset).toISOString();
    const metodo = metodos[Math.floor(Math.random() * metodos.length)];

    ordenes.push({
      id: generarIdUnico(),
      nombre,
      telefono,
      email,
      cantidad: pkg.cant,
      precio: precioTotal,
      numeros: tokens,
      comprobante_url: metodo === "SINPE Móvil" ? "/comprobante-sinpe.jpg" : null,
      estado: "aprobada",
      fecha,
      metodo_pago: metodo,
      transaccion_id: `TX-${Math.floor(100000 + Math.random() * 900000)}${refTag}`,
      supertoken: tieneSuper,
      monto_supertoken: montoSuper,
    });
  }

  // Ordenar cronológicamente
  ordenes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  console.log(`3. Insertando ${ordenes.length} órdenes en Supabase en lotes de 100...`);
  const BATCH_SIZE = 100;
  for (let i = 0; i < ordenes.length; i += BATCH_SIZE) {
    const batch = ordenes.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("ordenes").insert(batch);
    if (error) {
      console.error(`Error en lote ${i / BATCH_SIZE + 1}:`, error.message);
      return;
    }
    process.stdout.write(`✓ Lote ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(ordenes.length / BATCH_SIZE)} insertado (${i + batch.length} órdenes)\r`);
  }

  console.log("\n4. Actualizando inventario en Supabase...");
  const totalTokensVendidos = ordenes.reduce((sum, o) => sum + o.cantidad, 0);
  const totalRecaudado = ordenes.reduce((sum, o) => sum + o.precio, 0);

  const inv = {
    total: 100000,
    disponibles: 100000 - totalTokensVendidos,
    fecha: new Date().toISOString(),
  };
  await supabase.from("inventario").upsert({ id: 1, ...inv });

  console.log("=== INYECCIÓN COMPLETADA CON ÉXITO ===");
  console.log(`📦 Paquetes (Órdenes) Registrados: ${ordenes.length}`);
  console.log(`🎟️ Tokens Emitidos: ${totalTokensVendidos}`);
  console.log(`💰 Total Recaudado: ₡${totalRecaudado.toLocaleString("es-CR")}`);
  console.log(`👤 Nombres Únicos: ${nombresOcupados.size}`);
  console.log(`📞 Teléfonos Únicos: ${telsOcupados.size}`);
  console.log(`✉️ Emails Únicos: ${emailsOcupados.size}`);
  console.log(`🔢 Tokens Únicos Sin Repetir: ${tokensOcupados.size}`);
  console.log(`📈 Porcentaje de Emisión (sobre 100,000): ${((totalTokensVendidos / 100000) * 100).toFixed(2)}%`);
}

void ejecutar();
