import Link from "next/link"
import { ArrowRight, ShieldCheck } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-card to-accent">
      <div className="mx-auto w-full max-w-6xl px-6 pb-16 pt-20 md:pb-24 md:pt-28">
        <div className="flex items-center justify-between gap-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span>Combinvest Advisory Engine</span>
          <span className="hidden sm:inline">Schweizer Standard · revDSG</span>
        </div>

        <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-2xl">
            <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Die ganze Finanzwelt Ihrer Kunden.{" "}
              <span className="text-primary">In einer Analyse.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Combinvest führt Berater und Kunden strukturiert durch Vorsorge, Vermögen und
              Versicherung – mit deterministischen Schweizer Rechnern und priorisierten
              Empfehlungen für acht Lebensbereiche.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-7 text-[15px] font-semibold uppercase tracking-wide text-primary-foreground shadow-[0_10px_24px_rgba(57,120,246,0.22)] transition-transform hover:-translate-y-0.5"
              >
                Berater-Portal öffnen
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#prozess"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-transparent px-7 text-[15px] font-semibold uppercase tracking-wide text-primary transition-colors hover:bg-accent"
              >
                So funktioniert es
              </a>
            </div>

            <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success" />
              Daten verschlüsselt in der Schweizer Cloud · DSG-konform
            </div>
          </div>

          <div className="relative">
            <div
              aria-hidden="true"
              className="select-none text-right font-bold leading-none tracking-tighter text-primary/10"
              style={{ fontSize: "clamp(7rem, 16vw, 13rem)" }}
            >
              8
            </div>
            <dl className="mt-2 grid grid-cols-3 gap-4 border-t border-border pt-6">
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Lebensbereiche
                </dt>
                <dd className="mt-1 text-2xl font-bold text-foreground">8</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Fragen
                </dt>
                <dd className="mt-1 text-2xl font-bold text-foreground">19</dd>
              </div>
              <div>
                <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Rechner
                </dt>
                <dd className="mt-1 text-2xl font-bold text-foreground">3+</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
