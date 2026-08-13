/* Life-Experience Exposome — taxonomy (structure only).
 *
 * This file is the single source of truth for the hierarchy. Node ids are
 * derived by joining slugs with "." from the domain down, e.g.
 *   psychological.trauma.childhood-adversity
 * That id is the deep-link anchor (#/<id>) and the key used in data/variables/*.js.
 *
 * Adding a variable = add a {slug, label} leaf here. Its card will render in the
 * "not yet defined" state until a matching record exists in data/variables/.
 * Do not rename a slug once published — it breaks existing deep links.
 */

window.EXPOSOME_TAXONOMY = {
  title: "Life-Experience Exposome",
  version: "0.1.0",
  updated: "2026-08-13",
  citation: "GECC Life-Experience Exposome Variable Dictionary, v0.1.0 (2026).",
  domains: [
    {
      slug: "health",
      number: "1",
      label: "Health Behaviors and Daily Routines",
      color: "#2f7d6f",
      children: [
        {
          slug: "tobacco", number: "1.1", label: "Tobacco Use",
          children: [
            { slug: "status", label: "Never/former/current use" },
            { slug: "intensity", label: "Smoking intensity" },
            { slug: "pack-years", label: "Duration and pack-years" },
            { slug: "cessation", label: "Cessation and relapse" }
          ]
        },
        {
          slug: "alcohol", number: "1.2", label: "Alcohol Use",
          children: [
            { slug: "current-use", label: "Current use" },
            { slug: "frequency-quantity", label: "Frequency and quantity" },
            { slug: "heavy-binge", label: "Heavy or binge drinking" },
            { slug: "disorder", label: "Alcohol-related disorder" }
          ]
        },
        {
          slug: "substances", number: "1.3", label: "Other Substance Use",
          children: [
            { slug: "cannabis", label: "Cannabis" },
            { slug: "opioids", label: "Opioids" },
            { slug: "stimulants", label: "Stimulants" },
            { slug: "sedatives", label: "Sedative/hypnotic misuse" },
            { slug: "polysubstance", label: "Polysubstance use" }
          ]
        },
        {
          slug: "physical-activity", number: "1.4", label: "Physical Activity",
          children: [
            { slug: "frequency", label: "Exercise frequency" },
            { slug: "intensity", label: "Exercise intensity" },
            { slug: "active-transport", label: "Walking and active transportation" },
            { slug: "sedentary", label: "Sedentary time" },
            { slug: "activity-change", label: "Longitudinal activity change" }
          ]
        },
        {
          slug: "diet", number: "1.5", label: "Diet and Nutrition",
          children: [
            { slug: "pattern", label: "Dietary pattern" },
            { slug: "food-quality", label: "Food quality" },
            { slug: "caloric-adequacy", label: "Caloric adequacy" },
            { slug: "supplements", label: "Supplement use" }
          ]
        },
        {
          slug: "sleep", number: "1.6", label: "Sleep Behaviors",
          children: [
            { slug: "duration", label: "Sleep duration" },
            { slug: "regularity", label: "Sleep regularity" },
            { slug: "timing", label: "Sleep timing" },
            { slug: "napping", label: "Daytime napping" },
            { slug: "shift-disruption", label: "Shift-related sleep disruption" },
            { slug: "hygiene", label: "Sleep hygiene" }
          ]
        },
        {
          slug: "health-constraints", number: "1.7", label: "Health-Related Constraints on Life Experience",
          children: [
            { slug: "sensory", label: "Sensory function" },
            { slug: "mobility", label: "Mobility and physical function" },
            { slug: "daily-function", label: "Daily function" },
            { slug: "symptom-burden", label: "Symptom burden" }
          ]
        },
        {
          slug: "leisure", number: "1.8", label: "Leisure Activities",
          children: [
            { slug: "cognitive-activities", label: "Reading and cognitively stimulating activities" },
            { slug: "games-hobbies", label: "Games and hobbies" },
            { slug: "cultural", label: "Cultural participation" },
            { slug: "digital-engagement", label: "Digital or technology engagement" }
          ]
        }
      ]
    },

    {
      slug: "work",
      number: "2",
      label: "Work and Caregiving",
      color: "#7a5ea7",
      children: [
        {
          slug: "employment-status", number: "2.1", label: "Employment Status",
          children: [
            { slug: "category", label: "Employed / unemployed / retired" },
            { slug: "unable-to-work", label: "Unable to work" }
          ]
        },
        {
          slug: "occupation", number: "2.2", label: "Occupation",
          children: [
            { slug: "category", label: "Occupational category" },
            { slug: "industry", label: "Industry sector" },
            { slug: "complexity", label: "Occupational complexity" },
            { slug: "hazards", label: "Occupational hazards" }
          ]
        },
        {
          slug: "demands", number: "2.3", label: "Occupational Demands",
          children: [
            { slug: "physical", label: "Physical demands" },
            { slug: "cognitive", label: "Cognitive demands" },
            { slug: "emotional", label: "Emotional demands" },
            { slug: "job-control", label: "Job control" },
            { slug: "job-strain", label: "Job strain" },
            { slug: "workplace-support", label: "Workplace social support" }
          ]
        },
        {
          slug: "schedule", number: "2.4", label: "Work Schedule",
          children: [
            { slug: "shift-work", label: "Shift work" },
            { slug: "night-work", label: "Night work" },
            { slug: "long-hours", label: "Long working hours" },
            { slug: "multiple-jobs", label: "Multiple jobs" },
            { slug: "irregular", label: "Irregular schedules" },
            { slug: "remote-onsite", label: "Remote versus on-site work" }
          ]
        },
        {
          slug: "stability", number: "2.5", label: "Employment Stability and Transitions",
          children: [
            { slug: "job-loss", label: "Job loss" },
            { slug: "job-changes", label: "Job changes" },
            { slug: "medical-leave", label: "Medical leave" },
            { slug: "disability-leave", label: "Disability leave" },
            { slug: "early-retirement", label: "Early retirement" },
            { slug: "insurance-proxy", label: "Insurance changes as an employment proxy" }
          ]
        },
        {
          slug: "caregiving", number: "2.6", label: "Unpaid Caregiving",
          children: [
            { slug: "status", label: "Caregiving status" },
            { slug: "recipient", label: "Care recipient" },
            { slug: "intensity", label: "Caregiving intensity" },
            { slug: "duration", label: "Duration" },
            { slug: "strain", label: "Caregiver strain" }
          ]
        },
        {
          slug: "role-burden", number: "2.7", label: "Role Burden",
          children: [
            { slug: "work-family-conflict", label: "Work–family conflict" },
            { slug: "caregiver-strain", label: "Caregiver strain" },
            { slug: "multiple-role", label: "Multiple-role burden" },
            { slug: "role-captivity", label: "Role captivity" },
            { slug: "role-loss", label: "Loss of productive roles" }
          ]
        }
      ]
    },

    {
      slug: "social",
      number: "3",
      label: "Family, Household, and Social Relationships",
      color: "#b06a34",
      children: [
        {
          slug: "partnership", number: "3.1", label: "Partnership and Marital Relationships",
          children: [
            { slug: "status", label: "Marital/partner status" },
            { slug: "duration", label: "Partnership duration" },
            { slug: "separation", label: "Separation or divorce" },
            { slug: "partner-loss", label: "Partner loss" },
            { slug: "quality", label: "Relationship quality" }
          ]
        },
        {
          slug: "household", number: "3.2", label: "Household Structure",
          children: [
            { slug: "living-alone", label: "Living alone" },
            { slug: "size", label: "Household size" },
            { slug: "multigenerational", label: "Multigenerational household" },
            { slug: "transitions", label: "Residential transitions" },
            { slug: "institutional", label: "Institutional residence" }
          ]
        },
        {
          slug: "family", number: "3.3", label: "Family Relationships",
          children: [
            { slug: "close-members", label: "Number of close family members" },
            { slug: "contact-frequency", label: "Frequency of family contact" },
            { slug: "support", label: "Family support" },
            { slug: "conflict", label: "Family conflict" },
            { slug: "estrangement", label: "Estrangement" }
          ]
        },
        {
          slug: "network", number: "3.4", label: "Social Network Structure",
          children: [
            { slug: "size", label: "Network size" },
            { slug: "diversity", label: "Network diversity" },
            { slug: "interaction-frequency", label: "Frequency of interaction" },
            { slug: "proximity", label: "Geographic proximity" },
            { slug: "change", label: "Network change over time" }
          ]
        },
        {
          slug: "support", number: "3.5", label: "Social Support",
          children: [
            { slug: "emotional", label: "Emotional support" },
            { slug: "instrumental", label: "Instrumental support" },
            { slug: "informational", label: "Informational support" },
            { slug: "perceived-availability", label: "Perceived availability of support" }
          ]
        },
        {
          slug: "participation", number: "3.6", label: "Social Participation",
          children: [
            { slug: "community", label: "Community participation" },
            { slug: "religious", label: "Religious or spiritual participation" },
            { slug: "volunteering", label: "Volunteering" },
            { slug: "group-activities", label: "Group activities" },
            { slug: "engagement-frequency", label: "Frequency of social engagement" }
          ]
        },
        {
          slug: "disconnection", number: "3.7", label: "Social Disconnection",
          children: [
            { slug: "isolation", label: "Objective social isolation" },
            { slug: "loneliness", label: "Subjective loneliness" },
            { slug: "reduced-contact", label: "Reduced social contact" },
            { slug: "withdrawal", label: "Social withdrawal" }
          ]
        },
        {
          slug: "loss", number: "3.8", label: "Relationship Disruption and Loss",
          children: [
            { slug: "bereavement", label: "Bereavement" },
            { slug: "divorce", label: "Divorce or separation" },
            { slug: "family-illness", label: "Family illness" },
            { slug: "institutionalization", label: "Family institutionalization" },
            { slug: "network-loss", label: "Loss of social network members" }
          ]
        }
      ]
    },

    {
      slug: "psychological",
      number: "4",
      label: "Psychological Stress, Emotion, and Adverse Experiences",
      color: "#a84f66",
      children: [
        {
          slug: "stress", number: "4.1", label: "Perceived and Chronic Stress",
          children: [
            { slug: "perceived", label: "Perceived stress" },
            { slug: "chronic-burden", label: "Chronic stress burden" },
            { slug: "role-related", label: "Role-related stress" },
            { slug: "accumulation", label: "Accumulation of stressors" }
          ]
        },
        {
          slug: "negative-affect", number: "4.2", label: "Negative Emotional Experience",
          children: [
            { slug: "depressive", label: "Depressive symptoms" },
            { slug: "anxiety", label: "Anxiety symptoms" },
            { slug: "anger-hostility", label: "Anger and hostility" },
            { slug: "distress", label: "Distress" },
            { slug: "instability", label: "Emotional instability" }
          ]
        },
        {
          slug: "trauma", number: "4.3", label: "Trauma and Adversity",
          children: [
            { slug: "childhood-adversity", label: "Childhood adversity" },
            { slug: "interpersonal-violence", label: "Interpersonal violence" },
            { slug: "accidents", label: "Serious accidents" },
            { slug: "combat-disaster", label: "Combat or disaster exposure" },
            { slug: "ptsd-symptoms", label: "Post-traumatic symptoms" }
          ]
        },
        {
          slug: "life-events", number: "4.4", label: "Major Life Events",
          children: [
            { slug: "bereavement", label: "Bereavement" },
            { slug: "job-loss", label: "Job loss" },
            { slug: "financial-crisis", label: "Financial crisis" },
            { slug: "serious-illness", label: "Serious illness in self or family" },
            { slug: "displacement", label: "Residential displacement" }
          ]
        },
        {
          slug: "discrimination", number: "4.5", label: "Discrimination and Social Threat",
          children: [
            { slug: "interpersonal", label: "Interpersonal discrimination" },
            { slug: "workplace", label: "Workplace discrimination" },
            { slug: "healthcare", label: "Healthcare discrimination" },
            { slug: "vigilance", label: "Chronic vigilance or threat" }
          ]
        },
        {
          slug: "resources", number: "4.6", label: "Positive Psychological Resources",
          children: [
            { slug: "resilience", label: "Resilience" },
            { slug: "coping", label: "Coping capacity" },
            { slug: "optimism", label: "Optimism" },
            { slug: "purpose", label: "Purpose in life" },
            { slug: "positive-affect", label: "Positive affect" },
            { slug: "control", label: "Sense of control" }
          ]
        }
      ]
    },

    {
      slug: "socioeconomic",
      number: "5",
      label: "Socioeconomic Life Circumstances",
      color: "#3f6fa8",
      children: [
        {
          slug: "education", number: "5.1", label: "Education and Literacy",
          children: [
            { slug: "attainment", label: "Educational attainment" },
            { slug: "quality", label: "Educational quality" },
            { slug: "health-literacy", label: "Health literacy" },
            { slug: "digital-literacy", label: "Digital literacy" }
          ]
        },
        {
          slug: "financial", number: "5.2", label: "Financial Circumstances",
          children: [
            { slug: "income", label: "Income" },
            { slug: "strain", label: "Financial strain" },
            { slug: "debt", label: "Debt" },
            { slug: "material-hardship", label: "Material hardship" },
            { slug: "income-loss", label: "Sudden income loss" }
          ]
        },
        {
          slug: "insurance", number: "5.3", label: "Insurance and Healthcare Access",
          children: [
            { slug: "type", label: "Insurance type" },
            { slug: "instability", label: "Insurance instability" },
            { slug: "coverage-gaps", label: "Coverage gaps" },
            { slug: "primary-care", label: "Access to primary care" },
            { slug: "delayed-care", label: "Delayed or forgone care" }
          ]
        },
        {
          slug: "housing", number: "5.4", label: "Housing Circumstances",
          children: [
            { slug: "stability", label: "Housing stability" },
            { slug: "homelessness", label: "Homelessness" },
            { slug: "crowding", label: "Residential crowding" },
            { slug: "assisted-living", label: "Assisted living" },
            { slug: "moves", label: "Frequent residential moves" }
          ]
        },
        {
          slug: "food-transport", number: "5.5", label: "Food and Transportation Security",
          children: [
            { slug: "food-insecurity", label: "Food insecurity" },
            { slug: "transport-barriers", label: "Transportation barriers" },
            { slug: "missed-care", label: "Missed care due to transportation" },
            { slug: "transport-dependence", label: "Dependence on others for transportation" }
          ]
        },
        {
          slug: "technology", number: "5.6", label: "Technology and Information Access",
          children: [
            { slug: "internet", label: "Internet access" },
            { slug: "portal-use", label: "Patient-portal use" },
            { slug: "telehealth", label: "Telehealth access" },
            { slug: "digital-exclusion", label: "Digital exclusion" }
          ]
        }
      ]
    },

    {
      slug: "environment",
      number: "6",
      label: "Environment",
      color: "#4f8a3f",
      children: [
        { slug: "neighborhood-ses", number: "6.1", label: "Neighborhood Socioeconomic Context" },
        { slug: "built-environment", number: "6.2", label: "Built Environment and Walkability" },
        { slug: "resource-access", number: "6.3", label: "Access to Food, Healthcare, and Social Resources" },
        { slug: "safety", number: "6.4", label: "Crime and Neighborhood Safety" },
        { slug: "cohesion", number: "6.5", label: "Social Cohesion and Neighborhood Disorder" },
        { slug: "rurality", number: "6.6", label: "Rurality and Geographic Isolation" },
        {
          slug: "pollution", number: "6.7", label: "Environmental Pollution",
          children: [
            { slug: "air", label: "Air pollution" },
            { slug: "noise", label: "Noise" },
            { slug: "light-at-night", label: "Artificial light at night" },
            { slug: "temperature", label: "Temperature and climate stress" }
          ]
        },
        {
          slug: "policy", number: "6.8", label: "Policy and Historical Context",
          children: [
            { slug: "local-policies", label: "Local social policies" },
            { slug: "healthcare-policies", label: "Healthcare access policies" },
            { slug: "economic-shocks", label: "Economic shocks" },
            { slug: "historical-discrimination", label: "Historical discrimination or segregation" }
          ]
        }
      ]
    }
  ]
};
