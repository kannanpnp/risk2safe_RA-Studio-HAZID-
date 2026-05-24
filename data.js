// Risk2Safe Risk Assessment Studio — Manual Version
// EI 3580 (Energy Institute, Jan 2025) + ADNOC HSE-RM-ST01 v1 (Aug 2019)
// Fully standalone — no API keys, works offline after first load

import React, { useState, useCallback } from "react";
import {
  SEV, LIK, MX, CAT, getCat,
  ENERGIES, EPC, HOC, TOOLS,
  uid, newStep, newRA, COLORS as C,
} from "./data.js";

// ── BUILT-IN HAZARD LIBRARY (EI 3580 Annex A + industry practice) ─────────────

const HAZARD_LIBRARY = {
  gravity:    ["Person falls from elevated work platform / scaffold","Person falls from ladder during access/egress","Falling object strikes person working below","Structural collapse / failure of support","Unsecured load swings or drops during lifting","Person slips or trips on uneven / contaminated walkway","Overhead load falls during crane swing-over","Toppling of unstable equipment or materials"],
  motion:     ["Person struck by moving vehicle, forklift, or crane swing","Manual handling injury (MSD) from lifting, bending, twisting","Person caught between moving equipment and fixed structure","Dropped load during crane or forklift operation","High-pressure steam or fluid jet strikes person","Person thrown by unexpected sudden equipment movement","Struck by ejected parts during equipment operation"],
  mechanical: ["Contact with rotating shaft, pulley, gear, or belt","Entanglement of clothing, hair, or limb in rotating parts","Ejection of fragments or parts from failing machinery","Pinch point injury between moving and fixed components","Cut / laceration from sharp edges, blades, or burrs","Uncontrolled release of stored mechanical energy (spring, flywheel)","Abrasion from moving surfaces"],
  electrical: ["Electric shock from direct contact with live conductors","Arc flash / arc blast causing burns to face, hands, body","Fire from overloaded cables, short circuit, or poor connections","Static discharge igniting flammable atmosphere","Contact with overhead power lines (plant, crane, scaffold)","Electrocution from damaged or defective portable power tools","Secondary voltage shock from induced current"],
  pressure:   ["Explosion or rupture of pressurised vessel or pipeline","High-pressure fluid injection injury (skin penetration)","Hose whip from failed coupling under pressure","Sudden release of compressed gas or steam causing asphyxiation","Pressure surge / water hammer causing valve or fitting failure","Implosion of equipment under vacuum conditions","Flying debris from pressurised failure"],
  temperature:["Burns from contact with hot surfaces, pipework, or equipment","Scalds from steam leaks or hot liquid spills","Cold burns or frostbite from cryogenic substances","Heat stress, heat exhaustion, or heat stroke in hot environment","Fire from ignition of flammable materials by hot work","Cold stress or hypothermia in cold environment","Thermal expansion / contraction causing structural failure"],
  chemical:   ["Inhalation of toxic vapours, gases, or fumes (H₂S, VOC, CO)","Skin / eye contact with corrosive acids or alkalis","H₂S exposure causing rapid incapacitation or fatality","Fire / explosion from flammable or pyrophoric chemical release","Chemical splash to eyes or skin during transfer or sampling","Oxygen depletion in confined space from inerting gas","Chronic health effects from carcinogen / mutagen exposure","Sensitisation from repeated skin contact with chemical"],
  biological: ["Infection from contact with contaminated water, waste, or soil","Allergic reaction to biological agents or insect sting","Snake, scorpion, or animal bite during outdoor work","Legionella exposure from cooling towers or water systems","Exposure to blood-borne pathogens (sharps, first-aid work)","Mould / fungal exposure in confined or damp spaces"],
  radiation:  ["Ionising radiation overexposure (X-ray, gamma, alpha, beta)","Eye damage from laser beam or UV welding arc","Skin burns or long-term cancer risk from UV radiation","RF / microwave energy causing internal heating of tissue","NORM (naturally occurring radioactive material) exposure on equipment","Radiation scatter during radiography operations"],
  sound:      ["Noise-induced hearing loss (NIHL) from sustained high dB(A)","Hand-arm vibration syndrome (HAVS) from vibrating tools","Whole-body vibration (WBV) from heavy mobile equipment","Tinnitus from impulse noise — pressure relief, blasting, hammering","Warning signals or alarms masked by high ambient noise levels"],
};

// ── BUILT-IN CONTROL LIBRARY (hierarchy-aligned, EI 3580 + industry) ─────────

const CONTROL_LIBRARY = {
  eliminate:   ["Remove the energy source from the task entirely","Redesign the task to eliminate exposure to this hazard","Do not perform the task — assess risk vs benefit","Automate the task to remove human exposure to the hazard","Schedule work during low-risk conditions (daylight, low-traffic, off-peak)"],
  substitute:  ["Replace toxic chemical with safer lower-hazard alternative","Use battery-powered (lower voltage) tools instead of mains","Replace manual lifting with mechanical lifting aid or vacuum lifter","Use lower-pressure system or reduce operating pressure","Substitute hazardous solvent with water-based or non-flammable equivalent","Use robotics or remote handling for radiation / chemical work"],
  engineering: ["Install physical guarding / interlocked guard over rotating parts","Implement full LOTO (Lockout-Tagout / LLTM) procedure","Install LEV (local exhaust ventilation) to capture fumes at source","Use intrinsically safe (IS) / ATEX-rated equipment in hazardous area","Install physical barriers and exclusion zones","Fit calibrated pressure relief valve to vessel / system","Install non-return valve to prevent backflow / reverse flow","Earthing and bonding for static electricity control","Install forced mechanical ventilation in confined space","Fit fall-arrest anchor points, lifelines, and edge protection","Install fixed gas detectors with audible and visual alarms","Fit acoustic enclosure or sound-dampening panels","Anti-vibration mountings on equipment and tools"],
  admin:       ["Issue and control Permit to Work (PTW) / hot work permit","Develop or review task-specific safe work procedure (SWP)","Conduct task-based risk assessment (this document)","Conduct pre-job briefing and tool-box talk with all workers","Establish and enforce exclusion zones and barriers","Assign competent supervisor with specific responsibilities","Provide task-specific training and verify competency","Implement buddy system / two-person minimum rule for high-risk tasks","Conduct gas testing before and during confined space entry","Implement job rotation to limit duration of exposure","Schedule regular breaks to manage fatigue and heat exposure","Implement stop-the-job authority for all workers — no repercussions","Conduct Last Minute Risk Assessment (LMRA) before starting","Ensure emergency response plan and communication system in place","Confirm rescue / retrieval plan before confined space entry"],
  ppe:         ["Safety helmet (Class A/B/G as per hazard type)","Full-body fall-arrest harness, energy-absorbing lanyard and anchor","Chemical-resistant gloves (specify type — nitrile, neoprene, PVC)","Face shield and indirect-vent chemical splash goggles","Half-face or full-face respirator with appropriate cartridge","Self-contained breathing apparatus (SCBA) for IDLH atmospheres","Supplied-air (airline) breathing apparatus for extended work","Flame-resistant (FR) coveralls certified to EN 11612 or equivalent","Metatarsal safety boots with anti-static / ESD sole","Hearing protection — ear plugs (SNR ≥35 dB) or ear muffs","Anti-vibration gloves for HAV tool use","Radiation dosimeter and lead shielding as appropriate","Cooling vest or cooling towel for heat stress management","High-visibility vest / clothing for vehicle interaction zones","Emergency eyewash station positioned within 10 seconds of hazard"],
};

// ── EI 3580 QUALITY CHECKLIST (manual review replacing AI review) ─────────────

const QUALITY_CHECKLIST = [
  { id: "q1",  section: "Stage 1", label: "All task steps identified",           desc: "Each meaningful task step is described with how work is actually performed, not just as intended." },
  { id: "q2",  section: "Stage 1", label: "Workers consulted",                   desc: "Workers who carry out the task were involved in identifying steps, hazards, and EPCs." },
  { id: "q3",  section: "Stage 1", label: "Worksite walk-through conducted",     desc: "The assessment was reviewed or conducted at the actual worksite, not just at a desk." },
  { id: "q4",  section: "Stage 2", label: "Energy & Error Wheel used",           desc: "All 10 energy sources were systematically considered for each task step." },
  { id: "q5",  section: "Stage 2", label: "Hazards are specific",               desc: "Hazards describe what can happen (e.g. 'arc flash causing burns'), not just the energy source." },
  { id: "q6",  section: "Stage 2", label: "Hidden hazards considered",          desc: "Non-obvious hazards (e.g. NORM on equipment, stored energy in springs, latent pressure) were considered." },
  { id: "q7",  section: "Stage 3", label: "All EPC categories addressed",       desc: "Job, Person, and Organisation factors were all considered for each step." },
  { id: "q8",  section: "Stage 3", label: "EPCs linked to specific hazards",    desc: "Each EPC is considered in the context of how it could lead to the hazards identified." },
  { id: "q9",  section: "Stage 4", label: "HOC hierarchy applied",              desc: "Higher-order controls (Elimination, Substitution, Engineering) were explored before Admin and PPE." },
  { id: "q10", section: "Stage 4", label: "Each hazard has a control",          desc: "Every identified hazard has at least one control measure assigned to it." },
  { id: "q11", section: "Stage 4", label: "Each EPC has a control",             desc: "Every selected EPC has at least one control measure addressing it." },
  { id: "q12", section: "Stage 4", label: "Admin controls validated",           desc: "For each admin control: will it still be in place in 5 years? Would it stand scrutiny after a fatality?" },
  { id: "q13", section: "Stage 5", label: "Initial risk rated for all steps",   desc: "An initial severity and likelihood rating is recorded before controls for every step." },
  { id: "q14", section: "Stage 5", label: "Residual risk rated for all steps",  desc: "A residual rating after controls is recorded for every step." },
  { id: "q15", section: "Stage 5", label: "Risk reduced after controls",        desc: "Residual risk category is lower than initial for steps where controls have been applied." },
  { id: "q16", section: "Stage 6", label: "CAT 1/2 risks escalated",            desc: "Any HIGH or HIGH-MED risk has been escalated to the appropriate authority and sign-off obtained." },
  { id: "q17", section: "Stage 6", label: "Actions assigned to named persons",  desc: "Each outstanding action has a named responsible person and target completion date." },
  { id: "q18", section: "Stage 6", label: "Assessment stored in DMS",           desc: "The completed assessment is stored in the document management system / site files." },
];

// ── STYLES ────────────────────────────────────────────────────────────────────
// (Same palette as AI version; manual version has a distinct teal accent)

const TEAL = "#0d9488";

const S = {
  app:            { minHeight: "100vh", background: C.bg, color: C.fg, fontFamily: "'DM Sans','Segoe UI',system-ui,sans-serif" },
  header:         { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: 60, background: C.surface, borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100, gap: 16 },
  headerLeft:     { display: "flex", alignItems: "center", gap: 20 },
  logo:           { display: "flex", alignItems: "center", gap: 10 },
  logoShield:     { fontSize: 28, color: C.amber, lineHeight: 1 },
  logoName:       { fontSize: 18, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" },
  logoSub:        { fontSize: 10, color: C.fgMuted, letterSpacing: "0.5px", textTransform: "uppercase" },
  logoBadge:      { fontSize: 11, background: "rgba(13,148,136,0.15)", border: "1px solid rgba(13,148,136,0.4)", color: TEAL, padding: "2px 8px", borderRadius: 4, letterSpacing: "0.5px" },
  nav:            { display: "flex", gap: 4, flex: 1, justifyContent: "center" },
  navBtn:         { background: "transparent", border: "none", color: C.fgMuted, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  navBtnActive:   { background: "rgba(245,158,11,0.15)", color: C.amber, fontWeight: 600 },
  headerRight:    { display: "flex", alignItems: "center", gap: 8 },
  btnSave:        { background: "rgba(22,163,74,0.2)", color: "#4ade80", border: "1px solid rgba(22,163,74,0.4)", padding: "7px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  btnNew:         { background: C.amber, color: "#000", border: "none", padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 700 },
  btnTeal:        { background: TEAL, color: "#fff", border: "none", padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  btnLib:         { background: `rgba(13,148,136,0.15)`, color: TEAL, border: `1px solid rgba(13,148,136,0.4)`, padding: "7px 16px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  page:           { maxWidth: 1200, margin: "0 auto", padding: "32px 24px" },
  hero:           { background: "linear-gradient(135deg,#111827 0%,#1e2d40 50%,#0f2027 100%)", border: `1px solid ${C.border}`, borderRadius: 12, padding: "32px 36px", marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24 },
  heroTitle:      { fontSize: 28, fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.5px" },
  heroSub:        { color: C.fgMuted, fontSize: 14, margin: 0, lineHeight: 1.6 },
  heroCta:        { background: C.amber, color: "#000", border: "none", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 700, whiteSpace: "nowrap" },
  statsRow:       { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 },
  statCard:       { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: "20px 16px", textAlign: "center" },
  statIcon:       { fontSize: 24, marginBottom: 8 },
  statVal:        { fontSize: 32, fontWeight: 800, color: C.amber },
  statLabel:      { fontSize: 12, color: C.fgMuted, marginTop: 4 },
  sectionTitle:   { fontSize: 18, fontWeight: 700, color: "#fff", margin: "28px 0 16px", borderLeft: `3px solid ${C.amber}`, paddingLeft: 12 },
  stagesGrid:     { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 32 },
  stageCard:      { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, cursor: "pointer" },
  stageNum:       { fontSize: 11, fontWeight: 800, color: C.amberDim, letterSpacing: "1px", marginBottom: 8 },
  stageIcon:      { fontSize: 24, marginBottom: 8 },
  stageTitle:     { fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 6 },
  stageDesc:      { fontSize: 12, color: C.fgMuted, lineHeight: 1.6 },
  raList:         { display: "flex", flexDirection: "column", gap: 8 },
  raCard:         { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "16px 20px", cursor: "pointer" },
  raCardTop:      { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 },
  raTitle:        { fontSize: 15, fontWeight: 600, color: "#fff" },
  raMeta:         { fontSize: 12, color: C.fgMuted, marginTop: 3 },
  raCardRight:    { display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" },
  statusBadge:    { color: "#fff", padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600 },
  highBadge:      { background: "rgba(220,38,38,0.2)", color: "#f87171", padding: "2px 8px", borderRadius: 4, fontSize: 11 },
  raStats:        { display: "flex", gap: 16, fontSize: 12, color: C.fgMuted },
  toolsHeader:    { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  toolFilter:     { display: "flex", gap: 6 },
  filterBtn:      { background: "transparent", border: `1px solid ${C.border}`, color: C.fgMuted, padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontSize: 13 },
  filterBtnActive:{ background: "rgba(245,158,11,0.15)", borderColor: C.amber, color: C.amber, fontWeight: 600 },
  toolsGrid:      { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 },
  toolCard:       { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, display: "flex", flexDirection: "column", gap: 10 },
  toolBadge:      { color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 4, width: "fit-content" },
  toolTitle:      { fontSize: 14, fontWeight: 700, color: "#fff", margin: 0 },
  toolDesc:       { fontSize: 12, color: C.fgMuted, lineHeight: 1.6, margin: 0 },
  toolSteps:      { display: "flex", flexDirection: "column", gap: 6 },
  toolStep:       { display: "flex", gap: 8, alignItems: "flex-start", fontSize: 12 },
  toolStepNum:    { minWidth: 20, height: 20, background: "rgba(245,158,11,0.2)", color: C.amber, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0 },
  editorLayout:   { display: "flex", height: "calc(100vh - 60px)", overflow: "hidden" },
  sidebar:        { width: 270, background: C.surface, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden" },
  sidebarHeader:  { padding: 16, borderBottom: `1px solid ${C.border}` },
  sidebarTitle:   { fontSize: 13, fontWeight: 700, color: "#fff" },
  sidebarSub:     { fontSize: 11, color: C.fgMuted, marginTop: 2 },
  stepList:       { flex: 1, overflowY: "auto", padding: 8 },
  stepItem:       { display: "flex", alignItems: "flex-start", gap: 8, padding: 10, borderRadius: 7, cursor: "pointer", marginBottom: 4, border: "1px solid transparent" },
  stepItemActive: { background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.4)" },
  stepNum:        { fontSize: 10, fontWeight: 800, color: C.fgMuted, minWidth: 22, paddingTop: 2 },
  stepItemContent:{ flex: 1, minWidth: 0 },
  stepItemTitle:  { fontSize: 12, fontWeight: 500, color: C.fg, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  stepItemMeta:   { fontSize: 10, color: C.fgMuted, display: "flex", gap: 6, marginTop: 2, flexWrap: "wrap" },
  stepRisk:       { display: "flex", gap: 4, marginTop: 3 },
  stepDelete:     { background: "transparent", border: "none", color: C.fgMuted, cursor: "pointer", fontSize: 14, padding: "0 2px" },
  addStepBtn:     { margin: 8, padding: 10, background: "rgba(245,158,11,0.1)", border: "1px dashed rgba(245,158,11,0.4)", color: C.amber, borderRadius: 7, cursor: "pointer", fontSize: 13, fontWeight: 600 },
  checklistPanel: { margin: 8, padding: 12, background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.3)", borderRadius: 8, fontSize: 12, overflowY: "auto" },
  checklistTitle: { color: TEAL, fontWeight: 700, marginBottom: 6 },
  clScore:        { fontSize: 22, fontWeight: 800, marginBottom: 4 },
  clItem:         { display: "flex", gap: 8, padding: "4px 0", alignItems: "flex-start", borderBottom: "1px solid rgba(255,255,255,0.04)", paddingBottom: 4, marginBottom: 4 },
  clCheck:        { width: 16, height: 16, flexShrink: 0, marginTop: 2, cursor: "pointer", accentColor: TEAL },
  clLabel:        { fontSize: 11 },
  clDesc:         { fontSize: 10, color: C.fgMuted, marginTop: 2 },
  editorMain:     { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  tabBar:         { display: "flex", background: C.surface, borderBottom: `1px solid ${C.border}`, overflowX: "auto", flexShrink: 0 },
  tab:            { background: "transparent", border: "none", borderBottom: "2px solid transparent", color: C.fgMuted, padding: "14px 18px", cursor: "pointer", fontSize: 13, whiteSpace: "nowrap" },
  tabActive:      { color: C.amber, borderBottomColor: C.amber, fontWeight: 600 },
  tabContent:     { flex: 1, overflowY: "auto", padding: 24 },
  tabTitle:       { fontSize: 18, fontWeight: 700, color: "#fff", marginTop: 0, marginBottom: 6 },
  tabDesc:        { fontSize: 13, color: C.fgMuted, marginTop: 0, marginBottom: 20, lineHeight: 1.6 },
  formGrid:       { display: "flex", flexDirection: "column", gap: 16 },
  formRow2:       { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  formRow3:       { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 },
  formGroup:      { display: "flex", flexDirection: "column", gap: 6 },
  formLabel:      { fontSize: 12, fontWeight: 600, color: C.fgMuted },
  input:          { background: "#0f172a", border: `1px solid ${C.border}`, borderRadius: 6, padding: "9px 12px", color: C.fg, fontSize: 13, outline: "none", fontFamily: "inherit" },
  infoBox:        { background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#93c5fd", lineHeight: 1.6 },
  tealBox:        { background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#5eead4", lineHeight: 1.6 },
  wheelWrap:      { background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 20, marginBottom: 20 },
  wheelTitle:     { fontSize: 13, fontWeight: 600, color: C.fgMuted, marginBottom: 14 },
  energyGrid:     { display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 },
  energyChip:     { display: "flex", alignItems: "flex-start", gap: 8, padding: 10, borderRadius: 7, cursor: "pointer", border: `1px solid ${C.border}`, background: C.surface },
  energyChipSel:  { border: "1px solid" },
  energyName:     { fontSize: 12, fontWeight: 600, color: C.fg },
  energyEx:       { fontSize: 10, color: C.fgMuted, marginTop: 2, lineHeight: 1.4 },
  libBar:         { display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "10px 14px", background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.2)", borderRadius: 8 },
  tagBox:         { display: "flex", flexWrap: "wrap", gap: 6, padding: 8, background: "#0f172a", border: `1px solid ${C.border}`, borderRadius: 6, minHeight: 42 },
  tag:            { display: "flex", alignItems: "center", gap: 4, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", color: C.amber, borderRadius: 4, padding: "3px 8px", fontSize: 12 },
  tagDel:         { background: "transparent", border: "none", color: C.amber, cursor: "pointer", fontSize: 14, padding: "0 2px", lineHeight: 1 },
  tagInput:       { background: "transparent", border: "none", color: C.fg, fontSize: 13, outline: "none", flex: 1, minWidth: 160, fontFamily: "inherit" },
  epcSection:     { marginBottom: 20 },
  epcSectionHdr:  { display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: "3px solid", paddingLeft: 10, marginBottom: 10 },
  epcGrid:        { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 },
  epcChip:        { display: "flex", gap: 8, padding: 10, borderRadius: 7, cursor: "pointer", border: `1px solid ${C.border}`, background: C.surface },
  epcChipSel:     { border: "1px solid" },
  epcCbx:         { width: 16, height: 16, borderRadius: 3, border: `1px solid ${C.border}`, flexShrink: 0, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 },
  epcLabel:       { fontSize: 12, fontWeight: 600, color: C.fg },
  epcDesc:        { fontSize: 10, color: C.fgMuted, marginTop: 2, lineHeight: 1.4 },
  epcGuide:       { marginTop: 8, padding: "8px 12px", background: "rgba(13,148,136,0.08)", border: "1px solid rgba(13,148,136,0.15)", borderRadius: 6, fontSize: 11, color: "#5eead4", lineHeight: 1.5 },
  hocLegend:      { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 },
  hocPill:        { border: "1px solid", borderRadius: 6, padding: "4px 12px" },
  controlCard:    { background: C.surface, border: `1px solid ${C.border}`, borderLeft: "3px solid", borderRadius: 8, padding: 12, marginBottom: 8 },
  controlHdr:     { display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" },
  ctrlDel:        { background: "rgba(220,38,38,0.15)", border: "none", color: "#f87171", cursor: "pointer", padding: "4px 8px", borderRadius: 4, marginLeft: "auto" },
  addCtrlBtn:     { width: "100%", padding: 10, background: "transparent", border: `1px dashed ${C.border}`, color: C.fgMuted, borderRadius: 7, cursor: "pointer", fontSize: 13, marginTop: 8 },
  matrixWrap:     { display: "grid", gridTemplateColumns: "auto 300px", gap: 24, marginBottom: 24 },
  matrixGrid:     { display: "grid", gridTemplateColumns: "120px repeat(6,1fr)", gap: 2 },
  matrixCorner:   { background: C.surface2, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", padding: 4 },
  matrixHdrCell:  { background: C.surface2, borderRadius: 4, padding: "6px 2px", textAlign: "center" },
  matrixSevCell:  { background: C.surface2, borderRadius: 4, padding: "6px 8px", display: "flex", flexDirection: "column", justifyContent: "center" },
  matrixHdrSel:   { background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.4)" },
  matrixHdrLabel: { fontSize: 13, fontWeight: 700, color: C.amber },
  matrixHdrSub:   { fontSize: 10, color: C.fgMuted },
  matrixCell:     { borderRadius: 4, padding: "10px 4px", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 44, transition: "all 0.12s" },
  matrixResult:   { display: "flex", flexDirection: "column", gap: 12 },
  resultBadge:    { color: "#fff", fontWeight: 700, padding: "8px 16px", borderRadius: 8, textAlign: "center", fontSize: 15 },
  resultSev:      { fontSize: 13, color: C.fg, lineHeight: 1.6 },
  resultAction:   { border: "1px solid", borderRadius: 7, padding: "10px 14px", fontSize: 13, lineHeight: 1.6 },
  resultSign:     { background: C.surface2, borderRadius: 7, padding: "10px 14px", fontSize: 13 },
  resultEmpty:    { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 200, color: C.fgMuted, gap: 10, fontSize: 13 },
  reducPanel:     { background: "rgba(255,255,255,0.03)", border: `1px solid ${C.border}`, borderRadius: 7, padding: 12 },
  reducRow:       { display: "flex", alignItems: "center", gap: 12, fontSize: 18, fontWeight: 700 },
  legendGrid:     { display: "flex", flexDirection: "column", gap: 4, marginTop: 8 },
  legendItem:     { display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", border: "1px solid", borderRadius: 5 },
  defGrid:        { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  defSection:     { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 14 },
  defTitle:       { fontSize: 12, fontWeight: 700, color: C.fgMuted, marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" },
  defRow:         { display: "flex", gap: 8, padding: "5px 6px", alignItems: "flex-start" },
  modal:          { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 },
  modalBox:       { background: "#111827", border: `1px solid ${C.border}`, borderRadius: 12, width: "100%", maxWidth: 640, maxHeight: "80vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  modalHdr:       { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.border}` },
  modalTitle:     { fontSize: 15, fontWeight: 700, color: "#fff" },
  modalClose:     { background: "transparent", border: "none", color: C.fgMuted, cursor: "pointer", fontSize: 20, padding: "0 4px" },
  modalBody:      { overflowY: "auto", padding: 20 },
  libSection:     { marginBottom: 16 },
  libSectionTitle:{ fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" },
  libItem:        { display: "flex", alignItems: "center", gap: 10, padding: "7px 10px", borderRadius: 6, cursor: "pointer", border: "1px solid transparent" },
  libItemHov:     { background: "rgba(13,148,136,0.1)", border: "1px solid rgba(13,148,136,0.3)" },
  libItemText:    { fontSize: 13, color: C.fg },
  regHeader:      { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: "14px 16px", marginBottom: 16, fontSize: 13 },
  regSumBar:      { display: "flex", gap: 8, marginBottom: 20 },
  regSumItem:     { flex: 1, border: "1px solid", borderRadius: 8, padding: 14, textAlign: "center" },
  regStepCard:    { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 12, overflow: "hidden" },
  regStepHdr:     { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: C.surface2, borderBottom: `1px solid ${C.border}` },
  regStepNum:     { fontSize: 11, fontWeight: 800, color: C.fgMuted },
  regStepTitle:   { fontSize: 14, fontWeight: 600, color: "#fff", flex: 1 },
  regCatBadge:    { color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4 },
  regStepBody:    { padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 },
  regSecLabel:    { fontSize: 11, fontWeight: 700, color: C.fgMuted, textTransform: "uppercase" },
  regTag:         { border: "1px solid", borderRadius: 4, padding: "2px 8px", fontSize: 11, fontWeight: 600, display: "inline-flex" },
  regControl:     { display: "flex", alignItems: "center", gap: 8, padding: "6px 8px", background: "rgba(255,255,255,0.02)", borderRadius: 5 },
  regHocBadge:    { color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3, whiteSpace: "nowrap" },
  regRiskFlow:    { display: "flex", alignItems: "center", gap: 16, padding: "10px 12px", background: "rgba(255,255,255,0.03)", borderRadius: 7 },
  regRiskItem:    { display: "flex", flexDirection: "column", gap: 2 },
  regFooter:      { display: "flex", gap: 24, padding: 16, border: `1px solid ${C.border}`, borderRadius: 8, background: C.surface, marginTop: 8, fontSize: 13 },
};

const cellBg = (s, l) => { const c = getCat(s,l); return c===1?"#7f1d1d":c===2?"#7c2d12":c===3?"#78350f":c===4?"#14532d":"#1e293b"; };

// ── MAIN APP ──────────────────────────────────────────────────────────────────

export default function App() {
  const [view, setView]               = useState("dashboard");
  const [assessments, setAssessments] = useState([]);
  const [current, setCurrent]         = useState(null);
  const [activeStep, setActiveStep]   = useState(0);
  const [activeTab, setActiveTab]     = useState("info");
  const [toolFilter, setToolFilter]   = useState("All");
  const [checklist, setChecklist]     = useState({});
  const [showHazLib, setShowHazLib]   = useState(false);
  const [showCtrlLib, setShowCtrlLib] = useState(false);
  const [ctrlLibType, setCtrlLibType] = useState("admin");
  const [showChecklist, setShowChecklist] = useState(false);

  const createNew = () => { const ra = newRA(); setCurrent(ra); setActiveStep(0); setActiveTab("info"); setChecklist({}); setView("editor"); };
  const openRA = ra => { setCurrent({ ...ra }); setActiveStep(0); setActiveTab("info"); setView("editor"); };
  const saveRA = () => {
    if (!current) return;
    setAssessments(prev => { const i = prev.findIndex(a => a.id === current.id); if (i >= 0) { const n = [...prev]; n[i] = { ...current }; return n; } return [...prev, { ...current }]; });
    alert("Assessment saved ✓");
  };
  const updateRA   = useCallback((f, v) => setCurrent(c => ({ ...c, [f]: v })), []);
  const updateStep = useCallback((idx, f, v) => setCurrent(c => { const steps = [...c.steps]; steps[idx] = { ...steps[idx], [f]: v }; return { ...c, steps }; }), []);
  const addStep    = () => { setCurrent(c => ({ ...c, steps: [...c.steps, newStep()] })); setActiveStep(current ? current.steps.length : 0); };
  const removeStep = idx => { if (current.steps.length <= 1) return; setCurrent(c => ({ ...c, steps: c.steps.filter((_, i) => i !== idx) })); setActiveStep(s => Math.max(0, s - (s >= idx ? 1 : 0))); };
  const addControl = idx => updateStep(idx, "controls", [...(current.steps[idx].controls || []), { id: uid(), type: "admin", measure: "", addresses: "hazard", effectiveness: "Medium" }]);
  const removeCtrl = (si, ci) => updateStep(si, "controls", current.steps[si].controls.filter((_, i) => i !== ci));
  const updateCtrl = (si, ci, f, v) => { const ctrls = [...current.steps[si].controls]; ctrls[ci] = { ...ctrls[ci], [f]: v }; updateStep(si, "controls", ctrls); };

  const addHazardFromLib = (hazard) => {
    const step = current.steps[activeStep];
    if (!step.hazards.includes(hazard)) updateStep(activeStep, "hazards", [...step.hazards, hazard]);
  };
  const addControlFromLib = (measure) => {
    addControl(activeStep);
    const idx = current.steps[activeStep].controls.length;
    setTimeout(() => updateCtrl(activeStep, idx, "measure", measure), 0);
    setTimeout(() => updateCtrl(activeStep, idx, "type", ctrlLibType), 0);
  };

  const toggleCheck = id => setChecklist(p => ({ ...p, [id]: !p[id] }));
  const checkScore = Math.round((Object.values(checklist).filter(Boolean).length / QUALITY_CHECKLIST.length) * 100);

  const step = current?.steps?.[activeStep];
  const catStats = assessments.reduce((acc, ra) => { ra.steps.forEach(s => { const c = getCat(s.rS, s.rL); if (c) acc[c] = (acc[c] || 0) + 1; }); return acc; }, {});

  return (
    <div style={S.app}>
      {/* HEADER */}
      <header style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.logo}>
            <span style={S.logoShield}>⬡</span>
            <div><div style={S.logoName}>Risk2Safe</div><div style={S.logoSub}>Risk Assessment Studio</div></div>
          </div>
          <span style={S.logoBadge}>📋 Manual Version · Offline Ready</span>
        </div>
        <nav style={S.nav}>
          {[["dashboard","🏠 Dashboard"],["tools","🔧 Frontline Tools"]].map(([v,l]) => (
            <button key={v} onClick={() => setView(v)} style={{ ...S.navBtn, ...(view===v?S.navBtnActive:{}) }}>{l}</button>
          ))}
          {current && <button onClick={() => setView("editor")} style={{ ...S.navBtn, ...(view==="editor"?S.navBtnActive:{}) }}>📋 Assessment</button>}
        </nav>
        <div style={S.headerRight}>
          {view === "editor" && current && (
            <>
              <button onClick={() => setShowChecklist(s => !s)} style={S.btnLib}>☑ Quality Checklist {checkScore > 0 ? `(${checkScore}%)` : ""}</button>
              <button onClick={saveRA} style={S.btnSave}>💾 Save</button>
            </>
          )}
          <button onClick={createNew} style={S.btnNew}>＋ New Assessment</button>
        </div>
      </header>

      {/* DASHBOARD */}
      {view === "dashboard" && (
        <div style={S.page}>
          <div style={S.hero}>
            <div><h1 style={S.heroTitle}>Task-Based Risk Assessment</h1><p style={S.heroSub}>Manual version · Built-in hazard & control libraries · Fully standalone · No API key required · EI 3580 compliant</p></div>
            <button onClick={createNew} style={S.heroCta}>Begin New Assessment →</button>
          </div>
          <div style={S.statsRow}>
            {[["📋","Total Assessments",assessments.length],["📝","Total Steps",assessments.reduce((a,r)=>a+r.steps.length,0)],["🔴","HIGH Risk Steps",(catStats[1]||0)+(catStats[2]||0)],["👷","Assessors",new Set(assessments.map(r=>r.assessor).filter(Boolean)).size]].map(([icon,label,val]) => (
              <div key={label} style={S.statCard}><div style={S.statIcon}>{icon}</div><div style={S.statVal}>{val}</div><div style={S.statLabel}>{label}</div></div>
            ))}
          </div>
          <h2 style={S.sectionTitle}>EI 3580 Six-Stage Methodology</h2>
          <div style={S.stagesGrid}>
            {[["01","📋","Identify Task Steps","Review procedures, talk to workers, conduct walk-through. Describe how work is actually done."],["02","⚡","Identify Hazards","Use Energy & Error Wheel + built-in hazard library (60+ hazards) for each energy source."],["03","🧠","Identify EPCs","Select from 21 EPCs with contextual guidance prompts across Job, Person, and Organisation factors."],["04","🛡","Control Hazards & EPCs","Browse built-in control library (40+ controls) aligned to hierarchy of controls."],["05","📄","Record Findings","Document all steps, hazards, EPCs, controls and risk ratings."],["06","🔄","Review Controls","Use manual quality checklist (18 criteria) to self-assess completeness."]].map(([n,icon,title,desc]) => (
              <div key={n} style={S.stageCard} onClick={createNew}><div style={S.stageNum}>{n}</div><div style={S.stageIcon}>{icon}</div><div style={S.stageTitle}>{title}</div><div style={S.stageDesc}>{desc}</div></div>
            ))}
          </div>
          {assessments.length > 0 && (
            <>
              <h2 style={S.sectionTitle}>Recent Assessments</h2>
              <div style={S.raList}>
                {assessments.map(ra => {
                  const hi = ra.steps.filter(s => { const c = getCat(s.rS, s.rL); return c===1||c===2; }).length;
                  return (
                    <div key={ra.id} style={S.raCard} onClick={() => openRA(ra)}>
                      <div style={S.raCardTop}><div><div style={S.raTitle}>{ra.title||"Untitled"}</div><div style={S.raMeta}>{ra.location}{ra.dept?" · "+ra.dept:""} · {ra.date}</div></div><div style={S.raCardRight}><span style={{ ...S.statusBadge, background: ra.status==="Complete"?"#16a34a":"#d97706" }}>{ra.status}</span>{hi>0&&<span style={S.highBadge}>⚠ {hi} HIGH</span>}</div></div>
                      <div style={S.raStats}><span>📝 {ra.steps.length} steps</span><span>🔢 {ra.ra_no}</span><span>👷 {ra.assessor||"No assessor"}</span></div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* FRONTLINE TOOLS */}
      {view === "tools" && (
        <div style={S.page}>
          <div style={S.toolsHeader}><div><h1 style={S.heroTitle}>Frontline Risk Assessment Tools</h1><p style={S.heroSub}>EI 3580 Section 4 — Tools for use before, during, and after task execution</p></div><div style={S.toolFilter}>{["All","Pre-job","During job","After job"].map(f=><button key={f} onClick={()=>setToolFilter(f)} style={{ ...S.filterBtn, ...(toolFilter===f?S.filterBtnActive:{}) }}>{f==="Pre-job"?"🔵 ":f==="During job"?"🟡 ":f==="After job"?"🟢 ":""}{f}</button>)}</div></div>
          <div style={S.toolsGrid}>{TOOLS.filter(t=>toolFilter==="All"||t.phase===toolFilter).map(tool=>{const pc=tool.phase==="Pre-job"?"#3b82f6":tool.phase==="During job"?"#d97706":"#16a34a";return(<div key={tool.id} style={S.toolCard}><div style={{ ...S.toolBadge, background:pc }}>Tool {tool.id} · {tool.phase}</div><h3 style={S.toolTitle}>{tool.label}</h3><p style={S.toolDesc}>{tool.desc}</p><div style={S.toolSteps}>{tool.steps.map((s,i)=><div key={i} style={S.toolStep}><span style={S.toolStepNum}>{i+1}</span><span>{s}</span></div>)}</div></div>);})}</div>
        </div>
      )}

      {/* EDITOR */}
      {view === "editor" && current && (
        <div style={S.editorLayout}>
          <aside style={S.sidebar}>
            <div style={S.sidebarHeader}><div style={S.sidebarTitle}>Assessment Steps</div><div style={S.sidebarSub}>EI 3580 Stage 1</div></div>
            <div style={S.stepList}>
              {current.steps.map((s, i) => {
                const iC = getCat(s.iS,s.iL), rC = getCat(s.rS,s.rL);
                return (
                  <div key={s.id} onClick={()=>{setActiveStep(i);setActiveTab("energies");}} style={{ ...S.stepItem, ...(activeStep===i?S.stepItemActive:{}) }}>
                    <div style={S.stepNum}>{String(i+1).padStart(2,"0")}</div>
                    <div style={S.stepItemContent}>
                      <div style={S.stepItemTitle}>{s.description||"Step "+(i+1)}</div>
                      <div style={S.stepItemMeta}>{s.energies.length>0&&<span>{s.energies.length} energy</span>}{s.hazards.length>0&&<span>{s.hazards.length} hazard</span>}{s.controls.length>0&&<span>{s.controls.length} ctrl</span>}</div>
                      {(iC||rC)&&<div style={S.stepRisk}>{iC&&<span style={{ color:CAT[iC].color,fontSize:10 }}>{s.iS}{s.iL}→</span>}{rC&&<span style={{ color:CAT[rC].color,fontWeight:700,fontSize:10 }}>{s.rS}{s.rL}</span>}</div>}
                    </div>
                    <button onClick={e=>{e.stopPropagation();removeStep(i);}} style={S.stepDelete}>×</button>
                  </div>
                );
              })}
            </div>
            <button onClick={addStep} style={S.addStepBtn}>＋ Add Step</button>
            {showChecklist && (
              <div style={S.checklistPanel}>
                <div style={S.checklistTitle}>☑ Quality Checklist (EI 3580)</div>
                <div style={{ ...S.clScore, color: checkScore>=80?"#16a34a":checkScore>=60?"#d97706":"#dc2626" }}>{checkScore}% Complete</div>
                {QUALITY_CHECKLIST.map(item => (
                  <div key={item.id} style={S.clItem}>
                    <input type="checkbox" checked={!!checklist[item.id]} onChange={()=>toggleCheck(item.id)} style={S.clCheck} />
                    <div><div style={S.clLabel}>{item.label}</div><div style={S.clDesc}>{item.desc}</div></div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          <main style={S.editorMain}>
            <div style={S.tabBar}>
              {[["info","Task Info"],["energies","Energies & Hazards"],["epcs","Error Conditions"],["initial","Initial Risk"],["controls","Controls"],["residual","Residual Risk"],["register","Risk Register"]].map(([id,label]) => (
                <button key={id} onClick={()=>setActiveTab(id)} style={{ ...S.tab, ...(activeTab===id?S.tabActive:{}) }}>{label}</button>
              ))}
            </div>
            <div style={S.tabContent}>
              {activeTab === "info" && (
                <div style={S.formGrid}>
                  <h2 style={S.tabTitle}>📋 Task & Assessment Information</h2>
                  <div style={S.formRow2}>{[["RA Number","ra_no"],["Permit No","permitNo"]].map(([l,f])=><div key={f} style={S.formGroup}><label style={S.formLabel}>{l}</label><input value={current[f]||""} onChange={e=>updateRA(f,e.target.value)} style={S.input} /></div>)}</div>
                  <div style={S.formGroup}><label style={S.formLabel}>Task / Work Description *</label><input value={current.title||""} onChange={e=>updateRA("title",e.target.value)} style={S.input} placeholder="e.g. Hot work on crude oil piping at Tank Farm 3" /></div>
                  <div style={S.formRow2}>{[["Location / Area","location"],["Department","dept"]].map(([l,f])=><div key={f} style={S.formGroup}><label style={S.formLabel}>{l}</label><input value={current[f]||""} onChange={e=>updateRA(f,e.target.value)} style={S.input} /></div>)}</div>
                  <div style={S.formRow3}>{[["Date","date","date"],["Assessor","assessor","text"],["Approver","approver","text"]].map(([l,f,t])=><div key={f} style={S.formGroup}><label style={S.formLabel}>{l}</label><input type={t} value={current[f]||""} onChange={e=>updateRA(f,e.target.value)} style={S.input} /></div>)}</div>
                  <div style={S.formRow2}><div style={S.formGroup}><label style={S.formLabel}>Reviewer</label><input value={current.reviewer||""} onChange={e=>updateRA("reviewer",e.target.value)} style={S.input} /></div><div style={S.formGroup}><label style={S.formLabel}>Status</label><select value={current.status} onChange={e=>updateRA("status",e.target.value)} style={S.input}>{["Draft","In Review","Approved","Complete","Archived"].map(s=><option key={s}>{s}</option>)}</select></div></div>
                  <div style={S.infoBox}><strong>Stage 1:</strong> Use the sidebar to add task steps. Describe exactly how work is performed — as it actually happens, not just as procedures intend.</div>
                  <div style={S.formGroup}><label style={S.formLabel}>Step {activeStep+1} Description *</label><textarea value={step?.description||""} onChange={e=>updateStep(activeStep,"description",e.target.value)} style={{ ...S.input, height:80, resize:"vertical" }} placeholder="Describe exactly what the worker does in this step…" /></div>
                </div>
              )}

              {activeTab === "energies" && step && (
                <div>
                  <h2 style={S.tabTitle}>⚡ Stage 2 — Energy Sources & Hazards</h2>
                  <p style={S.tabDesc}>Select applicable energy sources, then browse the built-in hazard library or type your own hazards.</p>
                  <div style={S.wheelWrap}>
                    <div style={S.wheelTitle}>Energy & Error Wheel — Select Applicable Sources</div>
                    <div style={S.energyGrid}>
                      {ENERGIES.map(en => {
                        const sel = step.energies.includes(en.id);
                        return (
                          <div key={en.id} onClick={()=>updateStep(activeStep,"energies",sel?step.energies.filter(e=>e!==en.id):[...step.energies,en.id])} style={{ ...S.energyChip, ...(sel?{ ...S.energyChipSel, borderColor:en.color, background:en.color+"22" }:{}) }}>
                            <span style={{ fontSize:18 }}>{en.icon}</span>
                            <div><div style={{ ...S.energyName, ...(sel?{ color:en.color }:{}) }}>{en.label}</div><div style={S.energyEx}>{en.ex}</div></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div style={S.libBar}>
                    <span style={{ color:TEAL, fontSize:13, fontWeight:600 }}>📚 Hazard Library</span>
                    <span style={{ color:C.fgMuted, fontSize:12 }}>60+ industry-standard hazards, grouped by energy source</span>
                    <button onClick={()=>setShowHazLib(true)} style={{ ...S.btnLib, marginLeft:"auto" }}>Browse Library →</button>
                  </div>
                  <div style={S.formGroup}>
                    <label style={S.formLabel}>Hazards Identified</label>
                    <div style={S.tagBox}>
                      {step.hazards.map((h,i)=><div key={i} style={S.tag}><span>{h}</span><button onClick={()=>updateStep(activeStep,"hazards",step.hazards.filter((_,j)=>j!==i))} style={S.tagDel}>×</button></div>)}
                      <input placeholder="Type hazard and press Enter…" style={S.tagInput} onKeyDown={e=>{if(e.key==="Enter"&&e.target.value.trim()){updateStep(activeStep,"hazards",[...step.hazards,e.target.value.trim()]);e.target.value="";}}} />
                    </div>
                  </div>
                  <div style={S.infoBox}><strong>EI 3580 §3.2:</strong> Describe what the hazard does, not just the energy. Example: Energy → Electrical → Hazard: Arc flash causing burns to face and hands.</div>
                </div>
              )}

              {activeTab === "epcs" && step && (
                <div>
                  <h2 style={S.tabTitle}>🧠 Stage 3 — Error-Producing Conditions</h2>
                  <p style={S.tabDesc}>Identify circumstances that make errors more likely. Guidance prompts are shown for each condition to aid identification.</p>
                  {Object.entries(EPC).map(([cat,{color,label,items}]) => (
                    <div key={cat} style={S.epcSection}>
                      <div style={{ ...S.epcSectionHdr, borderColor:color }}><span style={{ color, fontWeight:700 }}>{label}</span><span style={{ color:C.fgMuted, fontSize:12 }}>{items.filter(i=>step.epcs.includes(i.id)).length} selected</span></div>
                      <div style={S.epcGrid}>
                        {items.map(item => {
                          const sel = step.epcs.includes(item.id);
                          return (
                            <div key={item.id} onClick={()=>updateStep(activeStep,"epcs",sel?step.epcs.filter(e=>e!==item.id):[...step.epcs,item.id])} style={{ ...S.epcChip, ...(sel?{ ...S.epcChipSel, borderColor:color, background:color+"18" }:{}) }}>
                              <div style={{ ...S.epcCbx, ...(sel?{ background:color+"30" }:{}) }}>{sel&&<span style={{ color }}>✓</span>}</div>
                              <div>
                                <div style={{ ...S.epcLabel, ...(sel?{ color }:{}) }}>{item.label}</div>
                                <div style={S.epcDesc}>{item.desc}</div>
                                {sel && <div style={S.epcGuide}>Ask: "What controls address this EPC?" → Procedure? Training? Supervision? Fewer simultaneous tasks?</div>}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <div style={S.tealBox}><strong>Guidance (EI 3580 §3.3):</strong> Ask workers: "What makes this step difficult?", "What mistakes have happened before?", "What would you tell a new person to watch out for?"</div>
                </div>
              )}

              {activeTab === "initial" && step && <MatrixTab title="Stage 2/3 — Initial Risk Rating" desc="Rate the inherent risk BEFORE any controls are applied. Consider the worst credible outcome." sKey="iS" lKey="iL" step={step} stepIdx={activeStep} updateStep={updateStep} S={S} />}

              {activeTab === "controls" && step && (
                <div>
                  <h2 style={S.tabTitle}>🛡 Stage 4 — Risk Controls</h2>
                  <p style={S.tabDesc}>Apply hierarchy of controls to both hazards AND error-producing conditions. Use the library for 40+ pre-written control measures.</p>
                  <div style={S.hocLegend}>{HOC.map(h=><div key={h.id} style={{ ...S.hocPill, background:h.color+"22", borderColor:h.color }}><span style={{ color:h.color, fontWeight:700, fontSize:11 }}>{h.rank}. {h.label}</span><span style={{ color:C.fgMuted, fontSize:10, marginLeft:6 }}>{h.desc}</span></div>)}</div>
                  <div style={S.libBar}>
                    <span style={{ color:TEAL, fontSize:13, fontWeight:600 }}>📚 Control Library</span>
                    <span style={{ color:C.fgMuted, fontSize:12 }}>40+ industry-standard controls across all HOC levels</span>
                    <select value={ctrlLibType} onChange={e=>setCtrlLibType(e.target.value)} style={{ ...S.input, width:180, fontSize:12 }}>{HOC.map(h=><option key={h.id} value={h.id}>{h.rank}. {h.label}</option>)}</select>
                    <button onClick={()=>setShowCtrlLib(true)} style={S.btnLib}>Browse Library →</button>
                  </div>
                  {step.controls.map((ctrl,ci)=>{const h=HOC.find(h=>h.id===ctrl.type)||HOC[3];return(<div key={ctrl.id} style={{ ...S.controlCard, borderLeftColor:h.color }}><div style={S.controlHdr}><select value={ctrl.type} onChange={e=>updateCtrl(activeStep,ci,"type",e.target.value)} style={{ ...S.input, width:180, fontSize:12 }}>{HOC.map(h=><option key={h.id} value={h.id}>{h.rank}. {h.label}</option>)}</select><select value={ctrl.addresses||"hazard"} onChange={e=>updateCtrl(activeStep,ci,"addresses",e.target.value)} style={{ ...S.input, width:130, fontSize:12 }}><option value="hazard">→ Hazard</option><option value="epc">→ EPC</option><option value="both">→ Both</option></select><select value={ctrl.effectiveness||"Medium"} onChange={e=>updateCtrl(activeStep,ci,"effectiveness",e.target.value)} style={{ ...S.input, width:110, fontSize:12 }}>{["High","Medium","Low"].map(e=><option key={e}>{e}</option>)}</select><button onClick={()=>removeCtrl(activeStep,ci)} style={S.ctrlDel}>×</button></div><textarea value={ctrl.measure||""} onChange={e=>updateCtrl(activeStep,ci,"measure",e.target.value)} placeholder="Describe the specific control measure, responsible person, and implementation…" style={{ ...S.input, height:60, resize:"vertical", marginTop:8, width:"100%", boxSizing:"border-box" }} /></div>);})}
                  <button onClick={()=>addControl(activeStep)} style={S.addCtrlBtn}>＋ Add Control Measure</button>
                  <div style={{ ...S.tealBox, marginTop:12 }}><strong>EI 3580 §3.4:</strong> For each administrative control, ask: (1) Will this still be in place in 5 years? (2) Would this control withstand scrutiny after a serious incident?</div>
                </div>
              )}

              {activeTab === "residual" && step && <MatrixTab title="Stage 4/5 — Residual Risk Rating" desc="Rate the risk AFTER all controls are implemented. Target ALARP. Residual must be lower than initial." sKey="rS" lKey="rL" step={step} stepIdx={activeStep} updateStep={updateStep} showReduction S={S} />}
              {activeTab === "register" && <RegisterTab ra={current} S={S} />}
            </div>
          </main>
        </div>
      )}

      {/* HAZARD LIBRARY MODAL */}
      {showHazLib && current && (
        <div style={S.modal} onClick={e=>{ if(e.target===e.currentTarget) setShowHazLib(false); }}>
          <div style={S.modalBox}>
            <div style={S.modalHdr}><div style={S.modalTitle}>📚 Hazard Library — Click to Add</div><button onClick={()=>setShowHazLib(false)} style={S.modalClose}>×</button></div>
            <div style={S.modalBody}>
              {ENERGIES.map(en => {
                const hazards = HAZARD_LIBRARY[en.id] || [];
                const isActive = current.steps[activeStep].energies.includes(en.id);
                return (
                  <div key={en.id} style={{ ...S.libSection, opacity: isActive ? 1 : 0.5 }}>
                    <div style={{ ...S.libSectionTitle, color: en.color }}>{en.icon} {en.label}{!isActive && " (not selected for this step)"}</div>
                    {hazards.map((h, i) => {
                      const added = current.steps[activeStep].hazards.includes(h);
                      return (
                        <div key={i} onClick={()=>addHazardFromLib(h)} style={{ ...S.libItem, ...(added?{ background:"rgba(245,158,11,0.1)", border:"1px solid rgba(245,158,11,0.3)" }:{}) }}>
                          <span style={{ fontSize:16 }}>{added ? "✓" : "+"}</span>
                          <span style={{ ...S.libItemText, ...(added?{ color:C.amber }:{}) }}>{h}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CONTROL LIBRARY MODAL */}
      {showCtrlLib && current && (
        <div style={S.modal} onClick={e=>{ if(e.target===e.currentTarget) setShowCtrlLib(false); }}>
          <div style={S.modalBox}>
            <div style={S.modalHdr}><div style={S.modalTitle}>📚 Control Library — Click to Add</div><button onClick={()=>setShowCtrlLib(false)} style={S.modalClose}>×</button></div>
            <div style={S.modalBody}>
              {HOC.map(h => (
                <div key={h.id} style={S.libSection}>
                  <div style={{ ...S.libSectionTitle, color: h.color }}>{h.rank}. {h.label} <span style={{ color:C.fgMuted, fontWeight:400, textTransform:"none" }}>— {h.desc}</span></div>
                  {(CONTROL_LIBRARY[h.id]||[]).map((measure,i) => (
                    <div key={i} onClick={()=>{ const idx=current.steps[activeStep].controls.length; addControl(activeStep); setTimeout(()=>{ updateCtrl(activeStep,idx,"measure",measure); updateCtrl(activeStep,idx,"type",h.id); },0); setShowCtrlLib(false); }} style={S.libItem}>
                      <span style={{ fontSize:14 }}>＋</span>
                      <span style={S.libItemText}>{measure}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SHARED SUB-COMPONENTS ─────────────────────────────────────────────────────

function MatrixTab({ title, desc, sKey, lKey, step, stepIdx, updateStep, showReduction, S }) {
  const selS = step[sKey], selL = step[lKey];
  const cat = getCat(selS, selL);
  return (
    <div>
      <h2 style={S.tabTitle}>{title}</h2>
      <p style={S.tabDesc}>{desc}</p>
      <div style={S.matrixWrap}>
        <div style={S.matrixGrid}>
          <div style={S.matrixCorner}><span style={{ fontSize:10,color:C.fgMuted }}>SEV↓/LIK→</span></div>
          {LIK.map(l=><div key={l.id} style={{ ...S.matrixHdrCell, ...(selL===l.id?S.matrixHdrSel:{}) }}><div style={S.matrixHdrLabel}>{l.id}</div><div style={S.matrixHdrSub}>{l.label}</div></div>)}
          {SEV.map(sv => (
            <React.Fragment key={sv.id}>
              <div style={{ ...S.matrixSevCell, ...(selS===sv.id?S.matrixHdrSel:{}) }}><div style={S.matrixHdrLabel}>{sv.id}</div><div style={S.matrixHdrSub}>{sv.label}</div></div>
              {LIK.map(l => {
                const isSel = selS===sv.id && selL===l.id;
                const c = getCat(sv.id,l.id);
                return (
                  <div key={sv.id+l.id} onClick={()=>{updateStep(stepIdx,sKey,sv.id);updateStep(stepIdx,lKey,l.id);}}
                    style={{ ...S.matrixCell, background:isSel?(cat?CAT[cat].color:"#f59e0b"):cellBg(sv.id,l.id), transform:isSel?"scale(1.15)":"scale(1)", zIndex:isSel?10:1, boxShadow:isSel?"0 0 0 3px #f59e0b,0 4px 12px rgba(0,0,0,0.5)":"none" }}>
                    <div style={{ fontSize:11, fontWeight:isSel?700:500, color:"#fff" }}>{sv.id}{l.id}</div>
                    {c&&<div style={{ fontSize:9, color:"rgba(255,255,255,0.8)" }}>{["","H","HM","M","L"][c]}</div>}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div style={S.matrixResult}>
          {cat ? (
            <>
              <div style={{ ...S.resultBadge, background:CAT[cat].color }}>{selS}{selL} — {CAT[cat].label}</div>
              <div style={S.resultSev}><strong>Severity {selS}:</strong> {SEV.find(s=>s.id===selS)?.desc}</div>
              <div style={S.resultSev}><strong>Likelihood {selL}:</strong> {LIK.find(l=>l.id===selL)?.desc}</div>
              <div style={{ ...S.resultAction, borderColor:CAT[cat].color }}><div style={{ color:CAT[cat].color,fontWeight:700,marginBottom:4 }}>Required Action</div>{CAT[cat].action}</div>
              <div style={S.resultSign}><div style={{ fontSize:11,color:C.fgMuted }}>Sign-off Authority</div><div style={{ fontWeight:600 }}>{CAT[cat].sign}</div></div>
              {showReduction && step.iS && step.iL && (
                <div style={S.reducPanel}>
                  <div style={{ fontSize:12,color:C.fgMuted,marginBottom:6 }}>Risk Reduction</div>
                  <div style={S.reducRow}><span style={{ color:CAT[getCat(step.iS,step.iL)||4].color,fontWeight:700 }}>{step.iS}{step.iL}</span><span style={{ fontSize:18 }}>→</span><span style={{ color:CAT[cat].color,fontWeight:700 }}>{selS}{selL}</span></div>
                  {getCat(step.iS,step.iL)<cat?<div style={{ color:"#16a34a",fontSize:12,marginTop:4 }}>✓ Risk successfully reduced</div>:<div style={{ color:"#dc2626",fontSize:12,marginTop:4 }}>⚠ Controls have not reduced risk category</div>}
                </div>
              )}
            </>
          ) : <div style={S.resultEmpty}><div style={{ fontSize:32 }}>☐</div><div>Click a cell to select risk rating</div></div>}
          <div style={S.legendGrid}>{Object.entries(CAT).map(([c,{label,color}])=><div key={c} style={{ ...S.legendItem, borderColor:color }}><div style={{ width:10,height:10,background:color,borderRadius:2 }}></div><span style={{ fontSize:11,color }}>{label}</span></div>)}</div>
        </div>
      </div>
      <div style={S.defGrid}>
        <div style={S.defSection}><div style={S.defTitle}>Severity Definitions</div>{SEV.map(s=><div key={s.id} style={{ ...S.defRow, ...(selS===s.id?{background:"rgba(245,158,11,0.1)",borderRadius:6}:{}) }}><span style={{ width:20,fontWeight:700,color:C.amber }}>{s.id}</span><span style={{ width:90,fontWeight:600 }}>{s.label}</span><span style={{ color:C.fgMuted,fontSize:12 }}>{s.desc}</span></div>)}</div>
        <div style={S.defSection}><div style={S.defTitle}>Likelihood Definitions</div>{LIK.map(l=><div key={l.id} style={{ ...S.defRow, ...(selL===l.id?{background:"rgba(245,158,11,0.1)",borderRadius:6}:{}) }}><span style={{ width:20,fontWeight:700,color:C.amber }}>{l.id}</span><span style={{ width:115,fontWeight:600 }}>{l.label}</span><span style={{ color:C.fgMuted,fontSize:12 }}>{l.desc}</span></div>)}</div>
      </div>
    </div>
  );
}

function RegisterTab({ ra, S }) {
  const allEpcItems = Object.values(EPC).flatMap(c => c.items);
  return (
    <div>
      <h2 style={S.tabTitle}>📄 Stage 5 — Risk Register Summary</h2>
      <div style={S.regHeader}><div><strong>Task:</strong> {ra.title||"—"}</div><div><strong>Location:</strong> {ra.location||"—"}</div><div><strong>RA No:</strong> {ra.ra_no}</div><div><strong>Date:</strong> {ra.date}</div><div><strong>Assessor:</strong> {ra.assessor||"—"}</div><div><strong>Approver:</strong> {ra.approver||"—"}</div></div>
      <div style={S.regSumBar}>{Object.entries(CAT).map(([c,{label,color}])=>{const count=ra.steps.filter(s=>String(getCat(s.rS,s.rL))===c).length;return<div key={c} style={{ ...S.regSumItem, borderColor:color, background:color+"18" }}><div style={{ color,fontWeight:700,fontSize:13 }}>{label}</div><div style={{ fontSize:24,fontWeight:800,color }}>{count}</div><div style={{ color:C.fgMuted,fontSize:11 }}>steps</div></div>;})}</div>
      {ra.steps.map((step,i)=>{const iC=getCat(step.iS,step.iL),rC=getCat(step.rS,step.rL);return(
        <div key={step.id} style={S.regStepCard}>
          <div style={S.regStepHdr}><div style={S.regStepNum}>Step {i+1}</div><div style={S.regStepTitle}>{step.description||"No description"}</div>{rC&&<div style={{ ...S.regCatBadge, background:CAT[rC].color }}>{step.rS}{step.rL} · {CAT[rC].label}</div>}</div>
          <div style={S.regStepBody}>
            {step.energies.length>0&&<div><div style={S.regSecLabel}>Energy Sources</div><div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:4 }}>{step.energies.map(eid=>{const en=ENERGIES.find(e=>e.id===eid);return en?<span key={eid} style={{ ...S.regTag, borderColor:en.color, color:en.color }}>{en.icon} {en.label}</span>:null;})}</div></div>}
            {step.hazards.length>0&&<div><div style={S.regSecLabel}>Hazards</div><div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:4 }}>{step.hazards.map((h,j)=><span key={j} style={{ ...S.regTag, borderColor:"#ef4444",color:"#ef4444" }}>{h}</span>)}</div></div>}
            {step.epcs.length>0&&<div><div style={S.regSecLabel}>Error-Producing Conditions</div><div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:4 }}>{step.epcs.map(id=>{const item=allEpcItems.find(i=>i.id===id);return item?<span key={id} style={{ ...S.regTag, borderColor:"#8b5cf6",color:"#8b5cf6" }}>{item.label}</span>:null;})}</div></div>}
            {step.controls.length>0&&<div><div style={S.regSecLabel}>Control Measures</div>{step.controls.map((ctrl)=>{const h=HOC.find(h=>h.id===ctrl.type);return<div key={ctrl.id} style={S.regControl}><span style={{ ...S.regHocBadge, background:h?.color||"#666" }}>{h?.rank}. {h?.label}</span><span style={{ fontSize:13 }}>{ctrl.measure}</span><span style={{ fontSize:11,color:C.fgMuted,marginLeft:"auto" }}>{ctrl.effectiveness}</span></div>;})}</div>}
            <div style={S.regRiskFlow}><div style={S.regRiskItem}><div style={{ fontSize:10,color:C.fgMuted }}>Initial Risk</div>{iC?<div style={{ color:CAT[iC].color,fontWeight:700 }}>{step.iS}{step.iL} · {CAT[iC].label}</div>:<div style={{ color:C.fgMuted }}>Not rated</div>}</div><div style={{ fontSize:18,color:C.fgMuted }}>→</div><div style={S.regRiskItem}><div style={{ fontSize:10,color:C.fgMuted }}>Residual Risk</div>{rC?<div style={{ color:CAT[rC].color,fontWeight:700 }}>{step.rS}{step.rL} · {CAT[rC].label}</div>:<div style={{ color:C.fgMuted }}>Not rated</div>}</div>{rC&&<div style={S.regRiskItem}><div style={{ fontSize:10,color:C.fgMuted }}>Sign-off</div><div style={{ fontSize:12 }}>{CAT[rC].sign}</div></div>}</div>
          </div>
        </div>
      );})}
      <div style={S.regFooter}><div style={{ flex:1 }}><strong>Assessor:</strong> {ra.assessor||"_________________"}</div><div style={{ flex:1 }}><strong>Approver:</strong> {ra.approver||"_________________"}</div><div style={{ flex:1 }}><strong>Reviewer:</strong> {ra.reviewer||"_________________"}</div></div>
    </div>
  );
}
