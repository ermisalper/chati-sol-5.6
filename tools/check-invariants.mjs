#!/usr/bin/env node
/* =============================================================================
 * check-invariants.mjs — Qualitäts- & Sicherheits-Guard (läuft in CI)
 * -----------------------------------------------------------------------------
 * Bricht den Build, wenn jemand (Claude oder Codex) versehentlich:
 *  1. eine HTML-Seite ohne CSP-Meta anlegt
 *  2. Kundendaten wieder als Klartext persistiert (localStorage.setItem
 *     ausserhalb der erlaubten Fallback-Stellen)
 *  3. externe Skripte einbindet (CSP script-src 'self')
 *  4. target="_blank" ohne rel="noopener" setzt
 * Aufruf:  node tools/check-invariants.mjs
 * ========================================================================== */
import { readdirSync, readFileSync } from "node:fs";

const errors = [];
const htmlFiles = readdirSync(".").filter(f => f.endsWith(".html"));
const jsFiles = ["crm-session.js", "wealth-chart.js"].filter(f => {
  try { readFileSync(f); return true; } catch { return false; }
});

/* Erlaubte localStorage.setItem-Stellen: der gebündelte Fallback im
 * Store-Shim (Muster: set:function(k,v){try{localStorage.setItem(k,v)...) */
const FALLBACK_RE = /set\s*:\s*function\s*\(k,\s*v\)\s*\{\s*try\s*\{\s*localStorage\.setItem\(k,\s*v\)/g;

for (const f of htmlFiles) {
  const s = readFileSync(f, "utf-8");
  const isDraft = /-legacy\.html$|-modern\.html$/.test(f); // Entwürfe: nur CSP-Pflicht

  // 1. CSP
  if (!s.includes("Content-Security-Policy")) {
    errors.push(`${f}: CSP-Meta fehlt`);
  }

  // 2. Klartext-Persistenz (ausserhalb Fallback-Shim)
  if (!isDraft) {
    const raw = s.replace(FALLBACK_RE, "");
    const hits = [...raw.matchAll(/localStorage\.setItem\(/g)].length;
    const shims = [...s.matchAll(FALLBACK_RE)].length;
    const total = [...s.matchAll(/localStorage\.setItem\(/g)].length;
    if (total > shims) {
      errors.push(`${f}: ${total - shims}× localStorage.setItem ausserhalb des Store-Fallbacks — Combinvest.store verwenden (siehe CODEX-SETUP.md)`);
    }
  }

  // 3. Externe Skripte
  const ext = s.match(/<script[^>]+src=["']https?:\/\/[^"']+["']/g);
  if (ext) errors.push(`${f}: externes Skript verletzt CSP script-src 'self': ${ext[0].slice(0, 80)}`);

  // 4. _blank ohne noopener
  const blanks = s.match(/<a[^>]*target=["']_blank["'][^>]*>/g) || [];
  for (const a of blanks) {
    if (!/rel=["'][^"']*noopener/.test(a)) errors.push(`${f}: target="_blank" ohne rel="noopener"`);
  }
}

for (const f of jsFiles) {
  const s = readFileSync(f, "utf-8");
  const shims = [...s.matchAll(FALLBACK_RE)].length;
  const total = [...s.matchAll(/localStorage\.setItem\(/g)].length;
  if (total > shims) errors.push(`${f}: localStorage.setItem ausserhalb des Store-Fallbacks`);
}

if (errors.length) {
  console.error("❌ Invarianten verletzt:\n" + errors.map(e => "  - " + e).join("\n"));
  process.exit(1);
}
console.log(`✅ Invarianten ok (${htmlFiles.length} HTML-Seiten, ${jsFiles.length} JS-Module geprüft)`);
