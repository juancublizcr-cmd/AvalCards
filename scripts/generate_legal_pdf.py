import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#71717a"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "AVAL MOTORS CR · ESTRUCTURA LEGAL, TRIBUTARIA Y COMERCIAL")
            self.drawRightString(612 - 54, 750, "IMPORTADORA LUXURY SCENTS LTDA")
            self.setStrokeColor(colors.HexColor("#e4e4e7"))
            self.setLineWidth(0.5)
            self.line(54, 742, 612 - 54, 742)
            
        # Footer
        self.setStrokeColor(colors.HexColor("#e4e4e7"))
        self.setLineWidth(0.5)
        self.line(54, 45, 612 - 54, 45)
        
        self.drawString(54, 32, "Confidencial · Marco Jurídico Ley N° 7472 (MEIC) / Código de Comercio de Costa Rica")
        page_text = f"Página {self._pageNumber} de {page_count}"
        self.drawRightString(612 - 54, 32, page_text)
        self.restoreState()

def build_pdf():
    pdf_path = os.path.abspath("ESTRUCTURA_LEGAL_Y_COMERCIAL_CR.pdf")
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=64,
        bottomMargin=58
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    primary_color = colors.HexColor("#ea580c")    # Naranja Fuego
    dark_color = colors.HexColor("#09090b")       # Casi negro
    text_color = colors.HexColor("#27272a")       # Zinc oscuro
    muted_color = colors.HexColor("#52525b")      # Zinc medio
    accent_gold = colors.HexColor("#d97706")      # Ámbar
    emerald_color = colors.HexColor("#059669")    # Esmeralda

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=primary_color,
        alignment=TA_CENTER,
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=dark_color,
        alignment=TA_CENTER,
        spaceAfter=15
    )

    meta_style = ParagraphStyle(
        'DocMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=muted_color,
        alignment=TA_CENTER,
        spaceAfter=20
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=17,
        textColor=primary_color,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Heading3'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=dark_color,
        spaceBefore=8,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=text_color,
        alignment=TA_JUSTIFY,
        spaceAfter=7
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )

    quote_style = ParagraphStyle(
        'QuoteText',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9,
        leading=13,
        textColor=colors.HexColor("#1e293b"),
        alignment=TA_JUSTIFY
    )

    story = []

    # Title & Metadata
    story.append(Paragraph("⚖️ MARCO LEGAL, TRIBUTARIO Y ESTRATEGIA COMERCIAL", title_style))
    story.append(Paragraph("AVAL MOTORS CR · PLATAFORMA DIGITAL DE PREMIOS Y PROMOCIONES", subtitle_style))
    story.append(Paragraph("<b>Operada por:</b> Importadora Luxury Scents LTDA &nbsp;|&nbsp; <b>Jurisdicción:</b> República de Costa Rica &nbsp;|&nbsp; <b>Fecha:</b> Agosto 2026", meta_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceBefore=0, spaceAfter=14))

    # 1. Resumen Ejecutivo
    story.append(Paragraph("1. Resumen Ejecutivo y Objeto del Documento", h1_style))
    story.append(Paragraph(
        "Este documento establece la <b>estructura jurídica, tributaria y operativa</b> para el lanzamiento, comercialización y administración de la plataforma digital <b>Aval Motors CR</b> en el territorio costarricense.",
        body_style
    ))
    story.append(Paragraph("El objetivo central es garantizar que la plataforma opere bajo cuatro directrices inviolables:", body_style))
    story.append(Paragraph("• <b>Total legalidad y respaldo institucional:</b> Amparado por la Ley N° 7472 (Promoción de la Competencia y Defensa Efectiva del Consumidor / MEIC) y el Código de Comercio de Costa Rica.", bullet_style))
    story.append(Paragraph("• <b>Cero conflicto con la Junta de Protección Social (JPS):</b> Desmarque absoluto de la figura de lotería clandestina o juego de azar directo no regulado (Ley N° 7395).", bullet_style))
    story.append(Paragraph("• <b>Respaldo bancario y tributario formal:</b> Facturación electrónica formal (DGT - Ministerio de Hacienda), bancarización fluida (SINPE Móvil, adquirencia de tarjetas TiloPay / BAC) y liquidación de impuestos.", bullet_style))
    story.append(Paragraph("• <b>Claridad comercial absoluta:</b> Definición transparente del concepto de <i>'Token'</i> y del bien/servicio mercantil adquirido por el consumidor.", bullet_style))

    # 2. Diferenciación Jurídica
    story.append(Paragraph("2. Diferenciación Jurídica: Lotería Clandestina vs. Promoción Comercial", h1_style))
    story.append(Paragraph(
        "En Costa Rica, el monopolio de la JPS (Ley N° 7395) castiga la <i>'venta directa de apuestas o lotería clandestina'</i>. No obstante, las <b>promociones comerciales privadas y programas de lealtad de empresas mercantiles son 100% legales</b> bajo la Ley N° 7472.",
        body_style
    ))

    # Table Comparison
    table_data = [
        [
            Paragraph("<b>ACTIVIDAD ILEGAL / CLANDESTINA (JPS)</b>", ParagraphStyle('TH1', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white, alignment=TA_CENTER)),
            Paragraph("<b>MODELO LEGAL AVAL MOTORS CR (MEIC)</b>", ParagraphStyle('TH2', fontName='Helvetica-Bold', fontSize=9, textColor=colors.white, alignment=TA_CENTER))
        ],
        [
            Paragraph("• Venta directa de apuestas / números de azar.<br/>• No existe bien, producto ni factura comercial.<br/>• Actividad clandestina sin respaldo notarial.<br/>• El consumidor paga única y exclusivamente por apostar.", ParagraphStyle('TD1', fontName='Helvetica', fontSize=8.5, leading=12, textColor=colors.HexColor("#7f1d1d"))),
            Paragraph("• <b>Venta de producto/servicio digital legítimo.</b><br/>• <b>Factura Electrónica formal con IVA (DGT).</b><br/>• <b>Reglamento oficial protocolizado ante Notario.</b><br/>• <b>El Token de participación es un regalo de cortesía.</b>", ParagraphStyle('TD2', fontName='Helvetica', fontSize=8.5, leading=12, textColor=colors.HexColor("#064e3b")))
        ]
    ]
    t = Table(table_data, colWidths=[245, 255])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), colors.HexColor("#991b1b")),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor("#065f46")),
        ('BACKGROUND', (0, 1), (0, 1), colors.HexColor("#fef2f2")),
        ('BACKGROUND', (1, 1), (1, 1), colors.HexColor("#ecfdf5")),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('PADDING', (0, 0), (-1, -1), 8),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#cbd5e1")),
    ]))
    story.append(t)
    story.append(Spacer(1, 10))

    # 3. Qué es el Token
    story.append(Paragraph("3. ¿Qué es exactamente el 'Token' y qué adquiere el cliente?", h1_style))
    story.append(Paragraph("<b>A. Producto Comercial Adquirido por el Consumidor:</b>", h2_style))
    story.append(Paragraph(
        "El cliente realiza su pago comercial por la adquisición de una <b>Membresía Digital / Cuponera de Beneficios Aval Motors</b> emitida por Importadora Luxury Scents LTDA, la cual le otorga descuentos exclusivos en comercios automotrices aliados (autolavados, lubricentros, repuestos, accesorios) y catálogo de perfumería.",
        body_style
    ))
    story.append(Paragraph("<b>B. Naturaleza Jurídica del Token:</b>", h2_style))
    story.append(Paragraph("• <b>No se comercializa como un boleto de azar independiente:</b> Es un código numérico promocional de 5 cifras otorgado de <b>CORTESÍA</b> en agradecimiento por su compra comercial.", bullet_style))
    story.append(Paragraph("• <b>Sin valor nominal de reventa:</b> No constituye un título valor ni moneda de curso legal; es el comprobante digital de participación en la promoción de fidelización.", bullet_style))

    # 4. Respuestas Oficiales
    story.append(Paragraph("4. Respuestas Oficiales ante Consultas", h1_style))
    
    resp_cliente = [
        [Paragraph("<b>🗣️ Si te pregunta un CLIENTE ('¿Token de qué?'):</b>", ParagraphStyle('RQ1', fontName='Helvetica-Bold', fontSize=9, textColor=accent_gold))],
        [Paragraph("<i>\"El Token es tu código o boleto digital oficial de 5 dígitos registrado a tu nombre y cédula en la plataforma. Al comprar tu paquete de membresía o beneficios, recibes tus tokens de cortesía para participar por el premio mayor (vehículo, moto, casa, efectivo) y en los sorteos de todos los viernes.\"</i>", quote_style)]
    ]
    t_cliente = Table(resp_cliente, colWidths=[500])
    t_cliente.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#fffbeb")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#fde68a")),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_cliente)
    story.append(Spacer(1, 8))

    resp_legal = [
        [Paragraph("<b>⚖️ Si te pregunta un BANCO, NOTARIO, ABOGADO o TRIBUTACIÓN:</b>", ParagraphStyle('RQ2', fontName='Helvetica-Bold', fontSize=9, textColor=emerald_color))],
        [Paragraph("<i>\"El usuario adquiere un servicio/membresía comercial digital formal respaldado mediante Factura Electrónica con IVA ante el Ministerio de Hacienda. El Token es un identificador alfanumérico promocional gratuito entregado como incentivo de fidelización en una promoción comercial privada regulada por la Ley N° 7472 del MEIC y respaldada por reglamento notariado protocolizado.\"</i>", quote_style)]
    ]
    t_legal = Table(resp_legal, colWidths=[500])
    t_legal.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#f0fdf4")),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#bbf7d0")),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(t_legal)
    story.append(Spacer(1, 10))

    # 5. Los 4 Pilares de Blindaje
    story.append(Paragraph("5. Los 4 Pilares de Blindaje Operativo", h1_style))
    story.append(Paragraph("<b>Pilar 1: Protocolización Notarial del Reglamento de Promoción</b>", h2_style))
    story.append(Paragraph(
        "Un Notario Público costarricense protocoliza en su tomo matriz el <i>Reglamento Oficial de la Promoción Comercial</i>. Este reglamento define plazos, requisitos de mayoría de edad (18+), entrega del premio libre de gravámenes y procedimiento en caso de ausencia de reclamo. El reglamento permanece accesible al público en la ruta <code>/terminos</code> de la plataforma.",
        body_style
    ))

    story.append(Paragraph("<b>Pilar 2: Cláusula de Deslinde y Uso de Fe Pública Externa (JPS)</b>", h2_style))
    story.append(Paragraph(
        "La plataforma aclara de forma expresa que <b>no está asociada ni patrocinada por la Junta de Protección Social (JPS)</b>. Se utiliza la extracción pública y televisada de la Lotería Nacional exclusivamente como un <b>mecanismo neutral, externo e inalterable de fe pública</b> para garantizar absoluta transparencia y aleatoriedad.",
        body_style
    ))

    story.append(Paragraph("<b>Pilar 3: Régimen Tributario y Facturación Electrónica (DGT)</b>", h2_style))
    story.append(Paragraph(
        "Cada compra genera su respectiva Factura Electrónica ante la Dirección General de Tributación por el servicio comercial prestado. Se liquidan el Impuesto sobre el Valor Agregado (IVA 13%) y el Impuesto sobre la Renta correspondiente, blindando las cuentas bancarias de la sociedad mercantil.",
        body_style
    ))

    story.append(Paragraph("<b>Pilar 4: Acta Notarial de Entrega de Premios</b>", h2_style))
    story.append(Paragraph(
        "El día de la adjudicación de premios mayores (vehículos, motocicletas, dinero o casas), se formaliza mediante <b>Acta Notarial de Adjudicación y Entrega</b> suscrita por el Notario Público, la empresa organizadora y el beneficiario, formalizando la escritura de traspaso en el Registro Nacional de Costa Rica.",
        body_style
    ))

    # 6. Checklist
    story.append(Paragraph("6. Checklist de Implementación y Lanzamiento", h1_style))
    
    chk_data = [
        [Paragraph("<b>Componente</b>", ParagraphStyle('CKH', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
         Paragraph("<b>Responsable</b>", ParagraphStyle('CKH', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white)),
         Paragraph("<b>Estado en Plataforma</b>", ParagraphStyle('CKH', fontName='Helvetica-Bold', fontSize=8.5, textColor=colors.white))],
        [Paragraph("Términos y Condiciones Legales adaptados", body_style), Paragraph("Área Legal / Notario", body_style), Paragraph("✅ Integrado en /terminos", ParagraphStyle('V1', fontName='Helvetica-Bold', fontSize=8.5, textColor=emerald_color))],
        [Paragraph("Política de Privacidad de Datos (PRODHAB)", body_style), Paragraph("Área Legal", body_style), Paragraph("✅ Integrado en /privacidad", ParagraphStyle('V2', fontName='Helvetica-Bold', fontSize=8.5, textColor=emerald_color))],
        [Paragraph("Pasarelas Oficiales (SINPE, TiloPay, Tarjetas)", body_style), Paragraph("Área Técnica", body_style), Paragraph("✅ Operativo en /checkout", ParagraphStyle('V3', fontName='Helvetica-Bold', fontSize=8.5, textColor=emerald_color))],
        [Paragraph("Escrutinio Imparcial Dual (Lotería Nacional + Algoritmo)", body_style), Paragraph("Sistema / Notario", body_style), Paragraph("✅ Operativo en /admin", ParagraphStyle('V4', fontName='Helvetica-Bold', fontSize=8.5, textColor=emerald_color))],
        [Paragraph("Protocolización de Reglamento en Papel de Seguridad", body_style), Paragraph("Notario Público", body_style), Paragraph("⏳ Firma protocolar en tomo", ParagraphStyle('V5', fontName='Helvetica-Bold', fontSize=8.5, textColor=accent_gold))]
    ]
    t_chk = Table(chk_data, colWidths=[230, 130, 140])
    t_chk.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), dark_color),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (0, 2), (-1, 2), colors.white),
        ('BACKGROUND', (0, 3), (-1, 3), colors.HexColor("#f8fafc")),
        ('BACKGROUND', (0, 4), (-1, 4), colors.white),
        ('BACKGROUND', (0, 5), (-1, 5), colors.HexColor("#f8fafc")),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('PADDING', (0, 0), (-1, -1), 5),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor("#e2e8f0")),
    ]))
    story.append(t_chk)

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF generado exitosamente en: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
