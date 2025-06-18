from fpdf import FPDF

def generate_certificate(user_name):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=24)
    pdf.cell(200, 100, tst=f"{user_name}さん　スタンプラリー完走！", ln=True, align='C')
    path = f"certificates/{user_name}_certificate.pdf"
    pdf.output(path)
    return path