/* Variable records — domain 1: Health Behaviors and Daily Routines.
 *
 * Keys are the dotted node ids from data/taxonomy.js. A variable with no key
 * here renders in the "not yet defined" state; use the "Copy blank record"
 * button on its card to get a ready-to-paste stub.
 *
 * NOTE: code sets below are illustrative starting points and must be validated
 * against the local EHR build before use.
 */

window.EXPOSOME_VARIABLES = Object.assign(window.EXPOSOME_VARIABLES || {}, {

  "health.sleep.duration": {
    status: "final",
    updated: "2026-08-13",
    construct: "Habitual nightly sleep duration, expressed as average hours of sleep per 24-hour period over a defined reference window.",
    rationale: "Short and long sleep duration both show U-shaped associations with cardiometabolic and cognitive outcomes, and sleep duration mediates several other exposome domains (shift work, caregiving burden, neighborhood noise).",
    measure: "Self-reported average hours of sleep per night, taken from the sleep-history item in the intake questionnaire; where wearable data are available, mean nightly total sleep time over the preceding 30 nights supersedes self-report.",
    units: "Hours per night (continuous, one decimal place)",
    coding: "Continuous 0–14. Analytic categories: short <6, adequate 6–8.9, long ≥9. Values <2 or >14 set to missing.",
    temporal: "Time-varying; one value per reporting occasion",
    lookback: "Preceding 30 days relative to the index encounter",
    ehr: {
      sources: [
        "Sleep-history flowsheet rows captured at intake and annual wellness visits",
        "Sleep-medicine questionnaire instruments where administered",
        "Device-integration feed for patients with a linked wearable"
      ],
      codes: [
        { system: "ICD-10-CM", value: "G47.00–G47.09", note: "Insomnia — supporting context, not the measure itself" },
        { system: "ICD-10-CM", value: "G47.33", note: "Obstructive sleep apnea — effect modifier" },
        { system: "SNOMED CT", value: "248263006", note: "Finding of sleep duration — where the local build maps it" }
      ],
      nlp: false,
      coverage: "Structured capture is concentrated in primary care and sleep medicine; expect roughly a third of the general cohort to have a value in any 12-month window."
    },
    external: [],
    formula: "sleep_hours = mean(nightly_sleep_hours over lookback)\n\nshort_sleep  = 1 if sleep_hours < 6\nlong_sleep   = 1 if sleep_hours >= 9\n\nWhere both self-report and wearable data exist, use the wearable mean and\nretain the self-reported value as sleep_hours_selfreport for sensitivity analysis.",
    derivationNotes: "Wearable and self-reported durations are not interchangeable; self-report typically exceeds device-measured sleep by 20–40 minutes. Always carry a source indicator alongside the value.",
    validity: "Self-report is subject to recall and social-desirability bias, and a single item cannot separate time in bed from time asleep. Device data are missing non-randomly — wearable ownership tracks income and age.",
    missingness: "High. Do not treat absence of a sleep value as normal sleep. Consider multiple imputation with predictors drawn from the work-schedule and psychological-stress domains.",
    equity: "Wearable-derived values will over-represent higher-income, younger, and non-shift-working patients; restricting to device data introduces a selection gradient that runs opposite to the exposure of interest.",
    references: [
      { citation: "Watson NF, et al. Recommended amount of sleep for a healthy adult: a joint consensus statement of the AASM and SRS. Sleep. 2015;38(6):843–844.", pmid: "26039963", doi: "" },
      { citation: "Lauderdale DS, et al. Self-reported and measured sleep duration: how similar are they? Epidemiology. 2008;19(6):838–845.", pmid: "18854708", doi: "" }
    ],
    tags: ["self-report", "wearable", "time-varying", "exemplar"]
  },

  "health.tobacco.pack-years": {
    status: "draft",
    updated: "2026-08-13",
    construct: "Cumulative lifetime tobacco exposure, expressed in pack-years, combining average intensity with duration of smoking.",
    rationale: "Cumulative dose predicts pulmonary and cardiovascular outcomes better than current smoking status, and it is the standard eligibility metric for lung-cancer screening.",
    measure: "Derived from the structured smoking-history fields: packs per day and years smoked.",
    units: "Pack-years (continuous)",
    coding: "Continuous ≥0. Common analytic bands: 0, >0–19, 20–39, ≥40.",
    temporal: "Cumulative to the index date",
    lookback: "Lifetime",
    ehr: {
      sources: [
        "Social-history smoking module: packs/day, years used, start and quit dates",
        "Lung-cancer screening eligibility fields where populated"
      ],
      codes: [
        { system: "ICD-10-CM", value: "Z87.891", note: "Personal history of nicotine dependence" },
        { system: "ICD-10-CM", value: "F17.2xx", note: "Nicotine dependence, by product" },
        { system: "LOINC", value: "8663-7", note: "Cigarettes smoked per day — current" },
        { system: "LOINC", value: "63581-8", note: "Pack-years, where computed and stored by the source system" }
      ],
      nlp: false,
      coverage: "Smoking status is near-universal; the quantitative fields needed for pack-years are far sparser and frequently stale."
    },
    external: [],
    formula: "pack_years = (cigarettes_per_day / 20) * years_smoked\n\nIf packs_per_day is stored directly:\n  pack_years = packs_per_day * years_smoked\n\nyears_smoked = (quit_date or index_date) - start_date, in years",
    derivationNotes: "Structured pack-year fields are often carried forward unchanged for years. Prefer recomputing from packs/day and dates over trusting a stored value, and record which path was used.",
    validity: "Intensity fields are frequently null for former smokers, and start dates are often absent, forcing an assumption about smoking onset that materially shifts the distribution.",
    missingness: "",
    equity: "",
    references: [],
    tags: ["derived", "cumulative", "exemplar"]
  }

});
