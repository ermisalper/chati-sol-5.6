// =============================================================================
// Combinvest Advisory Engine — globales Datenmodell
// Kanonische TypeScript-Typen (portabel nach Next.js/React). Kein `any`.
// =============================================================================

/** Relevanz 1 = Sehr gering … 6 = Sehr hoch (Kreisdiagramm-Skala). */
export type RiskScore = 1 | 2 | 3 | 4 | 5 | 6;

export type SwissPillar = 'Pillar1_AHV' | 'Pillar2_BVG' | 'Pillar3a_Private' | 'Pillar3b_Free';

/** Amtliche Kantonskürzel — für Prämienregion & Steuerprogression. */
export type CantonCode =
  | 'AG' | 'AI' | 'AR' | 'BE' | 'BL' | 'BS' | 'FR' | 'GE' | 'GL' | 'GR'
  | 'JU' | 'LU' | 'NE' | 'NW' | 'OW' | 'SG' | 'SH' | 'SO' | 'SZ' | 'TG'
  | 'TI' | 'UR' | 'VD' | 'VS' | 'ZG' | 'ZH';

/** Beitrags-/Zahlungsfrequenz (unterjährige Beitragszahlungen). */
export type PaymentFrequency = 'monthly' | 'quarterly' | 'semiannual' | 'annual';

export type Currency = number; // CHF, immer als Zahl (Rappen via 2 Dezimalstellen)
export type Percent = number;  // Prozentwert, z. B. 3.0 = 3 %
export type ISODate = string;  // 'YYYY-MM-DD'

// -----------------------------------------------------------------------------
// Basis
// -----------------------------------------------------------------------------

export interface Basisdaten {
  vorname: string;
  nachname: string;
  geburtsdatum: ISODate;
  geschlecht: 'M' | 'W';
  wohnort_plz: string;
  kanton: CantonCode;
  einkommen_brutto_jahr: Currency;
  einkommen_netto_monat: Currency;
  erwerbsstatus: 'angestellt' | 'selbststaendig';
}

// -----------------------------------------------------------------------------
// Zwei-Phasen-Vorsorgemodell (withdrawal-calculator)
// -----------------------------------------------------------------------------

/** Sparphase (Accumulation). */
export interface AccumulationConfig {
  startkapital: Currency;
  sparrate_monat: Currency;
  zins_sparphase: Percent;      // effektiver Jahreszins
  dynamik_faktor: Percent;      // jährl. Erhöhung der Sparrate (CH-Standard 1.0)
  jahre_sparphase: number;      // bis Rentenbeginn
  zahlweise: PaymentFrequency;  // unterjährige Beiträge
}

/** Entnahmephase (Decumulation). */
export interface DecumulationConfig {
  entnahme_monat: Currency;     // gewünschte Monatsrente
  zins_entnahmephase: Percent;  // konservativ, CH-Standard 2.0
  entnahme_jahre: number;       // Slider 1–52
}

export interface PensionEngineInput {
  accumulation: AccumulationConfig;
  decumulation: DecumulationConfig;
}

/** Ein Punkt der Kapitalkurve (Jahr → Kapital). */
export interface CapitalPoint {
  t: number;        // Jahre seit Start
  cap: Currency;
}

export interface PensionEngineOutput {
  benoetigte_sparrate_monat: Currency; // gelöst (Binärsuche)
  zielkapital_bei_rente: Currency;     // Peak
  peak_jahr: number;                   // = jahre_sparphase
  kurve: CapitalPoint[];               // Sparphase → Entnahmephase (Peak-Vektorgrafik)
  reicht_bis_jahr: number;             // wann Restkapital ~0
}

// -----------------------------------------------------------------------------
// Kantonale Steuerprogression (Edge-Case Steuer-Module)
// -----------------------------------------------------------------------------

export interface TaxBracket {
  ab_einkommen: Currency; // Untergrenze des steuerbaren Einkommens
  grenzsteuersatz: Percent;
}

export interface CantonalTaxProfile {
  kanton: CantonCode;
  gemeinde?: string;
  konfession?: 'roemisch-katholisch' | 'reformiert' | 'andere' | 'keine';
  progression: TaxBracket[]; // aufsteigend nach ab_einkommen sortiert
}

// -----------------------------------------------------------------------------
// Die 8 Module
// -----------------------------------------------------------------------------

export interface PensionGapData {
  relevanz: RiskScore;
  saeule1_ahv_jahr: Currency;
  saeule2_bvg_kapital: Currency;
  saeule3a_kapital: Currency;
  wunsch_rente_monat: Currency;
  engine: PensionEngineInput;
  ergebnis?: PensionEngineOutput;
}

export type InvestorRiskClass = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface InvestmentData {
  relevanz: RiskScore;
  anlagehorizont_jahre: number;
  monatlich_verfuegbar: Currency;
  risikoklasse: InvestorRiskClass;
  produktkosten_ter: Percent;      // TER des ETF/Fonds
  inflation_annahme: Percent;
  ziele: Array<'wealth_building' | 'high_returns' | 'retirement' | 'protection_family' | 'tax_advantages'>;
}

export interface PropertyCreationData {
  relevanz: RiskScore;
  aktueller_lebensstandard_monat: Currency;
  gewuenschter_lebensstandard_monat: Currency;
  luecke_monat: Currency;
}

export type FranchiseAdult = 300 | 500 | 1000 | 1500 | 2000 | 2500;
export type FranchiseChild = 0 | 100 | 200 | 300 | 400 | 500 | 600;

export interface HealthData {
  relevanz: RiskScore;
  altersklasse: 'ERW' | 'JUG' | 'KIN';
  unfalldeckung: 'MIT-UNF' | 'OHN-UNF';
  aktuelle_franchise: FranchiseAdult | FranchiseChild;
  erwartete_kosten_jahr: Currency;
  aktuelle_praemie_monat?: Currency;
}

export interface RealEstateAffordability {
  liegenschaftswert: Currency;
  eigenkapital: Currency;
  hypothek: Currency;             // = wert - eigenkapital
  kalk_zins: Percent;             // FIX 5.0 (Banken-Standard)
  nebenkosten_satz: Percent;      // FIX 1.0 des Werts / Jahr
  amortisation_jahr: Currency;
  tragbarkeit_quote: Percent;     // Last / Bruttoeinkommen, Limit 33.33
  tragbar: boolean;
}

export interface RealEstateData {
  relevanz: RiskScore;
  wohnsituation: 'miete' | 'eigentum';
  tragbarkeit?: RealEstateAffordability;
}

export interface Child {
  vorname?: string;
  geburtsdatum: ISODate;
  in_ausbildung: boolean;
}

export interface ChildrenData {
  relevanz: RiskScore;
  kinder: Child[];
  spar_zielbetrag: Currency;
  spar_horizont_jahre: number;
}

export interface TaxAdvantageData {
  relevanz: RiskScore;
  saeule3a_einzahlung_jahr: Currency;   // max. gefördert beachten
  grenzsteuersatz: Percent;
  steuerprofil: CantonalTaxProfile;
  ersparnis_jahr?: Currency;
}

export type InsuranceProductKey =
  | 'vorsorgeversicherung' | 'vorsorgebank_3a' | 'hypothek' | 'private_haftpflicht'
  | 'sparplan' | 'krankenkasse' | 'gebaeude' | 'rechtsschutz' | 'hausrat'
  | 'motorfahrzeug' | 'kindersparplan' | 'todesfall' | 'erwerbsunfaehigkeit' | 'kredit';

export interface ExistingContract {
  produkt: InsuranceProductKey;
  gesellschaft?: string;
  policennummer?: string;
  ablauf?: string; // 'MM.YYYY'
  praemie_monat?: Currency;
}

export interface InsuranceData {
  relevanz: RiskScore;
  vertraege: ExistingContract[];
}

// -----------------------------------------------------------------------------
// Kundenprofil (globaler State) + Notizen (Catalyst-Übergabe)
// -----------------------------------------------------------------------------

export type ModuleKey =
  | 'pensiongap' | 'investment' | 'property_creation' | 'health'
  | 'real_estate' | 'children' | 'tax_advantage' | 'values_protection';

export interface CustomerModules {
  pensiongap: PensionGapData;
  investment: InvestmentData;
  property_creation: PropertyCreationData;
  health: HealthData;
  real_estate: RealEstateData;
  children: ChildrenData;
  tax_advantage: TaxAdvantageData;
  values_protection: InsuranceData;
}

/** Persistent Side-Notes → Catalyst „Notizen/Aufgaben". */
export interface AdvisorNote {
  modul: ModuleKey | 'general';
  text: string;
  updated_at: ISODate;
}

export interface CustomerProfile {
  id: string;
  basisdaten: Basisdaten;
  modules: CustomerModules;
  notizen: AdvisorNote[];
  erstellt_am: ISODate;
  berater_id?: string;
}
