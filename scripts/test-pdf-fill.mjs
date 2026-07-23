import { PDFDocument, StandardFonts, rgb } from "pdf-lib"
import { readFileSync, writeFileSync, mkdirSync } from "fs"

mkdirSync("/tmp/pdf-out", { recursive: true })

const f = {
  salutation: "Herr",
  firstName: "Max",
  lastName: "Muster",
  birthdate: "1985-06-12",
  street: "Musterstrasse 5",
  zip: "8000",
  city: "Zürich",
  phone: "079 123 45 67",
  email: "max@example.ch",
  place: "Zürich",
  date: "2026-07-23",
  company: "Muster AG",
  advisorName: "Alper Ermis",
}

// --- Triveso Privat ---
{
  const bytes = readFileSync("public/documents/templates/maklermandat-triveso-privat.pdf")
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
  const safe = (n, v) => { try { pdf.getForm().getTextField(n).setText(v || "") } catch {} }
  const map = {
    "Text-A0_PYS-9-8": f.salutation, "Text-QNCXd6HnhQ": f.birthdate,
    "Text-0N-N1EAc1l": f.firstName, "Text-j18-8a9oz5": f.lastName,
    "Text-3VQSSwokG-": f.street, "Text-TfylkX6tRv": f.zip + " " + f.city,
    "Text-3SUUcZKDzd": f.phone, "Text-Qpw5oP2k-c": f.email,
    "Text-8tapIkXUNW": f.place + ", " + f.date, "Text-qQJbfRMLiG": f.place + ", " + f.date,
  }
  Object.entries(map).forEach(([k, v]) => safe(k, v))
  pdf.getForm().updateFieldAppearances()
  writeFileSync("/tmp/pdf-out/triveso-privat.pdf", await pdf.save())
  // read back
  const check = await PDFDocument.load(readFileSync("/tmp/pdf-out/triveso-privat.pdf"))
  const vals = check.getForm().getFields().map((x) => x.getName() + "=" + (x.getText?.() || ""))
  console.log("TRIVESO PRIVAT filled:", vals.filter((v) => v.split("=")[1]).length, "/ 10")
}

// --- Triveso Firma ---
{
  const bytes = readFileSync("public/documents/templates/maklermandat-triveso-firma.pdf")
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
  const safe = (n, v) => { try { pdf.getForm().getTextField(n).setText(v || "") } catch {} }
  const full = f.company + " / " + f.firstName + " " + f.lastName
  const map = {
    "Text-3uqA1Rn3Ye": f.company, "Text-yagTWQstLB": full,
    "Text-kL5RHfqaAT": f.zip + " " + f.city, "Text-IqxFz4tNkR": f.street,
    "Text-qqJkVb3-Pl": f.phone + "  " + f.email,
    "Text-ugfUrNU5WH": f.place + ", " + f.date, "Text-5Z-o08otbZ": f.place + ", " + f.date,
  }
  Object.entries(map).forEach(([k, v]) => safe(k, v))
  pdf.getForm().updateFieldAppearances()
  writeFileSync("/tmp/pdf-out/triveso-firma.pdf", await pdf.save())
  const check = await PDFDocument.load(readFileSync("/tmp/pdf-out/triveso-firma.pdf"))
  const vals = check.getForm().getFields().map((x) => x.getText?.() || "")
  console.log("TRIVESO FIRMA filled:", vals.filter(Boolean).length, "/ 7")
}

// --- Generated (Generalvollmacht) ---
{
  const pdf = await PDFDocument.create()
  const page = pdf.addPage([595, 842])
  const font = await pdf.embedFont(StandardFonts.Helvetica)
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
  page.drawText("combinvest", { x: 64, y: 780, size: 22, font: bold, color: rgb(0.11, 0.16, 0.52) })
  page.drawText("Generalvollmacht", { x: 64, y: 720, size: 18, font: bold, color: rgb(0.07, 0.12, 0.2) })
  page.drawText("Max Muster", { x: 64, y: 690, size: 10.5, font })
  const out = await pdf.save()
  writeFileSync("/tmp/pdf-out/generalvollmacht.pdf", out)
  console.log("GENERATED generalvollmacht bytes:", out.length, out.length > 500 ? "OK" : "FAIL")
}

console.log("\nAll PDFs written to /tmp/pdf-out/")
