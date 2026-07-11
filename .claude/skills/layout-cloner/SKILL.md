---
name: layout-cloner
description: Navigiert mittels Web-Tools autonom zu einer Ziel-URL, extrahiert die visuelle Struktur, lädt Assets herunter und rekonstruiert das Layout 1:1 als regelkonformes Generative-UI-Widget. Nutze diesen Skill, wenn der Benutzer verlangt, das Design einer Webseite exakt zu klonen, ein CSS-Profil einer Domain zu analysieren oder interaktive UI-Komponenten basierend auf realen Webseiten zu erstellen.
allowed-tools:
  - Bash
  - WebSearch
  - WebFetch
  - Read
  - Write
  - Edit
  - Glob
  - Grep
disable-model-invocation: false
---

# Arbeitsanweisung für den Layout-Cloner

Du bist als autonomer Frontend-Spezialist autorisiert, Webseiten-Strukturen zu
analysieren und als saubere Next.js/Tailwind-CSS-Komponenten neu aufzubauen.

## Argumente

- `url` — Die vollständige Quell-URL der Ziel-Webseite.
- `target_path` — Der Pfad im Workspace, in dem das rekonstruierte UI-Projekt
  abgelegt werden soll.

## Ablauf der Rekonstruktion

1. **Struktur- und CSS-Analyse**
   - Rufe die Ziel-URL `$url` auf und erstelle ein logisches Layout-Modell.
   - Extrahiere alle CSS-Farbvariablen, Abstände und typografischen Kennwerte.
   - Sichere diese Daten in einer temporären JSON-Datei unter
     `$target_path/temp_layout.json`.

2. **Asset-Akquise**
   - Führe das Hilfsskript aus, um SVG-Vektordateien und optimierte visuelle
     Assets zu sichern:

     ```bash
     python3 .claude/skills/layout-cloner/scripts/download_assets.py \
       --url "$url" --output "$target_path/public"
     ```

3. **Inkrementelle Code-Synthese**
   - Generiere die Layout-Komponenten Schritt für Schritt unter Einhaltung des
     Generative-UI-Regelwerks.
   - Implementiere eine strikte Trennung von Design und Interaktion:
     Stylesheets an den Anfang, DOM-Struktur in die Mitte, JS-Ablaufsteuerung an
     das Ende.

4. **Automatisiertes Testing**
   - Baue die Komponenten in eine Next.js-Testseite ein und führe Typprüfung
     sowie Linter aus:

     ```bash
     npm run tsc --noEmit && npm run lint
     ```

   - Vergleiche das Ergebnis visuell und korrigiere Abweichungen mittels
     präziser Search/Replace-Blöcke.
