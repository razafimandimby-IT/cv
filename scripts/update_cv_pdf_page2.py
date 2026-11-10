from io import BytesIO
from pathlib import Path

from pypdf import PdfReader, PdfWriter
from reportlab.lib.colors import HexColor, white
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
PDF_PATH = ROOT / "output" / "pdf" / "Denis-Razafimandimby-CV.pdf"
TMP_DIR = ROOT / "tmp" / "pdfs"
TMP_PATH = TMP_DIR / "Denis-Razafimandimby-CV.updated.pdf"

GREEN = HexColor("#19763A")
TEXT = HexColor("#20252B")
MUTED = HexColor("#5F6B7A")
BORDER = HexColor("#D0DDD3")
SOFT = HexColor("#EFF5F1")


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("CV-Regular", r"C:\Windows\Fonts\arial.ttf"))
    pdfmetrics.registerFont(TTFont("CV-Bold", r"C:\Windows\Fonts\arialbd.ttf"))


def section_title(c: canvas.Canvas, page_width: float, title: str, y: float) -> None:
    c.setFont("CV-Bold", 11.5)
    c.setFillColor(GREEN)
    c.drawCentredString(page_width / 2, y, title)
    title_width = pdfmetrics.stringWidth(title, "CV-Bold", 11.5)
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.55)
    c.line(page_width / 2 - title_width / 2 - 105, y - 3, page_width / 2 - title_width / 2 - 10, y - 3)
    c.line(page_width / 2 + title_width / 2 + 10, y - 3, page_width / 2 + title_width / 2 + 105, y - 3)


def chip(c: canvas.Canvas, x: float, y: float, width: float, label: str) -> None:
    c.setFillColor(SOFT)
    c.setStrokeColor(BORDER)
    c.roundRect(x, y, width, 19, 5, fill=1, stroke=1)
    c.setFillColor(TEXT)
    c.setFont("CV-Regular", 8.2)
    c.drawCentredString(x + width / 2, y + 6.1, label)


def link_cell(
    c: canvas.Canvas,
    x: float,
    y: float,
    width: float,
    label: str,
    value: str,
    url: str,
    value_size: float = 8.1,
) -> None:
    c.setFillColor(MUTED)
    c.setFont("CV-Bold", 7.1)
    c.drawString(x, y + 10, label.upper())
    c.setFillColor(GREEN)
    c.setFont("CV-Regular", value_size)
    c.drawString(x, y - 1, value)
    c.linkURL(url, (x, y - 4, x + width, y + 19), relative=0)


def wrapped_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    lines: list[str] = []
    current = ""
    for word in text.split():
        candidate = f"{current} {word}".strip()
        if current and pdfmetrics.stringWidth(candidate, font, size) > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def draw_wrapped(
    c: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font: str = "CV-Regular",
    size: float = 8.4,
    leading: float = 11,
    color=TEXT,
) -> float:
    c.setFont(font, size)
    c.setFillColor(color)
    for line in wrapped_lines(text, font, size, max_width):
        c.drawString(x, y, line)
        y -= leading
    return y


def role_block(
    c: canvas.Canvas,
    title: str,
    dates: str,
    description: str,
    x: float,
    y: float,
    width: float,
) -> float:
    c.setFont("CV-Bold", 10.5)
    c.setFillColor(TEXT)
    c.drawString(x, y, title)
    c.setFont("CV-Regular", 8.2)
    c.setFillColor(MUTED)
    c.drawString(x, y - 14, dates)
    return draw_wrapped(c, f"- {description}", x + 2, y - 30, width - 2, size=8.25, leading=10.5) - 6


def project_cell(
    c: canvas.Canvas,
    x: float,
    y: float,
    width: float,
    title: str,
    description: str,
) -> None:
    c.setFont("CV-Regular", 8.6)
    c.setFillColor(TEXT)
    c.drawString(x, y, title)
    draw_wrapped(c, description, x, y - 13, width, size=8.05, leading=10.2, color=MUTED)


def make_page_two(width: float, height: float) -> BytesIO:
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=(width, height))

    c.setFillColor(white)
    c.rect(0, 0, width, height, fill=1, stroke=0)

    section_title(c, width, "PARCOURS COMPLÉMENTAIRE", 806)
    y = role_block(
        c,
        "Datajet - Team Lead Support Technique",
        "Juillet 2022 - janvier 2023",
        "Gestion du cycle de vie des équipements, environnement Exchange, sauvegarde hybride et migration SpiceWorks vers GLPI.",
        58,
        778,
        width - 116,
    )
    y = role_block(
        c,
        "Datajet - Technicien Support & Maintenance",
        "Juin 2018 - juillet 2022",
        "Support N1/N2, maintenance d'un parc de plus de 300 postes, administration Linux, Nagios et OCS Inventory.",
        58,
        y,
        width - 116,
    )
    draw_wrapped(
        c,
        "Expériences complémentaires : application PHP de traçabilité logistique pour DHL, gestion d'un cybercafé de plus de 50 utilisateurs, maintenance de parc au Ministère des Finances et assistance IT bénévole.",
        58,
        y - 1,
        width - 116,
        size=8.2,
        leading=10.4,
    )

    section_title(c, width, "AUTRES RÉALISATIONS", 624)
    grid_x, grid_y, grid_w, grid_h = 51, 522, width - 102, 84
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.55)
    c.rect(grid_x, grid_y, grid_w, grid_h, fill=0, stroke=1)
    c.line(grid_x + grid_w / 2, grid_y, grid_x + grid_w / 2, grid_y + grid_h)
    c.line(grid_x, grid_y + grid_h / 2, grid_x + grid_w, grid_y + grid_h / 2)
    cell_w = grid_w / 2
    project_cell(c, grid_x + 8, grid_y + 66, cell_w - 16, "Parcelle Scope", "Pré-analyse territoriale sourcée, traçabilité documentaire et validation professionnelle.")
    project_cell(c, grid_x + cell_w + 8, grid_y + 66, cell_w - 16, "Studio de qualification de prospects", "Import, dédoublonnage, enrichissement traçable et revue humaine.")
    project_cell(c, grid_x + 8, grid_y + 24, cell_w - 16, "ZK Attendance Bridge", "Agent Python et addon Odoo pour intégrer les pointages et gérer le mode hors ligne.")
    project_cell(c, grid_x + cell_w + 8, grid_y + 24, cell_w - 16, "Outillage infrastructure", "Hardening CIS, Ansible, supervision et scripts d'administration PowerShell.")

    section_title(c, width, "FORMATION & CERTIFICATIONS", 500)
    box_x, box_y, box_w, box_h = 51, 405, width - 102, 78
    c.setStrokeColor(BORDER)
    c.rect(box_x, box_y, box_w, box_h, fill=0, stroke=1)
    row_h = box_h / 3
    c.line(box_x, box_y + row_h, box_x + box_w, box_y + row_h)
    c.line(box_x, box_y + 2 * row_h, box_x + box_w, box_y + 2 * row_h)
    project_cell(c, box_x + 8, box_y + 68, box_w - 16, "Informatique de Gestion - Génie Logiciel et Intelligence Artificielle", "Institut Supérieur Polytechnique de Madagascar (ISPM), Antananarivo.")
    project_cell(c, box_x + 8, box_y + 42, box_w - 16, "ServiceNow ITSM & Flow Designer - en cours", "Préparation : ITIL 4 Foundation, Azure Fundamentals AZ-900 et VMware VCP-DCV.")
    project_cell(c, box_x + 8, box_y + 16, box_w - 16, "Formation continue", "Docker et conteneurisation, Python et cybersécurité Open Source.")
    c.setFillColor(TEXT)
    c.setFont("CV-Regular", 8.3)
    c.drawString(box_x + 8, 391, "Langues : français courant - anglais professionnel - malgache langue maternelle.")

    section_title(c, width, "SAVOIR-ÊTRE", 366)
    chip_specs = [
        ("Leadership de proximité", 112),
        ("Sens du service", 92),
        ("Rigueur", 62),
        ("Autonomie", 70),
        ("Pédagogie", 72),
        ("Esprit d'analyse", 94),
        ("Collaboration", 82),
    ]
    x = 58
    y = 335
    for label, chip_width in chip_specs:
        if x + chip_width > width - 58:
            x = 58
            y -= 27
        chip(c, x, y, chip_width, label)
        x += chip_width + 7

    section_title(c, width, "CENTRES D'INTÉRÊT", 284)
    interests = [
        ("Veille technologique", 112),
        ("Automatisation", 88),
        ("Logiciels libres", 88),
        ("IA appliquée", 75),
        ("Partage de connaissances", 135),
        ("Football", 60),
        ("Basketball", 70),
        ("Handball", 65),
        ("Volley", 55),
        ("Natation", 62),
    ]
    x = 58
    y = 253
    for label, chip_width in interests:
        if x + chip_width > width - 58:
            x = 58
            y -= 27
        chip(c, x, y, chip_width, label)
        x += chip_width + 7

    section_title(c, width, "CONTACT & LIENS", 181)
    panel_x, panel_y, panel_w, panel_h = 51, 55, width - 102, 108
    c.setFillColor(SOFT)
    c.setStrokeColor(BORDER)
    c.roundRect(panel_x, panel_y, panel_w, panel_h, 7, fill=1, stroke=1)
    c.line(panel_x + panel_w / 2, panel_y + 81, panel_x + panel_w / 2, panel_y + panel_h)
    c.line(panel_x, panel_y + 27, panel_x + panel_w, panel_y + 27)
    c.line(panel_x, panel_y + 54, panel_x + panel_w, panel_y + 54)
    c.line(panel_x, panel_y + 81, panel_x + panel_w, panel_y + 81)

    col_w = panel_w / 2
    link_cell(
        c,
        panel_x + 12,
        panel_y + 87,
        col_w - 24,
        "Email",
        "l.denis.razafimandimby@gmail.com",
        "mailto:l.denis.razafimandimby@gmail.com",
    )
    link_cell(
        c,
        panel_x + col_w + 12,
        panel_y + 87,
        col_w - 24,
        "GitHub",
        "https://github.com/razafimandimby-IT",
        "https://github.com/razafimandimby-IT",
        6.7,
    )
    link_cell(
        c,
        panel_x + 12,
        panel_y + 60,
        panel_w - 24,
        "Vercel",
        "https://razafimandimby-cv.vercel.app/",
        "https://razafimandimby-cv.vercel.app/",
        7.2,
    )
    link_cell(
        c,
        panel_x + 12,
        panel_y + 33,
        panel_w - 24,
        "Cloudflare",
        "https://razafimandimby-cv.l-denis-razafimandimby.workers.dev/",
        "https://razafimandimby-cv.l-denis-razafimandimby.workers.dev/",
        6.4,
    )
    link_cell(
        c,
        panel_x + 12,
        panel_y + 6,
        panel_w - 24,
        "Portfolio principal",
        "https://razafimandimby-it.github.io/cv/",
        "https://razafimandimby-it.github.io/cv/",
        7.2,
    )

    c.setStrokeColor(BORDER)
    c.line(51, 48, width - 51, 48)
    c.setFont("CV-Regular", 7.2)
    c.setFillColor(MUTED)
    c.drawString(51, 32, "Denis Razafimandimby - Responsable Informatique")
    c.drawRightString(width - 51, 32, "Page 2")

    c.save()
    buffer.seek(0)
    return buffer


def update_pdf() -> None:
    register_fonts()
    TMP_DIR.mkdir(parents=True, exist_ok=True)

    reader = PdfReader(str(PDF_PATH))
    if len(reader.pages) != 2:
        raise ValueError(f"Expected a two-page CV, got {len(reader.pages)} pages")

    source_page_two = reader.pages[1]
    width = float(source_page_two.mediabox.width)
    height = float(source_page_two.mediabox.height)
    page_two = PdfReader(make_page_two(width, height)).pages[0]

    writer = PdfWriter()
    writer.add_page(reader.pages[0])
    writer.add_page(page_two)
    writer.add_metadata(
        {
            "/Title": "Denis Razafimandimby - Responsable Informatique",
            "/Author": "Denis Razafimandimby",
            "/Subject": "CV - Pilotage SI, infrastructure et automatisation",
        }
    )
    with TMP_PATH.open("wb") as stream:
        writer.write(stream)

    # Reopen before replacing the deliverable to catch malformed output.
    validated = PdfReader(str(TMP_PATH))
    if len(validated.pages) != 2:
        raise ValueError("The updated CV is not a valid two-page PDF")
    TMP_PATH.replace(PDF_PATH)


if __name__ == "__main__":
    update_pdf()
