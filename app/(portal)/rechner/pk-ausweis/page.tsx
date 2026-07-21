import type { Metadata } from "next"
import { CalcShell } from "@/components/portal/rechner/calc-shell"
import { PkAusweisCalc } from "@/components/portal/rechner/pk-ausweis-calc"

export const metadata: Metadata = {
  title: "PK-Ausweis erfassen · Combinvest",
  description: "Erfassen Sie die wichtigsten Werte aus dem Vorsorgeausweis der Pensionskasse als Grundlage für die Vorsorgeanalyse.",
}

export default async function PkAusweisPage() {
  return (
    <CalcShell
      eyebrow="2. Säule · Datenerfassung"
      title="Vorsorgeausweis erfassen"
      lead="Übertragen Sie die zentralen Kennzahlen aus dem PK-Ausweis. Sie bilden die Grundlage für die Vorsorgelücken-Analyse und die Beratung."
      backHref="/rechner"
      backLabel="Rechner"
      chip="PK-Ausweis"
      explain="Die erfassten Leistungen werden in der Zusammenfassung übersichtlich dargestellt."
      source="Angaben stammen aus dem persönlichen Vorsorgeausweis Ihrer Pensionskasse."
    >
      <PkAusweisCalc />
    </CalcShell>
  )
}
