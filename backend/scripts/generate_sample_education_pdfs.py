from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "output" / "pdf"
FONT_PATH = Path("C:/Windows/Fonts/arial.ttf")
FONT_BOLD_PATH = Path("C:/Windows/Fonts/arialbd.ttf")


def register_fonts():
    pdfmetrics.registerFont(TTFont("FishEdu", str(FONT_PATH)))
    pdfmetrics.registerFont(TTFont("FishEduBold", str(FONT_BOLD_PATH)))


def build_pdf(filename: str, title: str, subtitle: str):
    document = SimpleDocTemplate(
        str(OUTPUT / filename),
        pagesize=A4,
        leftMargin=22 * mm,
        rightMargin=22 * mm,
        topMargin=20 * mm,
        bottomMargin=20 * mm,
        title=title,
        author="FishEdu",
    )
    styles = getSampleStyleSheet()
    label = ParagraphStyle(
        "Label",
        fontName="FishEduBold",
        fontSize=10,
        leading=12,
        textColor=colors.HexColor("#4267D5"),
        spaceAfter=8,
    )
    heading = ParagraphStyle(
        "Heading",
        fontName="FishEduBold",
        fontSize=26,
        leading=31,
        textColor=colors.HexColor("#1D2530"),
        spaceAfter=10,
    )
    lead = ParagraphStyle(
        "Lead",
        fontName="FishEdu",
        fontSize=12,
        leading=18,
        textColor=colors.HexColor("#4A5565"),
        spaceAfter=20,
    )
    body = ParagraphStyle(
        "Body",
        fontName="FishEdu",
        fontSize=11,
        leading=17,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#27313D"),
        spaceAfter=12,
    )
    section = ParagraphStyle(
        "Section",
        fontName="FishEduBold",
        fontSize=15,
        leading=20,
        textColor=colors.HexColor("#1D2530"),
        spaceBefore=8,
        spaceAfter=8,
    )

    story = [
        Paragraph("FISH EDU / PRZYKŁADOWY MATERIAŁ", label),
        Paragraph(title, heading),
        Paragraph(subtitle, lead),
        Table(
            [["Poziom", "Początkujący"], ["Format", "PDF"], ["Czas czytania", "8 min"]],
            colWidths=[46 * mm, 92 * mm],
            style=TableStyle([
                ("FONTNAME", (0, 0), (-1, -1), "FishEdu"),
                ("FONTNAME", (0, 0), (0, -1), "FishEduBold"),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#27313D")),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F3F6FC")),
                ("LINEBELOW", (0, 0), (-1, -2), 0.5, colors.HexColor("#DCE3EF")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#DCE3EF")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]),
        ),
        Spacer(1, 18),
        Paragraph("Wprowadzenie", section),
        Paragraph(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non dui id augue "
            "ultricies ullamcorper. Curabitur volutpat, nunc at ultrices semper, libero erat "
            "rhoncus nunc, vitae tempor justo felis a erat.",
            body,
        ),
        Paragraph("Najważniejsze informacje", section),
        Paragraph(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer finibus augue "
            "non purus vulputate, sed tincidunt massa tristique. Vestibulum ante ipsum primis "
            "in faucibus orci luctus et ultrices posuere cubilia curae.",
            body,
        ),
        Paragraph("Podsumowanie", section),
        Paragraph(
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sed placerat "
            "massa. Nulla facilisi. Ten przykładowy materiał zostanie później zastąpiony "
            "pełną treścią edukacyjną FishEdu.",
            body,
        ),
    ]
    document.build(story)


if __name__ == "__main__":
    OUTPUT.mkdir(parents=True, exist_ok=True)
    register_fonts()
    build_pdf(
        "dobor-sprzetu-wedkarskiego.pdf",
        "Dobór sprzętu wędkarskiego",
        "Przykładowy materiał PDF do testowania aplikacji FishEdu.",
    )
    build_pdf(
        "przepisy-na-zanety-i-przynety.pdf",
        "Przepisy na zanęty i przynęty",
        "Przykładowy materiał PDF do testowania aplikacji FishEdu.",
    )
