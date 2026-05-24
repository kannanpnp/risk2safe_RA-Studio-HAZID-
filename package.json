// ─────────────────────────────────────────────────────────────────────────────
// Risk2Safe RA Studio — Shared Data Constants
// EI 3580 (Energy Institute, Jan 2025) + ADNOC HSE-RM-ST01 v1 (Aug 2019)
// ─────────────────────────────────────────────────────────────────────────────

// ── ADNOC 6×6 RISK MATRIX ────────────────────────────────────────────────────

export const SEV = [
  { id: 6, label: "Disastrous",   short: "DIS", desc: "Multiple fatalities (>10) — workers and/or public" },
  { id: 5, label: "Catastrophic", short: "CAT", desc: "Multiple fatalities (up to 10) / permanent total disability" },
  { id: 4, label: "Major",        short: "MAJ", desc: "Single fatality or permanent total disability" },
  { id: 3, label: "Serious",      short: "SER", desc: "Serious injuries / reversible health effects / partial disability" },
  { id: 2, label: "Minor",        short: "MIN", desc: "Minor injuries or health effects — weeks to months recovery" },
  { id: 1, label: "Notable",      short: "NOT", desc: "Slight injuries or short-term health effects" },
];

export const LIK = [
  { id: "A", label: "Term",           freq: "10⁻⁶ ≤ f < 10⁻⁵ /yr", desc: "Has not occurred in 50+ years worldwide in the industry" },
  { id: "B", label: "Rare",           freq: "10⁻⁵ ≤ f < 10⁻⁴ /yr", desc: "Could happen in next 20–30 years worldwide" },
  { id: "C", label: "Unlikely",       freq: "10⁻⁴ ≤ f < 10⁻³ /yr", desc: "Could happen within 5–10 years / occurred in industry" },
  { id: "D", label: "Possible",       freq: "10⁻³ ≤ f < 10⁻² /yr", desc: "Could happen within the 5-year strategic planning period" },
  { id: "E", label: "Likely",         freq: "10⁻² ≤ f < 10⁻¹ /yr", desc: "Could happen in the next 1–2 year budget period" },
  { id: "F", label: "Almost Certain", freq: "10⁻¹ ≤ f < 1 /yr",    desc: "Could occur more than once during the next year" },
];

// Risk matrix lookup: key = severity+likelihood (e.g. "4D"), value = category (1–4)
export const MX = {
  "6A": 2, "6B": 1, "6C": 1, "6D": 1, "6E": 1, "6F": 1,
  "5A": 2, "5B": 2, "5C": 1, "5D": 1, "5E": 1, "5F": 1,
  "4A": 3, "4B": 2, "4C": 2, "4D": 1, "4E": 1, "4F": 1,
  "3A": 4, "3B": 3, "3C": 3, "3D": 2, "3E": 1, "3F": 1,
  "2A": 4, "2B": 4, "2C": 3, "2D": 3, "2E": 2, "2F": 2,
  "1A": 4, "1B": 4, "1C": 4, "1D": 4, "1E": 4, "1F": 3,
};

export const CAT = {
  1: { label: "CAT 1 – HIGH",     color: "#dc2626", bg: "rgba(220,38,38,0.15)",  border: "#dc2626", action: "STOP WORK. Reduce to ALARP immediately. Report to Director/GC CEO.",             sign: "Group CEO / Director"        },
  2: { label: "CAT 2 – HIGH-MED", color: "#ea580c", bg: "rgba(234,88,12,0.15)",  border: "#ea580c", action: "Reduce to ALARP. Quantify MFL & RCE. Include in Risk Register.",                 sign: "Business Manager / SVP"      },
  3: { label: "CAT 3 – MEDIUM",   color: "#d97706", bg: "rgba(217,119,6,0.15)",  border: "#d97706", action: "Monitor & improve control effectiveness. Include in Risk Register.",             sign: "Dept. Manager / VP"          },
  4: { label: "CAT 4 – LOW",      color: "#16a34a", bg: "rgba(22,163,74,0.15)",  border: "#16a34a", action: "Low risk. Monitor current controls. Accept when ALARP demonstrated.",           sign: "Line Manager"                },
};

export const getCat = (s, l) => (s && l) ? (MX[`${s}${l}`] || null) : null;

// ── EI 3580 ENERGY SOURCES (Annex A – Energy & Error Wheel) ─────────────────

export const ENERGIES = [
  { id: "gravity",     label: "Gravity",         color: "#6366f1", icon: "↓", ex: "Falling objects, collapsing roofs, trips & falls, structural collapse, uncontrolled load release" },
  { id: "motion",      label: "Motion",           color: "#8b5cf6", icon: "→", ex: "Vehicle movement, flowing water/steam, wind, manual handling, lifting, lowering, bending" },
  { id: "mechanical",  label: "Mechanical",       color: "#0ea5e9", icon: "⚙", ex: "Rotating equipment, conveyors, motors, pinch points, projectiles, high-speed parts" },
  { id: "electrical",  label: "Electrical",       color: "#eab308", icon: "⚡", ex: "Live conductors, arc flash, static charge, transformers, overhead power lines" },
  { id: "pressure",    label: "Pressure",         color: "#3b82f6", icon: "◉", ex: "Compressed gas/air, pressurised vessels, hoses, pipework, hydraulic systems, vacuum" },
  { id: "temperature", label: "Temperature",      color: "#ef4444", icon: "🌡", ex: "Open flame, hot/cold surfaces, liquids, steam, cryogenics, UV radiation, heat stress" },
  { id: "chemical",    label: "Chemical",         color: "#10b981", icon: "⬡", ex: "Toxic vapours, H₂S, acids, solvents, dust, asphyxiants, carcinogens, flammable gases" },
  { id: "biological",  label: "Biological",       color: "#84cc16", icon: "🦠", ex: "Bacteria, viruses, contaminated water/food, insects, animals, sharps, mould" },
  { id: "radiation",   label: "Radiation",        color: "#f97316", icon: "☢", ex: "Ionising radiation, welding arc, UV, X-rays, microwaves, lasers, NORM" },
  { id: "sound",       label: "Sound/Vibration",  color: "#ec4899", icon: "〜", ex: "High noise, HAV (hand-arm vibration), WBV, high-pressure relief venting, impulse noise" },
];

// ── EI 3580 ERROR-PRODUCING CONDITIONS (EPCs) ────────────────────────────────

export const EPC = {
  job: {
    color: "#818cf8",
    label: "Job Factors",
    items: [
      { id: "j1",  label: "Information Clarity",    desc: "Unclear signs, signals, labels, or instructions for the task" },
      { id: "j2",  label: "Equipment Interface",    desc: "Poor equipment design, labelling, alarms, or error tolerance/avoidance" },
      { id: "j3",  label: "Task Complexity",        desc: "Complex, multi-step, concurrent, or cognitively demanding task" },
      { id: "j4",  label: "Routine vs Unusual",     desc: "Complacency risk on overly familiar task, or unfamiliarity with unusual task" },
      { id: "j5",  label: "Divided Attention",      desc: "Requirement to perform simultaneous tasks, interruptions, or distractions" },
      { id: "j6",  label: "Inadequate Procedures",  desc: "Procedures absent, incomplete, unclear, outdated, or not followed" },
      { id: "j7",  label: "Preparation Gaps",       desc: "Permits, isolations, pre-task checks or authorisations not completed" },
      { id: "j8",  label: "Time Pressure",          desc: "Insufficient time allocated to perform the task safely" },
      { id: "j9",  label: "Unsuitable Tools",       desc: "Tools or equipment not fit-for-purpose for this specific task" },
      { id: "j10", label: "Communication Barriers", desc: "Language barriers, no radios, misheard or misunderstood information" },
      { id: "j11", label: "Work Environment",       desc: "Noise, heat/cold, poor lighting, confined space, poor ventilation" },
    ],
  },
  person: {
    color: "#34d399",
    label: "Person Factors",
    items: [
      { id: "p1", label: "Physical Capability",   desc: "Worker's physical fitness, size, strength, or medical condition limitations" },
      { id: "p2", label: "Fatigue",               desc: "Acute (shift fatigue) or chronic (long-term accumulated) worker fatigue" },
      { id: "p3", label: "Stress / Morale",       desc: "Personal stress, anxiety, interpersonal conflict, or poor team morale" },
      { id: "p4", label: "Workload Imbalance",    desc: "Work overload causing rushing, or boredom from under-stimulation" },
      { id: "p5", label: "Competence Gap",        desc: "Insufficient training, experience, or skill for this specific task" },
      { id: "p6", label: "Competing Priorities",  desc: "Peer pressure, production vs safety trade-off, or conflicting instructions" },
    ],
  },
  org: {
    color: "#c084fc",
    label: "Organisation Factors",
    items: [
      { id: "o1", label: "Production Pressure",  desc: "Pressure from management or schedule to complete quickly at expense of safety" },
      { id: "o2", label: "Supervision Quality",  desc: "Inadequate level, availability, or nature of supervision for this task" },
      { id: "o3", label: "Staffing Levels",      desc: "Insufficient number of competent personnel to safely execute the task" },
      { id: "o4", label: "Unclear Roles",        desc: "Workers unsure of responsibilities, limits of authority, or who is in charge" },
    ],
  },
};

// ── HIERARCHY OF CONTROLS ─────────────────────────────────────────────────────

export const HOC = [
  { id: "eliminate",   rank: 1, label: "Elimination",            color: "#1d4ed8", desc: "Physically remove the hazard or do not perform the task" },
  { id: "substitute",  rank: 2, label: "Substitution",           color: "#2563eb", desc: "Replace the hazard or automate task to remove human exposure" },
  { id: "engineering", rank: 3, label: "Engineering Control",    color: "#0369a1", desc: "Guard, interlock, isolate, LOTO, forced function, physical barrier" },
  { id: "admin",       rank: 4, label: "Administrative Control", color: "#6d28d9", desc: "PTW, procedure, training, supervision, task redesign, signage" },
  { id: "ppe",         rank: 5, label: "PPE",                    color: "#7c3aed", desc: "Personal protective equipment, first aid, emergency response readiness" },
];

// ── EI 3580 FRONTLINE TOOLS (Section 4) ──────────────────────────────────────

export const TOOLS = [
  {
    id: 1, phase: "Pre-job",
    label: "Identify Energy Sources & EPCs",
    desc: "Supervisor-led team exercise using the Energy & Error Wheel to identify hazards, EPCs, and risk controls. Takes 20–30 minutes. Best conducted at the worksite.",
    steps: [
      "Provide team with Energy & Error Wheel (or use the app)",
      "Walk through each energy source together — 'Does this energy apply to our task?'",
      "Walk through EPCs together — 'Are any of these conditions present?'",
      "Ask workers: Where, what, which phases, which steps are most critical?",
      "For each applicable energy → identify specific hazards → identify controls",
      "For each applicable EPC → discuss why it applies → identify controls",
    ],
  },
  {
    id: 2, phase: "Pre-job",
    label: "Last Minute Risk Assessment (LMRA)",
    desc: "Structured checklist of flag conditions assessed immediately before starting work. If any question is answered 'Yes', work must not begin until resolved.",
    steps: [
      "Is there anything about this task that makes me feel uneasy?",
      "Is there time or management pressure that could compromise safety?",
      "Do I have the correct tools and equipment for the task?",
      "Are there any hazards that are not adequately controlled?",
      "Are there any EPCs that need immediate attention?",
      "Do I have the correct instructions and permits?",
      "Has anything changed since the task was planned and the RA was done?",
    ],
  },
  {
    id: 3, phase: "During job",
    label: "15-Second Scan",
    desc: "Systematic visual scan of the immediate work area to identify hazards before interacting with equipment. Used by pilots, military, and high-reliability industries.",
    steps: [
      "Pause for 15 seconds before starting or resuming work",
      "Horizontal scan — left to right, then right to left",
      "Vertical scan — top down, then bottom up",
      "Close distance to far distance sweep",
      "Check gauges, readings, and equipment parameters",
      "Look around and behind equipment for hidden energy sources",
      "Predict movement — where will moving equipment go?",
    ],
  },
  {
    id: 4, phase: "During job",
    label: "Look, Point, Call Out",
    desc: "Human error prevention technique originating from Japan's railway industry. Physically pointing and calling out increases frontal lobe activity by 25% and reduces errors significantly.",
    steps: [
      "LOOK — Fix eyes on the object/equipment you are about to interact with",
      "POINT — Physically point at the object/equipment with finger or hand",
      "CALL OUT — Verbally state the name and/or reading aloud (e.g. 'Valve V-102, CLOSED')",
      "Examples: 'Pressure gauge, 85 PSI' / 'Isolation confirmed, locked out' / 'Tag number matches, correct'",
    ],
  },
  {
    id: 5, phase: "During job",
    label: "Self-Check",
    desc: "Deliberate pause during or after critical task steps to verify action suitability and catch own errors before consequences occur.",
    steps: [
      "Pause before executing a critical step",
      "Mentally rehearse the upcoming step",
      "Double-check measurements, part numbers, valve numbers, specifications",
      "Verify tools and instruments are correct and calibrated",
      "Do not ignore feelings of unease — stop and discuss with supervisor",
      "After measurement: look away, then look back to confirm the reading",
      "After all steps: verify each critical step was executed correctly",
    ],
  },
  {
    id: 6, phase: "During job",
    label: "Peer-Check",
    desc: "Two-person verification of critical actions before AND after execution. Highest-reliability error prevention for single critical actions.",
    steps: [
      "Both workers pause before executing a critical step",
      "Worker 1 talks through the intended action, points to equipment",
      "Worker 2 listens carefully and confirms the action is correct",
      "Worker 1 executes the agreed action",
      "Worker 2 observes and confirms the action was executed correctly",
      "After all steps: Worker 2 independently verifies critical steps",
    ],
  },
  {
    id: 7, phase: "During job",
    label: "Criteria for Stopping the Job",
    desc: "'Stop the Job' authority empowers every worker to halt work if they perceive a safety risk. No repercussions for stopping; immediate support required.",
    steps: [
      "Imminent hazard developing or becoming uncontrolled",
      "Equipment not operating as expected or as described in the procedure",
      "Sudden environmental change (weather deterioration, reduced visibility, gas release)",
      "Impossible to comply with the procedure as written — deviation required",
      "Risk is escalating and likely to worsen",
      "Insufficient resources (tools, personnel, time) to do the job safely",
      "Gut feeling that something is wrong — cannot explain it yet",
      "Near miss or unplanned event has occurred",
      "Worker is unwell, injured, or fatigued during the task",
      "Controls have failed or PPE is unavailable/unsuitable",
    ],
  },
  {
    id: 8, phase: "After job",
    label: "Independent Verification",
    desc: "Safety double-check by a person not involved in carrying out the original task. Used for critical systems, energy isolations, and reinstatement.",
    steps: [
      "Worker follows instructions, checks own work, and signs off",
      "Verifier independently visits the workplace",
      "Verifier examines the work without making changes or taking hints",
      "Verifier checks the work matches instructions and specifications",
      "If discrepancy found: alert supervisor — do not proceed",
      "If work is correct: verifier signs off",
    ],
  },
  {
    id: 9, phase: "After job",
    label: "Post-Job Brief Questions",
    desc: "Structured discussion immediately after task completion to capture lessons learned, close the learning loop, and improve future performance.",
    steps: [
      "Was there anything you wish you'd known before starting this task?",
      "Were there any surprises or unplanned events during the task?",
      "Which documents or instructions could we improve?",
      "What additional skills or competencies would be needed next time?",
      "Can you think of an error you or a colleague made — what can we learn?",
      "Did you improvise or work around anything? How do we prevent this?",
      "How could we improve our tools, equipment, or materials?",
      "How could we improve the planning and preparation for this task?",
    ],
  },
];

// ── UTILITIES ─────────────────────────────────────────────────────────────────

export const uid = () => Math.random().toString(36).slice(2, 9);

export const newStep = () => ({
  id: uid(),
  description: "",
  energies: [],
  hazards: [],
  epcs: [],
  iS: null,
  iL: null,
  controls: [],
  rS: null,
  rL: null,
  notes: "",
});

export const newRA = () => ({
  id: uid(),
  title: "",
  location: "",
  dept: "",
  date: new Date().toISOString().split("T")[0],
  permitNo: "",
  ra_no: "RA-" + Date.now().toString().slice(-6),
  assessor: "",
  approver: "",
  reviewer: "",
  status: "Draft",
  steps: [newStep()],
});

// ── SHARED COLOUR TOKENS ──────────────────────────────────────────────────────

export const COLORS = {
  bg:      "#0b1220",
  surface: "#111827",
  surface2:"#1e293b",
  border:  "#1e3a5f",
  fg:      "#e2e8f0",
  fgMuted: "#94a3b8",
  amber:   "#f59e0b",
  amberDim:"#92400e",
};
