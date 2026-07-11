# Combinvest — Shared Workspace (Claude + Codex)

## 🎯 Projekt
**Combinvest Advisory Engine** — Schweizer Finanzberatungs-Plattform als HTML/CSS/JS mit deterministischen Engines.

## 📂 Struktur

```
/
├── index.html              # Startseite/Landing Page
├── analyse.html            # 19-Frage Wizard + Vertragscheck + Risikoanalyse
├── vorsorgerechner.html    # Zwei-Phasen Vorsorgerechner
├── immobilienrechner.html  # Immobilien-Tragbarkeit (Schweizer Standard)
├── franchise.html          # Franchise-Vergleich Krankenkasse
├── thema.html              # Theme-Seiten (8 Lebensbereiche)
├── engine/                 # Deterministische Engines (JS/Node)
│   ├── pension-engine.mjs
│   ├── affordability-engine.mjs
│   └── *.test.mjs
├── types/                  # TypeScript Typ-Definitionen
│   └── combinvest.ts
└── docs/                   # Spezifikationen & Blueprints
    └── riskine-combinvest-blueprint.md
```

## 👥 Aufgabenverteilung

### Claude (Haiku)
- ✅ HTML-Struktur & CSS-Design
- ✅ Deterministische Engines (Pension, Affordability)
- ✅ Tests & Engine-Validierung
- ✅ Responsive Layout & Animations

### Codex (ChatGPT)
- 🔄 JavaScript-Logik & Interaktionen
- 🔄 State Management (Wizard-Flow)
- 🔄 API-Integration & PDF-Export
- 🔄 Fehlerbehandlung & Edge-Cases

## 🔧 Wichtige Engines

### Pension-Engine (`engine/pension-engine.mjs`)
- **Input:** Sparphase (Start-Kapital, monatliche Rate, Dynamik), Entnahmephase (gewünschte Rente, Jahre)
- **Output:** Benötigte Sparrate, Kurve (Kapital/Jahr)
- **Algorithmus:** Binary Search für Solver
- **Tests:** 9/9 bestanden

### Affordability-Engine (`engine/affordability-engine.mjs`)
- **Input:** Liegenschaftswert, Eigenkapital, Bruttoeinkommen
- **Output:** Tragbar (true/false), Quote %, Max-Kaufpreis
- **Rules:** 5% Kalkzins, 1% Nebenkosten, 33.33% Einkommenslimit, 80% Max-Belehnung
- **Tests:** 13/13 bestanden

## 📋 Typ-Modell (`types/combinvest.ts`)
- **Basisdaten:** Persönliche Infos (Name, DOB, PLZ, Kanton, Einkommen)
- **8 Module:** PensionGap, Investment, PropertyCreation, Health, RealEstate, Children, TaxAdvantage, ValuesProtection
- **CustomerProfile:** Zentrale Struktur mit Notizen & Modules

## 🎨 Design-System
- **Branding:** Combinvest (Royal-Blau #3A57F5)
- **Theme:** Light-only, Pill-Navigation, Uppercase Titles, Weißraum
- **Components:** Hero-Cards, Tacho-Ringe (CSS @property), Meter, Charts

## 🧪 Workflow
1. **Claude:** Code-Struktur + Engines → pushen
2. **Codex:** Logik & Interaktionen → pushen
3. **Sync:** Git pull/push gegenseitig
4. **Test:** Browser-Verifikation vor merge

## 📝 Wichtige Links
- Blueprint: `docs/riskine-combinvest-blueprint.md`
- Types: `types/combinvest.ts`
- Main Branch: `main` (Production)
- Feature Branch: `feature/codex-*` (für Codex)

---

**Live:** Alle Pages sind funktionsfähig und getestet. Ready für gemeinsame Entwicklung! 🚀
