/* Variable records — domain 4: Psychological Stress, Emotion, and Adverse Experiences.
 * Keys are the dotted node ids from data/taxonomy.js.
 */

window.EXPOSOME_VARIABLES = Object.assign(window.EXPOSOME_VARIABLES || {}, {

  "psychological.trauma.childhood-adversity": {
    status: "draft",
    updated: "2026-08-13",
    construct: "Exposure before age 18 to abuse, neglect, and household dysfunction, measured as a cumulative count of adversity categories.",
    rationale: "Cumulative childhood adversity shows graded associations with adult chronic disease, mental health, and health behaviors, and it is a plausible common cause upstream of several other exposome domains.",
    measure: "Adverse Childhood Experiences (ACE) questionnaire — 10-item original instrument, or the BRFSS ACE module where questionnaire burden is a constraint.",
    units: "Count of adversity categories endorsed (0–10)",
    coding: "Continuous 0–10; conventional categories 0, 1–3, ≥4. Item-level responses retained where consent permits.",
    temporal: "Retrospective, treated as time-invariant once recorded",
    lookback: "Lifetime, restricted to exposures occurring before age 18",
    ehr: {
      sources: [
        "Behavioral-health intake instruments where ACE screening is administered",
        "Social-work and psychiatry documentation (free text)",
        "Problem list entries for personal history of abuse"
      ],
      codes: [
        { system: "ICD-10-CM", value: "Z62.810", note: "Personal history of physical and sexual abuse in childhood" },
        { system: "ICD-10-CM", value: "Z62.811", note: "Personal history of psychological abuse in childhood" },
        { system: "ICD-10-CM", value: "Z62.812", note: "Personal history of neglect in childhood" },
        { system: "ICD-10-CM", value: "Z62.819", note: "Personal history of unspecified abuse in childhood" }
      ],
      nlp: true,
      coverage: "Very low in structured form outside behavioral health. Diagnosis codes identify only a small, highly selected subset and cannot reconstruct a cumulative count."
    },
    external: [],
    formula: "ace_score = sum of endorsed adversity categories (0–10)\nace_high  = 1 if ace_score >= 4\n\nEHR-only proxy (NOT a substitute for the instrument):\n  ace_documented = 1 if any Z62.81x code present\n  — treat as a distinct variable with its own name; do not merge into ace_score.",
    derivationNotes: "Do not impute an ACE score from diagnosis codes. The code-based proxy and the instrument measure different things, and conflating them destroys the dose–response structure that makes the score useful.",
    validity: "Retrospective recall of childhood events is subject to mood-congruent recall bias and to under-reporting, both of which vary with current mental health status. The count treats categories as equivalent and ignores severity, timing, and duration.",
    missingness: "Structured ACE data will be absent for the great majority of the cohort. If the score is central to an aim, plan for prospective collection rather than retrospective extraction.",
    equity: "Documented history of abuse in the EHR reflects who was asked and who was believed, not who was exposed. Code-based ascertainment will differentially over-identify patients with heavy behavioral-health contact.",
    references: [
      { citation: "Felitti VJ, et al. Relationship of childhood abuse and household dysfunction to many of the leading causes of death in adults: the Adverse Childhood Experiences (ACE) Study. Am J Prev Med. 1998;14(4):245–258.", pmid: "9635069", doi: "" },
      { citation: "Hughes K, et al. The effect of multiple adverse childhood experiences on health: a systematic review and meta-analysis. Lancet Public Health. 2017;2(8):e356–e366.", pmid: "29253477", doi: "" }
    ],
    tags: ["instrument", "retrospective", "sensitive", "exemplar"]
  }

});
