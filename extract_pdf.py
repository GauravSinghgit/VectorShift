import sys
from pathlib import Path
from PyPDF2 import PdfReader

pdf_path = Path(r"c:/Users/gaura/OneDrive/Desktop/VetorShift/VectorShift - Frontend Technical Assessment Instructions.pdf")
if not pdf_path.is_file():
    print('PDF file not found', file=sys.stderr)
    sys.exit(1)

reader = PdfReader(str(pdf_path))
text = []
for page in reader.pages:
    text.append(page.extract_text())
print('\n'.join(text))
