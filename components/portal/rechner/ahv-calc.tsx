"use client"

import { useMemo, useState } from "react"
import { TrendingUp } from "lucide-react"
import { formatCHF } from "@/lib/format"
import { CalcActionBar, type CalcContext } from "@/components/portal/rechner/calc-action-bar"

const MIN_RENT = 1260
const MAX_RENT = 2520
const LOW = 15120
const HIGH = 90720

function fullRent(income: number) {
  if (income <= LOW) return MIN_RENT
  if (income >= HIGH) return MAX_RENT
  return MIN_RENT + (MAX_RENT - MIN_RENT) * ((income - LOW) / (HIGH - LOW))
}

export function AhvCalc({
  defaults,
  ctx,
}: {
  defaults?: { income?: number; years?: number; need?: number }
  ctx?: CalcContext
}) {
  const [income, setIncome] = useState(defaults?.income ?? 72000)
  const [years, setYears] = useState(defaults?.years ?? 44)
  const [need, setNeed] = useState(defaults?.need ?? 6000)

  const result = useMemo(() => {
    const rent = (fullRent(income) * years) / 44
    const gap = Math.max(0, need - rent)
    const cover = need > 0 ? Math.min(100, (rent / need) * 100) : 0
    return { rent, gap, cover, annual: rent * 12 }
  }, [income, years, need])

  return (
    <>
      <CalcActionBar
        ctx={ctx ?? {}}
        calcKey="ahv-rente"
        buildPayload={() => ({
          calculator: "ahv-rente",
          inputs: {
            jahreseinkommen: income,
            beitragsjahre: `${years}/44`,
            wunscheinkommen: need,
          },
          results: [
            `AHV-Rente ${formatCHF(result.rent)}/Monat`,
            `Deckung ${Math.round(result.cover)} %`,
            `Vorsorgelücke ${formatCHF(result.gap)}/Monat`,
          ],
        })}
        onReset={() => {
          setIncome(72000)
          setYears(44)
          setNeed(6000)
        }}
      />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
        {/* Inputs */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <Slider
            label="Durchschnittliches Jahreseinkommen"
            value={formatCHF(income)}
            min={LOW}
            max={120000}
            step={840}
            current={income}
            onChange={setIncome}
            hint="Massgebender Durchschnitt inkl. möglicher Erziehungs-/Betreuungsgutschriften."
          />
          <Slider
            label="Beitragsjahre / Rentenskala"
            value={`${years}/44`}
            min={1}
            max={44}
            step={1}
            current={years}
            onChange={setYears}
            hint="44 Jahre entsprechen einer Vollrente (Skala 44)."
          />
          <Slider
            label="Gewünschtes Einkommen im Ruhestand / Monat"
            value={formatCHF(need)}
            min={2000}
            max={12000}
            step={100}
            current={need}
            onChange={setNeed}
          />
        </div>

        {/* Results */}
        <section aria-live="polite" className="rounded-2xl border border-border bg-card p-6">
          <div className="rounded-2xl bg-primary p-6 text-primary-foreground">
            <div className="flex items-center gap-2 text-[13px] opacity-80">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Geschätzte AHV-Altersrente
            </div>
            <strong className="mt-1 block text-4xl font-black tabular-nums">
              {formatCHF(result.rent)} <span className="text-lg font-semibold opacity-80">/ Monat</span>
            </strong>
            <span className="mt-1 block text-sm opacity-80">
              Rentenskala {years} · {years === 44 ? "Vollrente" : "Teilrente"}
            </span>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Metric label="AHV pro Jahr" value={formatCHF(result.annual)} />
            <Metric label="Deckung Wunschbedarf" value={`${Math.round(result.cover)} %`} />
            <Metric
              label="Vorsorgelücke / Monat"
              value={formatCHF(result.gap)}
              tone={result.gap > 0 ? "crit" : "good"}
            />
          </div>

          <div className="mt-5">
            <div className="h-4 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-success transition-all"
                style={{ width: `${result.cover}%` }}
              />
            </div>
            <p className="mt-2 text-[12.5px] text-muted-foreground">
              Die AHV deckt den dargestellten Anteil Ihres gewünschten Monatseinkommens. Säule 2 und 3a kommen
              zusätzlich hinzu.
            </p>
          </div>

          <div className="mt-5 rounded-xl border border-border bg-secondary/40 p-4 text-[12.5px] text-muted-foreground">
            <b className="text-foreground">Wichtig:</b> Planungsschätzung auf Basis Skala 44. Verbindlich sind
            IK-Auszug und Rentenvorausberechnung Ihrer Ausgleichskasse. Ehepaarplafonierung, Splitting,
            Gutschriften, Vorbezug und Aufschub sind hier nicht abschliessend berücksichtigt.
          </div>
        </section>
      </div>
    </>
  )
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  current,
  onChange,
  hint,
}: {
  label: string
  value: string
  min: number
  max: number
  step: number
  current: number
  onChange: (v: number) => void
  hint?: string
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between">
        <label className="text-[13px] font-semibold text-foreground">{label}</label>
        <span className="text-sm font-bold text-primary tabular-nums">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--primary)]"
      />
      {hint ? <p className="mt-1.5 text-[11.5px] text-muted-foreground">{hint}</p> : null}
    </div>
  )
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "good" | "crit" }) {
  const color = tone === "crit" ? "text-destructive" : tone === "good" ? "text-success" : "text-foreground"
  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`mt-1 text-xl font-bold tabular-nums ${color}`}>{value}</p>
    </div>
  )
}
