# Combinvest — Klon-Blueprint (abgeleitet aus der Riskine-Referenzseite)

> Eigene Analyse als Bauanleitung. Wir bauen das **Verhalten & Design** in unserem
> eigenen Stack (HTML/Tailwind/Chart.js) nach — kein 1:1-Kopieren des geschützten
> Riskine-Frontends (`advisory-components`).

## Rahmen

- **Locale:** `de-CH`, Währung **CHF**, Tausendertrennung `'` (z. B. `1'250.00 CHF`).
- **Theme:** `combinvest-ch` (Logo lang + kompakt, Blau-Töne, viel Weißraum).
- **Notizen-Panel:** seitlich ein-/ausklappbar, pro Thema ein eigenes Notizfeld
  (Allgemein, Gesundheit, Pension, Vermögen, Immobilien, Versicherungen, Kinder,
  Lebensstandard, Steuervorteile).

## Beratungs-Flow (3 Schritte)

1. **Risikoanalyse** — Fragebogen (Standard/Formular), Live-Berechnung der 8
   Lebensbereiche als Tacho-Kacheln (sehr gering → sehr hoch).
2. **Vertragscheck** — bestehende Versicherungs-/Bankprodukte erfassen
   (Pol-Nr., Ablauf, Prämie, Gesellschaft).
3. **Empfehlungsseite** — 8 Themen-Kacheln mit Prioritäts-Kreisen, je „Beratung
   starten" → Themenseite. Abschluss: „Profiling abschliessen" + „Beratungs-
   protokoll erstellen" (PDF).

## Die 8 Themen (Empfehlungsseite)

| Thema | Slug | Prio-Kreis im Original |
|---|---|---|
| Pension vorsorgen | `pensiongap` | 5 |
| Vermögen aufbauen | `investment` | 5 |
| Lebensstandard beibehalten | `property-creation` | 4 |
| Gesundheit | `health` | 4 |
| Immobilien | `real-estate` | 3 |
| Kinder absichern | `children` | 2 |
| Steuervorteile nutzen | `tax-advantage` | – |
| Versicherungen | `values-protection` | – |

## Rechner-Inventar (Schweizer Ausprägung)

Vermögen & Sparen
- Sparrechner / Zielrechner (Zinseszins, 3 Szenarien)
- ETF-Sparplan-Strategie, Cost-Average-Effekt
- Inflationsrechner (BFS-Daten)
- Portfolio-Planner, Anlegerprofil (Risikoklasse 1–7, Angemessenheits-/Eignungstest)

Vorsorge & Rente
- Pensionsrechner: Säule 1 (AHV), Säule 2 (BVG), Säule 3 (3a/privat)
- Rentenlücke, Pflege-Lücke, Witwen-/Waisen-Absicherung, Invaliditäts-Lücke
- Wunschrente, Pensionsdauer (Lebenserwartung)
- **Vorsorgerechner / Entnahmeplan** (Withdrawal — Kapital reicht bis Jahr X) ← Lücke im aktuellen Build

Steuern
- Steuerrechner (Brutto-Netto)
- Steuereffekte Einzahlung 3a
- Franchise-Vergleich (Krankenkasse), Priminfo (BAG-Prämienrechner)

Immobilien
- Wohnrechner-Tragbarkeit / Immobilienkauf-Varianten
- Mieten vs. Kaufen, Hypotheken-/Immobilienkreditrechner, Eigenkapital-Sparplan

Absicherung
- Budget-/Haushaltsrechner, Kreditrechner

## UI-Muster (durchgängig)

- **Live-Berechnung:** Regler links, Echtzeit-Chart rechts (Chart.js), eine große
  animierte Fokus-Zahl.
- **Tacho-/Prioritätskreise** (SVG) für Relevanz je Bereich.
- **PDF-Ausgabe** als Beratungsprotokoll am Ende jedes Pfads.
