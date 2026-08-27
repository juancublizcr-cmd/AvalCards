import { useState } from "react";
import { Copy, Check, Printer, Download, Scale, ShieldCheck, FileText, Sparkles, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { type Config, type Sorteo } from "@/lib/admin-store";

export function ReglamentoNotarialSection({
  config,
  sorteo,
}: {
  config: Config;
  sorteo: Sorteo;
}) {
  const [copiado, setCopiado] = useState(false);

  const razonSocial = config.razonSocial || "Importadora Luxury Scents LTDA";
  const fechaSorteo = sorteo.fecha || "27 de septiembre de 2026";
  const premioNombre = sorteo.titulo || "Vehículo Toyota Prado VX 2026 0KM + $6,000 Cash";

  const textoEscritura = `================================================================================
ESCRITURA NÚMERO CIENTO OCHENTA Y CUATRO (184).- PROTOCOLIZACIÓN DE REGLAMENTO OFICIAL DE PROMOCIÓN COMERCIAL PRIVADA "AVAL MOTORS CR".-
================================================================================

En la ciudad de San José, República de Costa Rica, al ser las diez horas del día quince de agosto de dos mil veintiséis.- Ante mí, [NOMBRE DEL NOTARIO PÚBLICO], Notario Público con oficina abierta en esta ciudad, comparece el señor [NOMBRE DEL REPRESENTANTE LEGAL], mayor de edad, [estado civil], [profesión u oficio], vecino de [lugar de residencia], portador de la cédula de identidad número [NÚMERO DE CÉDULA], actuando en su condición de Gerente / Apoderado Generalísimo sin límite de suma de la sociedad denominada "${razonSocial.toUpperCase()}", con cédula de persona jurídica número [CÉDULA JURÍDICA], personería que consta debidamente inscrita en la Sección Mercantil del Registro Nacional de Costa Rica, y al efecto DICE:

PRIMERA: OBJETO DE LA COMPARECENCIA Y ACTIVIDAD COMERCIAL.-
Que su representada "${razonSocial.toUpperCase()}" es una sociedad mercantil legalmente constituida que se dedica a la importación, comercialización y distribución de productos comerciales, fragancias de lujo, accesorios y prestación de servicios digitales. Que con el propósito exclusivo de promover e incentivar las ventas comerciales de su catálogo de productos y fidelizar a sus clientes, ha diseñado y organizado la PROMOCIÓN COMERCIAL PRIVADA denominada "AVAL MOTORS CR", la cual se regirá por las disposiciones de la Ley N° 7472 (Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor), su Reglamento Ejecutivo y el Código de Comercio de la República de Costa Rica.

SEGUNDA: NATURALEZA JURÍDICA DE LOS "TOKENS" Y PRODUCTO ADQUIRIDO.-
A) Se hace constar de forma expresa que "${razonSocial.toUpperCase()}" NO vende billetes de lotería, rifas clandestinas ni realiza actividades de intermediación de apuestas.
B) Los consumidores adquieren legítimamente paquetes de productos comerciales, suscripciones digitales y/o cuponeras de descuento comercial emitidas por la empresa, por los cuales se expide la correspondiente Factura Electrónica conforme a la legislación tributaria costarricense y la Dirección General de Tributación (DGT).
C) Por cada compra comercial realizada, el cliente recibe a título de CORTESÍA GRATUITA y sin costo monetario independiente uno o varios códigos alfanuméricos digitales denominados "Tokens Promocionales", los cuales acreditan su derecho de participación en los sorteos de la promoción comercial.

TERCERA: CLÁUSULA DE DESLINDE Y USO DE FE PÚBLICA EXTERNA (JUNTA DE PROTECCIÓN SOCIAL).-
Se deja formal y expresamente consignado que la presente promoción comercial NO está organizada, patrocinada, administrada ni afiliada a la Junta de Protección Social (JPS) de Costa Rica. La empresa organizadora utiliza la extracción pública y televisada de los sorteos oficiales de la Lotería Nacional de Costa Rica única y exclusivamente como un MECANISMO EXTERNO, NEUTRAL, TRANSPARENTE E INALTERABLE DE FE PÚBLICA para determinar con absoluta aleatoriedad e imparcialidad los códigos numéricos favorecidos, sin que ello implique vulneración de las disposiciones de la Ley N° 7395.

CUARTA: MECÁNICA DE ASIGNACIÓN Y DETERMINACIÓN DEL CÓDIGO GANADOR.-
La determinación de los códigos participantes favorecidos se efectuará mediante la combinación matemática directa de los resultados oficiales emitidos por la Junta de Protección Social en el sorteo de la fecha señalada, estructurándose de la siguiente forma:
1. PRIMER PREMIO MAYOR: Se conformará por el Número oficial de dos (2) dígitos seguido de la Serie oficial de tres (3) dígitos del Primer Premio de la Lotería Nacional (Ejemplo: Número 01 + Serie 451 = Código 01451).
2. SEGUNDO PREMIO: Número oficial de dos (2) dígitos seguido de la Serie oficial de tres (3) dígitos del Segundo Premio oficial.
3. TERCER PREMIO: Número oficial de dos (2) dígitos seguido de la Serie oficial de tres (3) dígitos del Tercer Premio oficial.

QUINTA: PREMIOS, FECHA DEL EVENTO Y REPROGRAMACIÓN.-
A) PREMIO MAYOR EN JUEGO: ${premioNombre}.
B) FECHA OFICIAL: El evento promocional se proyecta para el día ${fechaSorteo}.
C) CONDICIONES DE CIERRE:
   - Si a la fecha prevista se ha colocado la totalidad del inventario de tokens, el sorteo se ejecutará indefectiblemente en dicha fecha.
   - Si la totalidad de los tokens se completase con antelación, la empresa podrá adelantar el sorteo al domingo más cercano posterior a la finalización de inventario, notificándolo previamente a los consumidores por sus plataformas oficiales.
   - De no alcanzarse el umbral operativo mínimo requerido para la adjudicación íntegra, la empresa se reserva el derecho de reprogramar la fecha mediante prórrogas periódicas hasta la total colocación de los tokens.

SEXTA: REQUISITOS DEL GANADOR Y PROTOCOLO NOTARIAL DE ENTREGA.-
Para hacer efectivo el reclamo y traspaso del premio, el favorecido deberá cumplir estrictamente con los siguientes requisitos:
1. Ser mayor de dieciocho (18) años.
2. Presentar su documento de identidad original y vigente (Cédula de Identidad para nacionales o DIMEX/Pasaporte para extranjeros residentes).
3. Acreditar que el número telefónico y datos de registro coinciden con el código favorecido verificado en la base de datos digital de la plataforma.
4. El favorecido dispondrá de un plazo improrrogable de treinta (30) días naturales a partir de la fecha de realización del sorteo para apersonarse a coordinar la formalización.
5. La entrega formal se realizará mediante comparecencia ante Notario Público, levantándose la respectiva ACTA NOTARIAL DE ADJUDICACIÓN Y ENTREGA DE PREMIO PROMOCIONAL y formalizándose la escritura pública de traspaso ante el Registro Nacional de Costa Rica libre de gravámenes, anotaciones o prendas.

SÉPTIMA: FACULTAD DE MODIFICACIÓN Y MEJORAS EN BENEFICIO DE LA COMUNIDAD.-
La empresa organizadora "${razonSocial.toUpperCase()}" se reserva el derecho expreso de actualizar, complementar, modificar o perfeccionar en cualquier momento las cláusulas operativas, dinámicas de fidelización, catálogo de premios e incentivos de la plataforma, siempre que dichas reformas tengan por objeto optimizar la experiencia, incrementar los beneficios comerciales de los participantes o velar por el interés colectivo de la comunidad de usuarios. Dichas modificaciones surtirán efectos legales plenos a partir de su publicación oficial en el sitio web de la plataforma.

OCTAVA: ACEPTACIÓN Y PROTOCOLIZACIÓN.-
El compareciente solicita al suscrito Notario protocolizar en todas sus partes el presente Reglamento Oficial de Promoción Comercial para que surta plenos efectos jurídicos, obligándose su representada a publicarlo íntegramente en la dirección electrónica oficial de la plataforma (https://avalmotors.cr/terminos) a disposición permanente de los consumidores y autoridades competentes.

Leída la presente escritura al compareciente, la encuentra conforme, la aprueba y firmamos en la ciudad de San José, a las diez horas con cuarenta y cinco minutos del día quince de agosto de dos mil veintiséis.- DOY FE.-

_________________________________________
${razonSocial.toUpperCase()}
Cédula Jurídica: [CÉDULA JURÍDICA]
Representante Legal / Compareciente

_________________________________________
[NOMBRE DEL NOTARIO PÚBLICO]
Notario Público - Carné Colegio de Abogados: [N° DE CARNÉ]
(Engrose y Timbres de Ley en Papel de Seguridad Notarial)`;

  const copiarTexto = () => {
    void navigator.clipboard.writeText(textoEscritura);
    setCopiado(true);
    toast.success("¡Texto de Escritura Notarial copiado!", {
      description: "Puedes pegarlo directamente en Word o enviárselo a tu Notario.",
    });
    setTimeout(() => setCopiado(false), 3000);
  };

  const imprimirTexto = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in-50">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Scale className="size-3.5" /> PROTOCOLIZACIÓN NOTARIAL · COSTA RICA
          </div>
          <h2 className="text-2xl font-black text-foreground mt-2 flex items-center gap-2">
            📜 Escritura de Reglamento en Papel de Seguridad
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-2xl">
            Minuta modelo lista para protocolizar en el tomo de tu Notario Público y emitir testimonio en papel de seguridad con timbres de ley.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={copiarTexto}
            className="gap-2 border-primary/40 text-primary hover:bg-primary/10 font-bold"
          >
            {copiado ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            {copiado ? "¡Copiado!" : "Copiar Minuta Notarial"}
          </Button>

          <Button
            type="button"
            variant="hero"
            size="sm"
            onClick={imprimirTexto}
            className="gap-2 font-black shadow-md"
          >
            <Printer className="size-4" /> Imprimir Documento
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            asChild
            className="gap-2 border-border"
          >
            <a href="/ESTRUCTURA_LEGAL_Y_COMERCIAL_CR.pdf" target="_blank" rel="noopener noreferrer">
              <Download className="size-4" /> PDF Estructura
            </a>
          </Button>
        </div>
      </div>

      {/* 3 Tarjetas de Resumen Notarial */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/20 text-primary text-base font-bold">
            ⚖️
          </div>
          <div className="font-bold text-sm text-foreground">Fundamento Legal MEIC</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Amparado en la <strong>Ley N° 7472</strong> y el Código de Comercio. La dinámica califica como promoción comercial privada de fidelización.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 text-base font-bold">
            🛡️
          </div>
          <div className="font-bold text-sm text-foreground">Deslinde de Monopolio JPS</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            La Lotería Nacional se utiliza únicamente como <strong>testigo neutral de fe pública externa</strong>, sin intermediación de apuestas.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 text-base font-bold">
            📑
          </div>
          <div className="font-bold text-sm text-foreground">Papel de Seguridad Notarial</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            El notario asienta la matriz en su tomo y emite el <strong>primer testimonio en papel de seguridad</strong> con los timbres del Colegio de Abogados.
          </p>
        </div>
      </div>

      {/* Visor de Minuta Notarial Oficial */}
      <div className="rounded-2xl border-2 border-border bg-zinc-950 p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-400">
            <FileText className="size-4" /> MINUTA NOTARIAL PROTOCOLIZABLE (LISTA PARA NOTARIO PÚBLICO)
          </div>
          <span className="text-[11px] font-mono text-zinc-400">República de Costa Rica · Tomo Matriz</span>
        </div>

        <div className="rounded-xl bg-black/80 border border-zinc-800/80 p-5 font-mono text-xs text-zinc-300 leading-relaxed max-h-[540px] overflow-y-auto whitespace-pre-wrap selection:bg-amber-500 selection:text-black">
          {textoEscritura}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
          <span>💡 Puedes editar los corchetes <code>[NOMBRE DEL NOTARIO]</code> y <code>[CÉDULA JURÍDICA]</code> con los datos reales de tu empresa.</span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={copiarTexto}
            className="border-amber-500/40 text-amber-400 hover:bg-amber-500/10 font-bold shrink-0"
          >
            {copiado ? "✓ Texto Copiado" : "📋 Copiar para Enviar al Notario"}
          </Button>
        </div>
      </div>
    </div>
  );
}
