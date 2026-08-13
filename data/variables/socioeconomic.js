/* Variable records — domain 5: Socioeconomic Life Circumstances.
 * Keys are the dotted node ids from data/taxonomy.js.
 * Code sets are illustrative and must be validated against the local EHR build.
 */

window.EXPOSOME_VARIABLES = Object.assign(window.EXPOSOME_VARIABLES || {}, {

  "socioeconomic.food-transport.food-insecurity": {
    status: "final",
    updated: "2026-08-13",
    construct: "Limited or uncertain availability of nutritionally adequate and safe food, or limited ability to acquire food in socially acceptable ways, at the household level.",
    rationale: "Food insecurity is among the most actionable social exposures: it is screened in routine care, it is documented with a specific diagnosis code, and it links directly to referral pathways, which makes it a useful anchor variable for the socioeconomic domain.",
    measure: "Hunger Vital Sign — the two-item screener adapted from the USDA 18-item Household Food Security Survey Module. A response of 'often true' or 'sometimes true' to either item is a positive screen.",
    units: "Binary (positive / negative screen); ordinal 0–2 for item-count sensitivity analyses",
    coding: "1 = positive screen, 0 = negative screen. Declined and unable-to-answer responses are coded missing, not negative.",
    temporal: "Time-varying; screening is repeated at intervals set by local policy",
    lookback: "Items reference the preceding 12 months; the most recent screen within 24 months of the index date is used",
    ehr: {
      sources: [
        "SDOH screening module — Hunger Vital Sign flowsheet rows",
        "Problem list and encounter diagnoses",
        "Community-resource referral orders as a secondary signal",
        "Social-work documentation (free text) where structured screening is absent"
      ],
      codes: [
        { system: "ICD-10-CM", value: "Z59.41", note: "Food insecurity" },
        { system: "ICD-10-CM", value: "Z59.48", note: "Other specified lack of adequate food" },
        { system: "ICD-10-CM", value: "Z59.4", note: "Legacy code used before the 2021 expansion — include for historical data" },
        { system: "LOINC", value: "88122-7", note: "HVS item 1 — worried food would run out" },
        { system: "LOINC", value: "88123-5", note: "HVS item 2 — food bought didn't last" },
        { system: "LOINC", value: "88124-3", note: "HVS derived risk assessment" }
      ],
      nlp: true,
      coverage: "Structured screening is concentrated in primary care, oncology, and community health centers. Diagnosis codes alone capture only a fraction of positive screens — code-only ascertainment will substantially undercount."
    },
    external: [
      {
        dataset: "USDA Food Access Research Atlas",
        unit: "Census tract, updated periodically",
        key: "Geocoded residential address → 11-digit census tract FIPS, matched to the vintage nearest the index date",
        access: "Public, no application required",
        license: "Public domain (US federal)",
        url: "https://www.ers.usda.gov/data-products/food-access-research-atlas/"
      },
      {
        dataset: "USDA Household Food Security in the United States (CPS-FSS)",
        unit: "State-year",
        key: "State FIPS + calendar year — used for benchmarking cohort prevalence, not individual assignment",
        access: "Public",
        license: "Public domain (US federal)",
        url: "https://www.ers.usda.gov/topics/food-nutrition-assistance/food-security-in-the-u-s/"
      }
    ],
    formula: "food_insecure = 1 if (HVS_item1 in {often true, sometimes true})\n                    or (HVS_item2 in {often true, sometimes true})\n\nEHR-only fallback when no screen exists:\n  food_insecure_code = 1 if any qualifying Z59.4x code in the lookback window\n\nRecommended composite, carrying an ascertainment indicator:\n  food_insecure_any = max(food_insecure, food_insecure_code)\n  fi_source = 'screen' | 'code' | 'nlp' | 'none'",
    derivationNotes: "Keep the ascertainment source as a covariate. Screened and code-identified patients differ systematically: the code population is enriched for high utilizers and for sites with SDOH documentation incentives.",
    validity: "The two-item screener trades specificity for sensitivity by design. Absence of a screen is not evidence of food security, and screening itself is non-random — it is triggered by clinic type, visit length, and staffing.",
    missingness: "Expect the majority of patient-years to have no screen. Model screening propensity explicitly rather than assuming missing-at-random; site and department are strong predictors of being screened at all.",
    equity: "Documentation is denser in safety-net settings, which can invert the apparent gradient: patients in well-resourced practices may be food insecure and never screened. Report screening coverage by subgroup alongside prevalence.",
    references: [
      { citation: "Hager ER, et al. Development and validity of a 2-item screen to identify families at risk for food insecurity. Pediatrics. 2010;126(1):e26–e32.", pmid: "20595453", doi: "" },
      { citation: "Gundersen C, Ziliak JP. Food insecurity and health outcomes. Health Aff (Millwood). 2015;34(11):1830–1839.", pmid: "26526240", doi: "" }
    ],
    tags: ["SDOH", "screener", "z-code", "linkage", "exemplar"]
  }

});
