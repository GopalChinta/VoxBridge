import os
import uuid
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from app.core.config import settings

# Attempt to register TrueType fonts if available
UNICODE_FONT = "Helvetica"
BOLD_FONT = "Helvetica-Bold"

try:
    segoe_path = "C:\\Windows\\Fonts\\segoeui.ttf"
    segoe_bold = "C:\\Windows\\Fonts\\segoeuib.ttf"
    if os.path.exists(segoe_path):
        pdfmetrics.registerFont(TTFont("SegoeUI", segoe_path))
        UNICODE_FONT = "SegoeUI"
    if os.path.exists(segoe_bold):
        pdfmetrics.registerFont(TTFont("SegoeUI-Bold", segoe_bold))
        BOLD_FONT = "SegoeUI-Bold"
except Exception as e:
    pass

class PDFService:
    """
    Service for generating high quality, beautifully styled PDF reports
    documenting speech transcription, language detection, and translation.
    """

    @staticmethod
    def generate_session_pdf(
        user_name: str,
        user_email: str,
        detected_language: str,
        transcription: str,
        source_language: str,
        target_language: str,
        translation: str,
        session_id: str = None
    ) -> tuple[str, str]:
        """
        Creates a PDF report and returns (absolute_path, filename).
        """
        if not session_id:
            session_id = uuid.uuid4().hex[:8].upper()

        filename = f"VoxBridge_Report_{session_id}.pdf"
        output_path = os.path.join(settings.GENERATED_DIR, filename)

        doc = SimpleDocTemplate(
            output_path,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=40
        )

        styles = getSampleStyleSheet()

        # Custom Brand Colors
        primary_color = colors.HexColor("#4F46E5")  # Indigo 600
        dark_bg = colors.HexColor("#0F172A")        # Slate 900
        accent_color = colors.HexColor("#06B6D4")   # Cyan 500
        text_dark = colors.HexColor("#1E293B")      # Slate 800
        light_gray = colors.HexColor("#F8FAFC")     # Slate 50
        border_color = colors.HexColor("#E2E8F0")   # Slate 200

        # Custom Typography Styles
        title_style = ParagraphStyle(
            "ReportTitle",
            parent=styles["Normal"],
            fontName=BOLD_FONT,
            fontSize=22,
            textColor=primary_color,
            spaceAfter=4
        )

        tagline_style = ParagraphStyle(
            "Tagline",
            parent=styles["Normal"],
            fontName=UNICODE_FONT,
            fontSize=10,
            textColor=colors.HexColor("#64748B"),
            spaceAfter=12
        )

        section_heading = ParagraphStyle(
            "SectionHeading",
            parent=styles["Normal"],
            fontName=BOLD_FONT,
            fontSize=12,
            textColor=primary_color,
            spaceAfter=6
        )

        content_style = ParagraphStyle(
            "ContentText",
            parent=styles["Normal"],
            fontName=UNICODE_FONT,
            fontSize=10.5,
            textColor=text_dark,
            leading=16
        )

        meta_label = ParagraphStyle(
            "MetaLabel",
            parent=styles["Normal"],
            fontName=BOLD_FONT,
            fontSize=9,
            textColor=colors.HexColor("#475569")
        )

        meta_val = ParagraphStyle(
            "MetaVal",
            parent=styles["Normal"],
            fontName=UNICODE_FONT,
            fontSize=9,
            textColor=text_dark
        )

        story = []

        # 1. Header with Branding
        story.append(Paragraph("VoxBridge", title_style))
        story.append(Paragraph("Speak. Translate. Connect. — AI Multilingual Platform", tagline_style))
        story.append(HRFlowable(width="100%", thickness=1.5, color=primary_color, spaceAfter=15))

        # 2. Metadata Information Table
        gen_time = datetime.now().strftime("%B %d, %Y - %I:%M %p")
        meta_data = [
            [Paragraph("Session Reference:", meta_label), Paragraph(f"VB-{session_id}", meta_val),
             Paragraph("Generated On:", meta_label), Paragraph(gen_time, meta_val)],
            [Paragraph("Account Holder:", meta_label), Paragraph(user_name or "VoxBridge User", meta_val),
             Paragraph("User Email:", meta_label), Paragraph(user_email or "N/A", meta_val)],
            [Paragraph("Detected Language:", meta_label), Paragraph(detected_language or "Auto-detected", meta_val),
             Paragraph("Processing Status:", meta_label), Paragraph("<font color='#16a34a'><b>Verified Complete</b></font>", meta_val)]
        ]

        meta_table = Table(meta_data, colWidths=[120, 140, 110, 160])
        meta_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), light_gray),
            ('BOX', (0, 0), (-1, -1), 1, border_color),
            ('INNERGRID', (0, 0), (-1, -1), 0.5, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ]))
        story.append(meta_table)
        story.append(Spacer(1, 15))

        # 3. Speech Transcription Card
        story.append(Paragraph(f"1. Speech-to-Text Transcription ({source_language or detected_language or 'Original'})", section_heading))
        clean_transcript = transcription or "No transcription recorded."
        transcript_cell = [[Paragraph(clean_transcript, content_style)]]
        transcript_table = Table(transcript_cell, colWidths=[530])
        transcript_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
            ('BOX', (0, 0), (-1, -1), 1, border_color),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ]))
        story.append(transcript_table)
        story.append(Spacer(1, 15))

        # 4. Neural Translation Card
        tgt = target_language or "Translation"
        story.append(Paragraph(f"2. Multilingual Translation ({tgt})", section_heading))
        clean_trans = translation or "No translation generated."
        trans_cell = [[Paragraph(clean_trans, content_style)]]
        trans_table = Table(trans_cell, colWidths=[530])
        trans_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor("#EEF2FF")),
            ('BOX', (0, 0), (-1, -1), 1, colors.HexColor("#C7D2FE")),
            ('TOPPADDING', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        ]))
        story.append(trans_table)
        story.append(Spacer(1, 20))

        # 5. Technology & Verification Footer
        footer_style = ParagraphStyle(
            "FooterNotice",
            parent=styles["Normal"],
            fontName=UNICODE_FONT,
            fontSize=8,
            textColor=colors.HexColor("#94A3B8"),
            alignment=1
        )
        story.append(HRFlowable(width="100%", thickness=0.5, color=border_color, spaceAfter=8))
        story.append(Paragraph(
            "Generated with VoxBridge • OpenAI Whisper STT • IndicTrans2 Multilingual Neural Core • Google Text-to-Speech",
            footer_style
        ))
        story.append(Paragraph(
            "Confidential & securely stored. For terms and privacy visit VoxBridge platform.",
            footer_style
        ))

        # Build Document
        doc.build(story)
        return output_path, filename

pdf_service = PDFService()
