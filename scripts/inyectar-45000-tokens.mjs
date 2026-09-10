import { createClient } from "@supabase/supabase-js";

// SCRIPT: Inyectar 45,000 tokens ADICIONALES sin borrar datos existentes
// Meta: pasar de 20,000 a 65,000 tokens vendidos (65% de 100,000)
// Paquetes: 2000x4=8000 + 2000x8=16000 + 1000x12=12000 + 375x24=9000 = 5375 pkgs = 45000 tokens

const supabaseUrl = "https://zdyygdivjhftirykvjjk.supabase.co";
const supabaseKey = "sb_publishable_V6TPJryhSdRjDPsW8f07OA_b11osYAw";
const supabase = createClient(supabaseUrl, supabaseKey);

const NOMBRES_HOMBRES = [
  "Carlos", "Juan", "Esteban", "Mauricio", "Rodrigo", "Diego", "Andres", "Christian",
  "Fabricio", "Javier", "Alejandro", "Gustavo", "Kenneth", "Mario", "Alvaro", "Gabriel",
  "Oscar", "Ricardo", "Daniel", "Jose", "Luis", "Fernando", "Randall", "Alonso",
  "Kevin", "Walter", "Sergio", "David", "Bryan", "Felipe", "Minor", "Guillermo",
  "Rolando", "Victor", "Manuel", "Jonathan", "Pablo", "Adrian", "Ignacio", "Erick",
  "Cristian", "Orlando", "Roberto", "Eduardo", "Gerardo", "Hugo", "Ivan", "Leonardo",
  "Marco", "Nelson", "Patricio", "Raul", "Sebastian", "Tomas", "Freddy", "Ariel",
  "Bernal", "Claudio", "Wilbert", "Yoseph", "Alfredo", "Armando", "Bernardo", "Cesar",
];

const NOMBRES_MUJERES = [
  "Maria", "Valeria", "Karla", "Marcela", "Gabriela", "Natalia", "Lorena", "Andrea",
  "Sofia", "Daniela", "Tatiana", "Pamela", "Stephanie", "Jimena", "Laura", "Melissa",
  "Carolina", "Patricia", "Monica", "Raquel", "Fiorella", "Adriana", "Priscilla", "Mariela",
  "Viviana", "Silvia", "Elena", "Fabiola", "Camila", "Lucia", "Paulina", "Rebeca",
  "Mariana", "Alejandra", "Veronica", "Irene", "Catalina", "Monserrat", "Beatriz", "Dayana",
  "Susana", "Rosa", "Alicia", "Brenda", "Diana", "Estefania", "Flor", "Gloria",
  "Hilda", "Ingrid", "Jackeline", "Karen", "Linda", "Magaly", "Nancy", "Olga",
  "Pierina", "Roxana", "Sonia", "Tania", "Ursula", "Wendy", "Xiomara", "Yuliana",
];

const APELLIDOS = [
  "Rodriguez", "Gonzalez", "Hernandez", "Morales", "Vargas", "Castillo", "Jimenez",
  "Sanchez", "Perez", "Ramirez", "Castro", "Guzman", "Rojas", "Navarro", "Campos",
  "Alvarado", "Mora", "Cespedes", "Solano", "Chinchilla", "Urena", "Fallas", "Sandi",
  "Cordero", "Esquivel", "Villalobos", "Cascante", "Madrigal", "Barquero", "Segura",
  "Zuniga", "Retana", "Porras", "Monge", "Quiros", "Chaves", "Vega", "Araya",
  "Benavides", "Montero", "Carvajal", "Brenes", "Soto", "Valverde", "Moya", "Delgado",
  "Marin", "Salazar", "Mendez", "Calderon", "Bolanos", "Herrera", "Montiel", "Acosta",
  "Aguilar", "Alfaro", "Arias", "Barrantes", "Bogantes", "Bonilla", "Cambronero", "Chavarria",
  "Elizondo", "Fonseca", "Gamboa", "Hidalgo", "Lara", "Leiva", "Lopez", "Murillo",
  "Naranjo", "Nunez", "Obando", "Orozco", "Picado", "Quesada", "Ruiz", "Sequeira",
  "Torres", "Ugalde", "Umana", "Vasquez", "Vindas", "Zamora", "Zeledon", "Zumbado",
];

const PREFIJOS_TEL = ["83","84","85","86","87","88","89","70","71","72","60","61","62","63","64","65","66","67","68","69"];
const SEGUNDOS_NOMBRES = [
  "Antonio", "Eduardo", "Alberto", "Enrique", "Alexander", "Fabian", "Alejandro", "Guillermo",
  "Isabel", "Cristina", "Beatriz", "Victoria", "Fernanda", "Guadalupe", "Eugenia", "Mercedes",
  "Ignacio", "Andres", "Manuel", "David", "Javier", "Rene", "Arturo", "Ernesto",
  "Cecilia", "Luciana", "Valentina", "Santiago", "Mateo", "Emilio", "Felipe", "Rodrigo",
];

const DOMINIOS_EMAIL = ["gmail.com","outlook.com","icloud.com","hotmail.com","yahoo.com","live.com","me.com"];

// Plan: 5375 paquetes = 45,000 tokens
const PLAN_PAQUETES = [
  ...Array(2000).fill({ cant: 4, precio: 4000 }),
  ...Array(2000).fill({ cant: 8, precio: 8000 }),
  ...Array(1000).fill({ cant: 12, precio: 12000 }),
  ...Array(375).fill({ cant: 24, precio: 20000 }),
];

// Fisher-Yates shuffle
for (let i = PLAN_PAQUETES.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [PLAN_PAQUETES[i], PLAN_PAQUETES[j]] = [PLAN_PAQUETES[j], PLAN_PAQUETES[i]];
}

async function cargarDatosExistentes() {
  const tokensOcupados = new Set();
  const telsOcupados = new Set();
  const emailsOcupados = new Set();
  const nombresOcupados = new Set();
  const idsOcupados = new Set();

  console.log("1. Cargando datos existentes de Supabase para evitar duplicados...");

  const STEP = 1000;
  let from = 0;
  let totalFilas = 0;

  while (true) {
    const { data, error } = await supabase
      .from("ordenes")
      .select("id, nombre, telefono, email, numeros")
      .range(from, from + STEP - 1);

    if (error) {
      console.error("Error al leer ordenes existentes:", error.message);
      process.exit(1);
    }
    if (!data || data.length === 0) break;

    for (const row of data) {
      if (row.id) idsOcupados.add(row.id);
      if (row.nombre) nombresOcupados.add(row.nombre.toLowerCase());
      if (row.telefono) telsOcupados.add(row.telefono.replace(/\D/g, ""));
      if (row.email) emailsOcupados.add(row.email.toLowerCase());
      if (Array.isArray(row.numeros)) {
        for (const n of row.numeros) tokensOcupados.add(n);
      }
    }

    totalFilas += data.length;
    process.stdout.write("   -> " + totalFilas + " filas leidas...\r");
    if (data.length < STEP) break;
    from += STEP;
  }

  console.log("\n OK: " + totalFilas + " ordenes existentes | " + tokensOcupados.size + " tokens | " + telsOcupados.size + " tels | " + emailsOcupados.size + " emails.");
  return { tokensOcupados, telsOcupados, emailsOcupados, nombresOcupados, idsOcupados };
}

async function ejecutar() {
  const targetTokens = PLAN_PAQUETES.reduce((s, p) => s + p.cant, 0);
  console.log("=== INYECTANDO " + targetTokens.toLocaleString() + " TOKENS ADICIONALES (SIN BORRAR DATOS) ===");
  console.log("    Paquetes a generar: " + PLAN_PAQUETES.length.toLocaleString());

  const { tokensOcupados, telsOcupados, emailsOcupados, nombresOcupados, idsOcupados } =
    await cargarDatosExistentes();

  function generarIdUnico() {
    while (true) {
      const id = "SG-" + Math.floor(10000 + Math.random() * 90000);
      if (!idsOcupados.has(id)) { idsOcupados.add(id); return id; }
    }
  }

  function generarTokenUnico() {
    while (true) {
      const str = String(Math.floor(Math.random() * 100000)).padStart(5, "0");
      if (!tokensOcupados.has(str)) { tokensOcupados.add(str); return str; }
    }
  }

  function generarTelefonoUnico() {
    while (true) {
      const prefijo = PREFIJOS_TEL[Math.floor(Math.random() * PREFIJOS_TEL.length)];
      const resto = Math.floor(100000 + Math.random() * 900000);
      const raw = prefijo + resto;
      if (!telsOcupados.has(raw)) {
        telsOcupados.add(raw);
        return raw.slice(0, 4) + "-" + raw.slice(4);
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
      while (ap2 === ap1) ap2 = APELLIDOS[Math.floor(Math.random() * APELLIDOS.length)];

      const nombreCompleto = segundoNombre
        ? primerNombre + " " + segundoNombre + " " + ap1 + " " + ap2
        : primerNombre + " " + ap1 + " " + ap2;

      if (nombresOcupados.has(nombreCompleto.toLowerCase())) continue;

      const dom = DOMINIOS_EMAIL[Math.floor(Math.random() * DOMINIOS_EMAIL.length)];
      const sufijo = Math.floor(10 + Math.random() * 9990);
      const email = primerNombre.toLowerCase() + "." + ap1.toLowerCase() + sufijo + "@" + dom;

      if (emailsOcupados.has(email.toLowerCase())) continue;

      nombresOcupados.add(nombreCompleto.toLowerCase());
      emailsOcupados.add(email.toLowerCase());
      return { nombre: nombreCompleto, email };
    }
  }

  const listaPadrinos = [];
  const ordenes = [];
  const ahora = Date.now();
  const quincesDiasMs = 15 * 24 * 60 * 60 * 1000;
  const metodos = ["SINPE Movil","SINPE Movil","Tarjeta TiloPay","Tarjeta TiloPay","Apple Pay","Google Pay"];

  console.log("\n2. Generando " + PLAN_PAQUETES.length + " ordenes y " + targetTokens.toLocaleString() + " tokens...");

  for (let i = 0; i < PLAN_PAQUETES.length; i++) {
    if (i > 0 && i % 500 === 0) {
      process.stdout.write("   -> " + i + "/" + PLAN_PAQUETES.length + " paquetes generados...\r");
    }

    const pkg = PLAN_PAQUETES[i];
    const { nombre, email } = generarNombreYEmailUnicos();
    const telefono = generarTelefonoUnico();

    if (listaPadrinos.length < 400 && Math.random() > 0.5) {
      listaPadrinos.push(telefono.replace(/\D/g, ""));
    }

    const tokens = [];
    for (let t = 0; t < pkg.cant; t++) tokens.push(generarTokenUnico());

    const tieneSuper = Math.random() > 0.55;
    const montoSuper = tieneSuper ? (pkg.cant >= 24 ? 5000 : 1500) : 0;
    const precioTotal = pkg.precio + montoSuper;

    let refTag = "";
    if (listaPadrinos.length > 5 && Math.random() > 0.72) {
      const padrinoTel = listaPadrinos[Math.floor(Math.random() * listaPadrinos.length)];
      if (padrinoTel !== telefono.replace(/\D/g, "")) refTag = " [REF:" + padrinoTel + "]";
    }

    const fecha = new Date(ahora - Math.floor(Math.random() * quincesDiasMs)).toISOString();
    const metodo = metodos[Math.floor(Math.random() * metodos.length)];

    ordenes.push({
      id: generarIdUnico(),
      nombre,
      telefono,
      email,
      cantidad: pkg.cant,
      precio: precioTotal,
      numeros: tokens,
      comprobante_url: metodo === "SINPE Movil" ? "/comprobante-sinpe.jpg" : null,
      estado: "aprobada",
      fecha,
      metodo_pago: metodo,
      transaccion_id: "TX-" + Math.floor(100000 + Math.random() * 900000) + refTag,
      supertoken: tieneSuper,
      monto_supertoken: montoSuper,
    });
  }

  ordenes.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  console.log("\n3. Insertando " + ordenes.length.toLocaleString() + " ordenes en Supabase en lotes de 100...");
  const BATCH_SIZE = 100;
  let lotesFallidos = 0;

  for (let i = 0; i < ordenes.length; i += BATCH_SIZE) {
    const batch = ordenes.slice(i, i + BATCH_SIZE);
    const { error } = await supabase.from("ordenes").insert(batch);
    if (error) {
      console.error("\nError en lote " + (Math.floor(i / BATCH_SIZE) + 1) + ": " + error.message);
      lotesFallidos++;
      if (lotesFallidos > 5) { console.error("Demasiados errores, abortando."); process.exit(1); }
      continue;
    }
    process.stdout.write("   Lote " + (Math.floor(i / BATCH_SIZE) + 1) + "/" + Math.ceil(ordenes.length / BATCH_SIZE) + " (" + (i + batch.length) + "/" + ordenes.length + " ordenes)\r");
  }

  console.log("\n4. Actualizando inventario en Supabase...");
  const totalTokensEnDB = tokensOcupados.size;
  const inv = { total: 100000, disponibles: 100000 - totalTokensEnDB, fecha: new Date().toISOString() };
  const { error: invErr } = await supabase.from("inventario").upsert({ id: 1, ...inv });
  if (invErr) console.warn("No se pudo actualizar inventario:", invErr.message);

  const totalRecaudadoNuevo = ordenes.reduce((sum, o) => sum + o.precio, 0);
  console.log("\n=== INYECCION COMPLETADA CON EXITO ===");
  console.log("Nuevos paquetes insertados:   " + ordenes.length.toLocaleString());
  console.log("Nuevos tokens emitidos:       " + targetTokens.toLocaleString());
  console.log("Recaudado (esta inyeccion):   " + totalRecaudadoNuevo.toLocaleString("es-CR"));
  console.log("Total tokens en DB ahora:     " + totalTokensEnDB.toLocaleString());
  console.log("Porcentaje vendido estimado:  " + ((totalTokensEnDB / 100000) * 100).toFixed(2) + "%");
  console.log("Inventario disponible:        " + inv.disponibles.toLocaleString() + " tokens");
  if (lotesFallidos > 0) console.warn("Lotes con error: " + lotesFallidos);
}

void ejecutar();
