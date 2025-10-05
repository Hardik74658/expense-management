from pypdf import PdfReader
path = r"c:\OdooHackathon\New folder\requirements.pdf"
text = "\n\n".join(page.extract_text() or "" for page in PdfReader(path).pages)
with open(r"c:\OdooHackathon\New folder\requirements.txt", "w", encoding="utf-8") as f:
    f.write(text)
