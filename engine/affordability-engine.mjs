// Immobilien-Tragbarkeits-Engine (Schweizer Standard, deterministisch)
export const RULES = { kalkZins: 5.0, nebenkostenSatz: 1.0, amortJahre: 15, maxBelehnung: 80, ersteHypGrenze: 66.6667, tragbarkeitsLimit: 33.3334, minEigenkapital: 20 };

export function affordability(inp, rules = RULES) {
  const wert = inp.wert, ek = inp.eigenkapital, brutto = inp.bruttoeinkommenJahr;
  const hypothek = Math.max(0, wert - ek);
  const belehnung = wert > 0 ? hypothek / wert * 100 : 0;
  const zinslast = hypothek * rules.kalkZins / 100;
  const nebenkosten = wert * rules.nebenkostenSatz / 100;
  const zweiteHyp = Math.max(0, hypothek - wert * rules.ersteHypGrenze / 100);
  const amortisation = zweiteHyp / rules.amortJahre;
  const gesamtlast = zinslast + nebenkosten + amortisation;
  const quote = brutto > 0 ? gesamtlast / brutto * 100 : Infinity;
  const ekQuote = wert > 0 ? ek / wert * 100 : 0;
  const tragbar = quote <= rules.tragbarkeitsLimit && belehnung <= rules.maxBelehnung && ekQuote >= rules.minEigenkapital;
  return { hypothek, belehnung, zinslast, nebenkosten, zweiteHyp, amortisation, gesamtlast, quote, ekQuote, tragbar };
}

// Max. tragbarer Kaufpreis bei gegebenem Einkommen + Eigenkapital
export function maxAffordable(brutto, eigenkapital, rules = RULES) {
  const byEquity = eigenkapital / (rules.minEigenkapital / 100); // EK >= 20% des Werts
  let lo = 0, hi = byEquity;
  for (let k = 0; k < 60; k++) {
    const mid = (lo + hi) / 2;
    const r = affordability({ wert: mid, eigenkapital, bruttoeinkommenJahr: brutto }, rules);
    if (r.quote <= rules.tragbarkeitsLimit && r.belehnung <= rules.maxBelehnung) lo = mid; else hi = mid;
  }
  return lo;
}
