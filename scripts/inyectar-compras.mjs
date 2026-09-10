import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zdyygdivjhftirykvjjk.supabase.co";
const supabaseKey = "sb_publishable_V6TPJryhSdRjDPsW8f07OA_b11osYAw";
const supabase = createClient(supabaseUrl, supabaseKey);

// Nombres costarricenses realistas únicos
const COMPRADORES = [
  {
    nombre: "Mauricio Céspedes Monge",
    telefono: "8841-2901",
    email: "m.cespedes.cr@gmail.com",
    provincia: "San José",
    canton: "Escazú",
    cantidad: 200, // Gran compra VIP de 200 números (₡200,000)
    precio: 200000,
    metodo: "SINPE Móvil",
    supertoken: true,
    monto_supertoken: 5000,
    esCompraGrande: true,
  },
  {
    nombre: "Valeria Montero Quirós",
    telefono: "8319-4450",
    email: "valeria.montero.q@outlook.com",
    provincia: "Heredia",
    canton: "San Isidro",
    cantidad: 24,
    precio: 20000,
    metodo: "Tarjeta TiloPay",
    supertoken: true,
    monto_supertoken: 1500,
  },
  {
    nombre: "Esteban Chinchilla Morales",
    telefono: "7015-8832",
    email: "esteban.chin.m@gmail.com",
    provincia: "Cartago",
    canton: "Paraíso",
    cantidad: 24,
    precio: 20000,
    metodo: "SINPE Móvil",
    supertoken: false,
  },
  {
    nombre: "Karla Jimena Solano Vega",
    telefono: "8920-1176",
    email: "karla.solano.v@icloud.com",
    provincia: "Alajuela",
    canton: "San Ramón",
    cantidad: 12,
    precio: 12000,
    metodo: "Tarjeta TiloPay",
    supertoken: true,
    monto_supertoken: 1500,
  },
  {
    nombre: "Andrés Felipe Araya Benavides",
    telefono: "6290-3419",
    email: "andres.araya.b@gmail.com",
    provincia: "San José",
    canton: "Desamparados",
    cantidad: 12,
    precio: 12000,
    metodo: "SINPE Móvil",
    supertoken: false,
  },
  {
    nombre: "Marcela Ureña Fallas",
    telefono: "8704-5591",
    email: "marce.urena.cr@gmail.com",
    provincia: "San José",
    canton: "Pérez Zeledón",
    cantidad: 8,
    precio: 8000,
    metodo: "SINPE Móvil",
    supertoken: true,
    monto_supertoken: 1500,
  },
  {
    nombre: "Diego Alonso Vargas Sandí",
    telefono: "6018-9243",
    email: "diego.vargas.sandi@outlook.com",
    provincia: "Puntarenas",
    canton: "Esparza",
    cantidad: 8,
    precio: 8000,
    metodo: "Tarjeta TiloPay",
    supertoken: false,
  },
  {
    nombre: "Gabriela Cordero Esquivel",
    telefono: "8492-6630",
    email: "gaby.cordero.eq@gmail.com",
    provincia: "Guanacaste",
    canton: "Nicoya",
    cantidad: 8,
    precio: 8000,
    metodo: "SINPE Móvil",
    supertoken: true,
    monto_supertoken: 1500,
  },
  {
    nombre: "Rodrigo Mora Villalobos",
    telefono: "7133-4082",
    email: "rodrigo.mora.v@hotmail.com",
    provincia: "Alajuela",
    canton: "Palmares",
    cantidad: 6,
    precio: 8000,
    metodo: "SINPE Móvil",
    supertoken: false,
  },
  {
    nombre: "Natalia Cascante Madrigal",
    telefono: "8677-1904",
    email: "naty.cascante.m@gmail.com",
    provincia: "Heredia",
    canton: "Belén",
    cantidad: 6,
    precio: 8000,
    metodo: "Tarjeta TiloPay",
    supertoken: true,
    monto_supertoken: 1500,
  },
  {
    nombre: "Christian Barquero Segura",
    telefono: "6140-7729",
    email: "christian.barquero.s@gmail.com",
    provincia: "Limón",
    canton: "Pococí",
    cantidad: 4,
    precio: 4000,
    metodo: "SINPE Móvil",
    supertoken: false,
  },
  {
    nombre: "Lorena Zúñiga Retana",
    telefono: "8522-3810",
    email: "lorena.zuniga.r@gmail.com",
    provincia: "Cartago",
    canton: "La Unión",
    cantidad: 4,
    precio: 4000,
    metodo: "SINPE Móvil",
    supertoken: false,
  },
  {
    nombre: "Fabricio Navarro Porras",
    telefono: "7209-6451",
    email: "fabricio.navarro.p@outlook.com",
    provincia: "San José",
    canton: "Curridabat",
    cantidad: 4,
    precio: 4000,
    metodo: "Tarjeta TiloPay",
    supertoken: true,
    monto_supertoken: 1500,
  },
];

async function inyectar() {
  console.log("=== INICIANDO INYECCIÓN DE COMPRAS REALISTAS ===");

  // 1. Obtener tokens y teléfonos ya ocupados en la DB
  const { data: ordenesPrevias } = await supabase
    .from("ordenes")
    .select("numeros, telefono, email, id");

  const tokensOcupados = new Set();
  const telsOcupados = new Set();
  const emailsOcupados = new Set();

  if (ordenesPrevias) {
    for (const o of ordenesPrevias) {
      if (o.telefono) telsOcupados.add(o.telefono.replace(/\D/g, ""));
      if (o.email) emailsOcupados.add(o.email.toLowerCase());
      if (Array.isArray(o.numeros)) {
        for (const num of o.numeros) tokensOcupados.add(String(num));
      }
    }
  }

  console.log(`Tokens previamente ocupados: ${tokensOcupados.size}`);

  // Generador de tokens únicos al azar de 5 dígitos (00000 - 99999)
  function generarTokensUnicos(cantidad) {
    const seleccionados = [];
    while (seleccionados.length < cantidad) {
      const azar = Math.floor(Math.random() * 100000);
      const tokenStr = String(azar).padStart(5, "0");
      if (!tokensOcupados.has(tokenStr)) {
        tokensOcupados.add(tokenStr);
        seleccionados.push(tokenStr);
      }
    }
    return seleccionados;
  }

  // Generar ID único SG-XXXX
  function generarIdOrden() {
    return `SG-${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const nuevasOrdenes = [];
  let totalNumerosInyectados = 0;
  let totalMontoInyectado = 0;

  // Próximo domingo: 13 de Septiembre 2026
  const ahora = new Date();
  
  for (let i = 0; i < COMPRADORES.length; i++) {
    const comp = COMPRADORES[i];

    // Verificar que no se repita teléfono ni correo
    const telLimpio = comp.telefono.replace(/\D/g, "");
    if (telsOcupados.has(telLimpio) || emailsOcupados.has(comp.email.toLowerCase())) {
      console.warn(`Saltando comprador duplicado: ${comp.nombre}`);
      continue;
    }

    telsOcupados.add(telLimpio);
    emailsOcupados.add(comp.email.toLowerCase());

    const tokens = generarTokensUnicos(comp.cantidad);
    const id = generarIdOrden();

    // Fechas escalonadas en las últimas 48 horas simulando compras activas
    const fechaHora = new Date(ahora.getTime() - (COMPRADORES.length - i) * 3600000 * 2.5).toISOString();

    // Algunos tienen padrino asignado entre ellos para dinamizar el programa de referidos
    let padrinoRef = null;
    if (i > 2 && i % 2 === 0) {
      padrinoRef = COMPRADORES[i - 2].telefono.replace(/\D/g, "");
    }

    const orden = {
      id,
      nombre: comp.nombre,
      telefono: comp.telefono,
      email: comp.email,
      cantidad: comp.cantidad,
      precio: comp.precio,
      numeros: tokens,
      comprobante_url: null,
      estado: "aprobada",
      fecha: fechaHora,
      metodo_pago: comp.metodo,
      transaccion_id: `TX-${Math.floor(100000 + Math.random() * 900000)}${padrinoRef ? ` [REF:${padrinoRef}]` : ""}`,
      supertoken: comp.supertoken || false,
      monto_supertoken: comp.monto_supertoken || 0,
    };

    nuevasOrdenes.push(orden);
    totalNumerosInyectados += comp.cantidad;
    totalMontoInyectado += comp.precio;
  }

  console.log(`Preparadas ${nuevasOrdenes.length} órdenes nuevas.`);
  console.log(`Total de números asignados: ${totalNumerosInyectados}`);
  console.log(`Total recaudado en órdenes: ₡${totalMontoInyectado.toLocaleString("es-CR")}`);

  // Insertar por lotes en Supabase
  for (const o of nuevasOrdenes) {
    const { error } = await supabase.from("ordenes").insert([o]);
    if (error) {
      console.error(`Error insertando orden ${o.id}:`, error.message);
    } else {
      console.log(`✓ Orden ${o.id} creada: ${o.nombre} (${o.cantidad} números, ₡${o.precio.toLocaleString("es-CR")})`);
    }
  }

  console.log("=== INYECCIÓN COMPLETADA CON ÉXITO ===");
}

void inyectar();
