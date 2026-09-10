export function getDefaultMinutaNotarial(razonSocial: string, premioNombre: string, fechaSorteo: string): string {
  const razonUpper = (razonSocial || "Importadora Luxury Scents LTDA.").toUpperCase();
  return `================================================================================
ESCRITURA NÚMERO CIENTO OCHENTA Y CUATRO (184).- PROTOCOLIZACIÓN DE REGLAMENTO OFICIAL DE PROMOCIÓN COMERCIAL PRIVADA "AVAL COMMUNITY CR".-
================================================================================

En la ciudad de San José, República de Costa Rica, al ser las diez horas del día quince de agosto de dos mil veintiséis.- Ante mí, [NOMBRE DEL NOTARIO PÚBLICO], Notario Público con oficina abierta en esta ciudad, comparece el señor [NOMBRE DEL REPRESENTANTE LEGAL], mayor de edad, [estado civil], [profesión u oficio], vecino de [lugar de residencia], portador de la cédula de identidad número [NÚMERO DE CÉDULA], actuando en su condición de Gerente / Apoderado Generalísimo sin límite de suma de la sociedad denominada "${razonUpper}", con cédula de persona jurídica número [CÉDULA JURÍDICA], personería que consta debidamente inscrita en la Sección Mercantil del Registro Nacional de Costa Rica, y al efecto DICE:

PRIMERA: OBJETO DE LA COMPARECENCIA Y ACTIVIDAD COMERCIAL.-
Que su representada "${razonUpper}" es una sociedad mercantil legalmente constituida que se dedica a la importación, comercialización y distribución de productos comerciales, fragancias de lujo, accesorios y prestación de servicios digitales. Que con el propósito exclusivo de promover e incentivar las ventas comerciales de su catálogo de productos y fidelizar a sus clientes, ha diseñado y organizado la PROMOCIÓN COMERCIAL PRIVADA denominada "AVAL COMMUNITY CR", la cual se regirá por las disposiciones de la Ley N° 7472 (Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor), su Reglamento Ejecutivo y el Código de Comercio de la República de Costa Rica.

SEGUNDA: NATURALEZA JURÍDICA DE LOS "TOKENS" Y PRODUCTO ADQUIRIDO.-
A) Se hace constar de forma expresa que "${razonUpper}" NO vende billetes de lotería, rifas clandestinas ni realiza actividades de intermediación de apuestas.
B) Los consumidores adquieren legítimamente paquetes de productos comerciales, suscripciones digitales y/o cuponeras de descuento comercial emitidas por la empresa, por los cuales se expide la correspondiente Factura Electrónica conforme a la legislación tributaria costarricense y la Dirección General de Tributación (DGT).
C) Por cada compra comercial realizada, el cliente recibe a título de CORTESÍA GRATUITA y sin costo monetario independiente uno o varios códigos numéricos digitales denominados "Tokens Promocionales", los cuales acreditan su derecho de participación en los sorteos de la promoción comercial.

TERCERA: CLÁUSULA DE DESLINDE Y USO DE FE PÚBLICA EXTERNA (JUNTA DE PROTECCIÓN SOCIAL).-
Se deja formal y expresamente consignado que la presente promoción comercial NO está organizada, patrocinada, administrada ni afiliada a la Junta de Protección Social (JPS) de Costa Rica. La empresa organizadora utiliza la extracción pública y televisada de los sorteos oficiales de la Lotería Nacional de Costa Rica única y exclusivamente como un MECANISMO EXTERNO, NEUTRAL, TRANSPARENTE E INALTERABLE DE FE PÚBLICA para determinar con absoluta aleatoriedad e imparcialidad los códigos numéricos favorecidos, sin que ello implique vulneración de las disposiciones de la Ley N° 7395.

CUARTA: MECÁNICA DE ASIGNACIÓN Y DETERMINACIÓN DEL CÓDIGO GANADOR.-
La determinación de los códigos participantes favorecidos se efectuará mediante la combinación matemática directa de los resultados oficiales emitidos por la Junta de Protección Social en el sorteo de la fecha señalada, estructurándose de la siguiente forma:
1. PRIMER PREMIO MAYOR: Se conformará por el Número oficial de dos (2) dígitos seguido de la Serie oficial de tres (3) dígitos del Primer Premio de la Lotería Nacional (Ejemplo: Número 01 + Serie 451 = Código 01451).
2. SEGUNDO PREMIO: Número oficial de dos (2) dígitos seguido de la Serie oficial de tres (3) dígitos del Segundo Premio oficial.
3. TERCER PREMIO: Número oficial de dos (2) dígitos seguido de la Serie oficial de tres (3) dígitos del Tercer Premio oficial.

QUINTA: PREMIOS, FECHA DEL EVENTO Y REPROGRAMACIÓN.-
A) PREMIO MAYOR EN JUEGO: ${premioNombre || "Moto de Alta Cilindrada (o Vehículo a Elección)"}.
B) FECHA OFICIAL: El evento promocional se proyecta para el día ${fechaSorteo || "27 de septiembre de 2026"}.
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
La empresa organizadora "${razonUpper}" se reserva el derecho expreso de actualizar, complementar, modificar o perfeccionar en cualquier momento las cláusulas operativas, dinámicas de fidelización, catálogo de premios e incentivos de la plataforma, siempre que dichas reformas tengan por objeto optimizar la experiencia, incrementar los beneficios comerciales de los participantes o velar por el interés colectivo de la comunidad de usuarios. Dichas modificaciones surtirán efectos legales plenos a partir de su publicación oficial en el sitio web de la plataforma.

OCTAVA: ACEPTACIÓN Y PROTOCOLIZACIÓN.-
El compareciente solicita al suscrito Notario protocolizar en todas sus partes el presente Reglamento Oficial de Promoción Comercial para que surta plenos efectos jurídicos, obligándose su representada a publicarlo íntegramente en la dirección electrónica oficial de la plataforma (https://avalcommunity.cr/terminos) a disposición permanente de los consumidores y autoridades competentes.

Leída la presente escritura al compareciente, la encuentra conforme, la aprueba y firmamos en la ciudad de San José, a las diez horas con cuarenta y cinco minutos del día quince de agosto de dos mil veintiséis.- DOY FE.-

_________________________________________
${razonUpper}
Cédula Jurídica: [CÉDULA JURÍDICA]
Representante Legal / Compareciente

_________________________________________
[NOMBRE DEL NOTARIO PÚBLICO]
Notario Público - Carné Colegio de Abogados: [N° DE CARNÉ]
(Engrose y Timbres de Ley en Papel de Seguridad Notarial)`;
}

export function getDefaultTerminos(razonSocial: string, telSinpe: string): string {
  const razon = razonSocial || "Importadora Luxury Scents LTDA.";
  const tel = telSinpe || "8634-4772";
  return `### 1. Evento Promocional 100% Transparente y Legal
El presente evento constituye una **promoción comercial privada** organizada de conformidad con la **Ley N° 7472 (Ley de Promoción de la Competencia y Defensa Efectiva del Consumidor de Costa Rica)** y el Código de Comercio. La adquisición de productos o servicios comerciales de la empresa otorga al consumidor códigos promocionales de cortesía (Tokens) para participar en las dinámicas oficiales.

### 2. Cláusula de Deslinde y Uso de Fe Pública Externa (JPS)
La plataforma aclara de forma expresa que **no está asociada, afiliada ni patrocinada por la Junta de Protección Social (JPS)**.
Se utiliza la extracción pública y televisada de la Lotería Nacional de Costa Rica exclusivamente como un **mecanismo neutral, externo e inalterable de fe pública** para garantizar absoluta transparencia y aleatoriedad en la determinación de los códigos participantes favorecidos.

### 3. Instrucciones de Pago y SINPE Móvil
- **Teléfono SINPE Móvil Oficial:** ${tel}
- **Titular Oficial de la Cuenta:** ${razon}

> **REGLA ESTRICTA DE MOTIVO EN SINPE:**
> En el motivo o detalle de pago por SINPE escribe **únicamente tu nombre y apellidos**. Por disposiciones bancarias, **NO** escribas palabras como *"rifa"*, *"sorteo"*, *"premio"* o similares.

### 4. Reserva de Tokens y Validación
Una vez realizado el pago, debes adjuntar la captura del comprobante en el sistema para que nuestro equipo lo valide y tu participación quede formalmente confirmada.
- **Plazo de Reserva Máximo:** La acción permanecerá reservada por un **máximo de 24 horas**. Si dentro de ese plazo el depósito no ha sido validado con el comprobante correspondiente, la acción será liberada de forma automática y quedará disponible para que otra persona la adquiera.

### 5. ¿Cómo se determinarán los Ganadores?
Los números ganadores se calcularán de acuerdo con las siguientes combinaciones matemáticas directas basadas en el sorteo oficial:
- **Primer Premio (1° Lugar):** Número (2 dígitos) + Serie (3 dígitos) del Primer Premio de la Lotería Nacional (Ejemplo: Número 01 + Serie 451 = **01451**).
- **Segundo Premio (2° Lugar):** Número (2 dígitos) + Serie (3 dígitos) del Segundo Premio oficial de la Lotería Nacional (Ejemplo: Número 81 + Serie 160 = **81160**).
- **Tercer Premio (3° Lugar):** Número (2 dígitos) + Serie (3 dígitos) del Tercer Premio oficial de la Lotería Nacional (Ejemplo: Número 60 + Serie 562 = **60562**).

### 6. Fecha del Evento y Condiciones de Cierre
- El evento promocional está programado oficialmente para la fecha publicada en la plataforma.
- Si para dicha fecha no se ha colocado el **100% de las acciones disponibles**, el evento será reprogramado periódicamente hasta alcanzar la totalidad del inventario.
- Si el **100% de las acciones se completa con antelación**, el evento se adelantará y se realizará el domingo más cercano posterior a la finalización de las ventas, informando oportunamente la fecha definitiva por nuestros canales oficiales.

### 7. Modificaciones y Mejoras Continuas en Beneficio de la Comunidad
**${razon}** se reserva la facultad de actualizar, complementar, modificar o perfeccionar en cualquier momento las presentes bases, dinámicas promocionales, catálogo de premios e incentivos de la plataforma, siempre que dichas modificaciones tengan como objetivo **mejorar la experiencia del usuario, incrementar los beneficios comerciales de los participantes o responder a las necesidades colectivas de la comunidad**.
Toda modificación o mejora entrará en vigencia y surtirá plenos efectos legales a partir de su publicación oficial en este sitio web.`;
}

export function getDefaultPrivacidad(razonSocial: string): string {
  const razon = razonSocial || "Importadora Luxury Scents LTDA.";
  return `### 1. Recopilación de Información
Para procesar tu participación y asignación de tokens digitales en nuestros eventos promocionales, recopilamos únicamente los datos indispensables de contacto: nombre completo, número de teléfono celular, correo electrónico y la captura del comprobante de pago por SINPE Móvil o pasarelas de pago.

### 2. Finalidad del Uso de Datos
La información suministrada se utiliza de forma estricta y exclusiva para:
- Validar los depósitos y asignación de números de tokens oficiales.
- Permitir la consulta de tus tokens mediante tu número celular en nuestra plataforma.
- Contactarte de inmediato en caso de resultar favorecido con alguno de los premios principales o instantáneos.
- Realizar los trámites legales de adjudicación y traspaso notarial de los premios oficiales a tu nombre.

### 3. Confidencialidad y No Divulgación
Aval Community CR y **${razon}** garantizan que tus datos personales **nunca** serán vendidos, cedidos, transferidos ni compartidos con empresas externas o terceras partes para fines publicitarios.

### 4. Seguridad del Almacenamiento
Toda la información viaja encriptada mediante protocolo SSL/TLS y se almacena en infraestructuras con seguridad de nivel bancario. Las capturas de comprobantes se resguardan en servidores protegidos accesibles únicamente por el personal administrativo autorizado.

### 5. Actualizaciones y Mejoras en Beneficio de la Comunidad
Con el propósito de mantener los más altos estándares de ciberseguridad, incorporar nuevas tecnologías y brindar mayores beneficios operativos a la comunidad de participantes, nos reservamos el derecho de modificar o actualizar la presente Política de Privacidad en cualquier momento. Toda actualización entrará en vigencia inmediatamente tras su publicación en esta plataforma, en estricto cumplimiento con la **Ley N° 8968 (Protección de la Persona frente al Tratamiento de sus Datos Personales de Costa Rica)** y los lineamientos de la PRODHAB.`;
}

export function getDefaultReembolso(razonSocial: string, telWhatsapp: string): string {
  const razon = razonSocial || "Importadora Luxury Scents LTDA.";
  const tel = telWhatsapp || "8634-4772";
  return `### 1. Casos en que Aplica Reembolso
En **Aval Community CR** (${razon}) procesamos devoluciones y reembolsos de dinero en los siguientes escenarios:
- **Pagos Duplicados o Excedentes:** Si realizaste un doble pago por SINPE Móvil o tu tarjeta fue procesada más de una vez por error involuntario.
- **Órdenes Rechazadas con Depósito Confirmado:** Si tu orden fue rechazada por inconsistencia de datos o agotamiento de stock pero el dinero ingresó a nuestra cuenta bancaria.
- **Cancelación Definitiva del Evento:** En el caso fortuito o de fuerza mayor en que el evento promocional sea cancelado de manera definitiva sin reprogramación, se reintegrará el 100% del monto aportado a cada participante.

### 2. Plazos y Métodos de Devolución
Una vez verificada la solicitud por nuestro equipo administrativo:
- **SINPE Móvil:** Las devoluciones se realizan en un plazo máximo de **24 a 48 horas hábiles** al mismo número telefónico desde el cual se originó el pago.
- **Tarjeta de Débito/Crédito (TiloPay):** La reversión se solicita de inmediato a la pasarela; el reflejo en el estado de cuenta depende de la entidad bancaria emisora (habitualmente de 3 a 7 días hábiles).
- **Criptomonedas (USDT):** La devolución se procesa a la misma dirección de billetera remitente (menos el fee de red de la blockchain).

### 3. Excepciones (Casos No Reembolsables)
Debido a la naturaleza de las promociones digitales y la reserva exclusiva de números de la suerte:
- No se realizarán reembolsos una vez que la orden ha sido validada y los números de tokens han quedado formalmente asignados al participante, salvo los casos estipulados en el punto 1.
- No aplican reembolsos una vez ejecutado el sorteo oficial de la fecha programada.

### 4. ¿Cómo Solicitar tu Reembolso?
Para tramitar tu solicitud, por favor contáctanos con tu número de orden y comprobante al WhatsApp oficial: **${tel}**.`;
}
