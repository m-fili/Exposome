/* Variable records — domain 6: Environment.
 * Keys are the dotted node ids from data/taxonomy.js.
 * Geospatial linkages below assume address geocoding is performed inside the
 * enclave and that only derived area-level measures leave the geocoding step.
 */

window.EXPOSOME_VARIABLES = Object.assign(window.EXPOSOME_VARIABLES || {}, {

  "environment.neighborhood-ses": {
    status: "review",
    updated: "2026-08-13",
    construct: "The aggregate socioeconomic composition of a patient's residential neighborhood — income, education, employment, and housing quality — treated as a contextual exposure distinct from individual socioeconomic position.",
    rationale: "Area-level deprivation predicts outcomes after adjustment for individual socioeconomic measures, and it is available for essentially every patient with a valid address, which makes it the highest-coverage variable in the exposome.",
    measure: "Area Deprivation Index (ADI) national percentile from the Neighborhood Atlas, assigned by residential census block group. State decile retained as a secondary measure for within-state analyses.",
    units: "Percentile (1–100); higher = more deprived",
    coding: "Continuous 1–100; quintiles for stratified reporting. Suppressed block groups (institutional or low-population) are coded missing rather than imputed to the median.",
    temporal: "Time-varying at the address level; reassign whenever the address of record changes",
    lookback: "Address as of the index date; a residential history table supports cumulative exposure measures",
    ehr: {
      sources: [
        "Patient registration address history",
        "Geocoding service output — census block group FIPS, match score, match type"
      ],
      codes: [
        { system: "ICD-10-CM", value: "Z59.x", note: "Housing and economic circumstance codes — related but not a substitute" }
      ],
      nlp: false,
      coverage: "Near-universal among patients with a geocodable address. Expect a small share of PO-box, institutional, and out-of-state addresses to fail geocoding."
    },
    external: [
      {
        dataset: "Neighborhood Atlas — Area Deprivation Index",
        unit: "Census block group, released by vintage",
        key: "12-digit block group FIPS from geocoded address, matched to the ADI vintage nearest the index date",
        access: "Free registration required",
        license: "Free for research use under the Neighborhood Atlas terms",
        url: "https://www.neighborhoodatlas.medicine.wisc.edu/"
      },
      {
        dataset: "CDC/ATSDR Social Vulnerability Index",
        unit: "Census tract, biennial",
        key: "11-digit tract FIPS",
        access: "Public",
        license: "Public domain (US federal)",
        url: "https://www.atsdr.cdc.gov/placeandhealth/svi/"
      },
      {
        dataset: "American Community Survey 5-year estimates",
        unit: "Census tract or block group, annual rolling",
        key: "Tract or block group FIPS + release year",
        access: "Public (API)",
        license: "Public domain (US federal)",
        url: "https://www.census.gov/programs-surveys/acs"
      }
    ],
    formula: "adi_national = ADI_percentile[ block_group_fips(address_at_index), vintage ]\n\nCumulative exposure across a residential history:\n  adi_cumulative = sum_i ( adi_national_i * days_at_address_i ) / sum_i ( days_at_address_i )",
    derivationNotes: "Record the geocoding match score and match type. Rooftop, street-segment, and ZIP-centroid matches are not equivalent; ZIP-centroid fallbacks should generally be treated as missing for block-group measures.",
    validity: "Area-level measures are subject to ecological fallacy and to the modifiable areal unit problem — results can shift with the choice of block group versus tract. ADI's housing-cost components behave differently in high-cost urban markets, where the index can misclassify affluent renters as deprived.",
    missingness: "Driven by address quality, homelessness, and institutional addresses — that is, missingness correlates directly with the exposure of interest. Report it as a finding, not a nuisance.",
    equity: "Address instability is itself an exposure. Patients with the most residential churn have the least reliable assignment, which attenuates estimates in exactly the group of greatest interest.",
    references: [
      { citation: "Kind AJH, Buckingham WR. Making neighborhood-disadvantage metrics accessible — the Neighborhood Atlas. N Engl J Med. 2018;378(26):2456–2458.", pmid: "29949490", doi: "" },
      { citation: "Kind AJH, et al. Neighborhood socioeconomic disadvantage and 30-day rehospitalization. Ann Intern Med. 2014;161(11):765–774.", pmid: "25437404", doi: "" }
    ],
    tags: ["geospatial", "area-level", "high-coverage", "exemplar"]
  },

  "environment.pollution.air": {
    status: "final",
    updated: "2026-08-13",
    construct: "Ambient outdoor air pollution at the residential location, primarily fine particulate matter (PM2.5), with nitrogen dioxide and ozone as companion pollutants.",
    rationale: "Ambient PM2.5 has established associations with cardiovascular, respiratory, and neurocognitive outcomes, and modeled surfaces give complete national coverage at daily resolution — no patient-level measurement required.",
    measure: "Annual and moving-window mean PM2.5 from a modeled national surface, assigned at the geocoded residential address.",
    units: "µg/m³ (PM2.5); ppb (NO2); ppb 8-hour daily maximum (O3)",
    coding: "Continuous. Report both the continuous value and an indicator for exceeding the current annual national standard.",
    temporal: "Daily surface, aggregated to 1-year, 3-year, and 5-year moving means",
    lookback: "1, 3, and 5 years preceding the index date, produced as parallel variables",
    ehr: {
      sources: [
        "Registration address history",
        "Geocoding service output — latitude/longitude and census tract FIPS"
      ],
      codes: [],
      nlp: false,
      coverage: "Complete for any patient with a geocodable US address; no clinical documentation dependency."
    },
    external: [
      {
        dataset: "EPA Air Quality System (AQS) monitor data",
        unit: "Monitor site, daily",
        key: "Nearest-monitor distance from residential coordinates, with a maximum radius",
        access: "Public (API)",
        license: "Public domain (US federal)",
        url: "https://www.epa.gov/aqs"
      },
      {
        dataset: "EPA Fused Air Quality Surface Downscaler (CMAQ + monitors)",
        unit: "Census tract, daily",
        key: "Tract FIPS + date",
        access: "Public",
        license: "Public domain (US federal)",
        url: "https://www.epa.gov/hesc/rsig-related-downloadable-data-files"
      },
      {
        dataset: "NASA SEDAC / satellite-derived global PM2.5 estimates",
        unit: "~1 km grid, monthly to annual",
        key: "Residential latitude/longitude → grid cell",
        access: "Free registration",
        license: "Open, attribution required",
        url: "https://sedac.ciesin.columbia.edu/"
      }
    ],
    formula: "pm25_1yr = mean( daily_pm25[ grid_cell(lat, lon), d ] ) for d in [index_date - 365, index_date]\npm25_3yr = mean over the preceding 1095 days\n\nWith a residential history, weight by time at each address:\n  pm25_exposure = sum_i ( pm25_i * days_i ) / sum_i ( days_i )",
    derivationNotes: "Fix the exposure window before analysis and report it explicitly — 1-year and 5-year means yield materially different effect estimates for the same cohort. Nearest-monitor assignment and modeled-surface assignment should not be mixed within one variable.",
    validity: "Residential assignment ignores workplace, commute, and indoor exposure, biasing toward the null for working-age adults. Modeled surfaces carry spatially structured error that is larger in rural areas with sparse monitoring.",
    missingness: "Effectively none where geocoding succeeds; missingness reduces to the address-quality problem described under neighborhood socioeconomic context.",
    equity: "Monitor density is lower in rural and in some historically under-resourced areas, so estimate uncertainty is unevenly distributed. Carry the model's uncertainty estimate alongside the point value where the surface provides one.",
    references: [
      { citation: "Di Q, et al. Air pollution and mortality in the Medicare population. N Engl J Med. 2017;376(26):2513–2522.", pmid: "28657878", doi: "" },
      { citation: "Brook RD, et al. Particulate matter air pollution and cardiovascular disease: an update to the scientific statement from the American Heart Association. Circulation. 2010;121(21):2331–2378.", pmid: "20458016", doi: "" }
    ],
    tags: ["geospatial", "modeled-surface", "time-varying", "exemplar"]
  }

});
