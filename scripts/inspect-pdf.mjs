import { PDFDocument } from "pdf-lib"
import { readFileSync } from "fs"

const files = process.argv.slice(2)
for (const file of files) {
  const bytes = readFileSync(file)
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true })
  const pages = pdf.getPages()
  console.log(
    "\n===",
    file.split("/").pop(),
    "=== pages:",
    pages.length,
    "size:",
    Math.round(pages[0].getWidth()) + "x" + Math.round(pages[0].getHeight()),
  )
  const form = pdf.getForm()
  const fields = form.getFields()
  console.log("form fields:", fields.length)
  fields.forEach((f) => {
    let pos = ""
    try {
      const widgets = f.acroField.getWidgets()
      pos = widgets
        .map((w) => {
          const r = w.getRectangle()
          return `p?@(${Math.round(r.x)},${Math.round(r.y)} ${Math.round(r.width)}x${Math.round(r.height)})`
        })
        .join(" ")
    } catch {}
    console.log("  [" + f.constructor.name.replace("PDF", "").replace("Field", "") + "] " + f.getName() + "  " + pos)
  })
}
