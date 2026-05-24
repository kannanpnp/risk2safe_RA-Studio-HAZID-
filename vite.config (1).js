# ⬡ Risk2Safe Risk Assessment Studio

**Task-Based Risk Assessment · EI 3580 · ADNOC 6×6 Risk Matrix**

A professional, production-ready web application for conducting task-based risk assessments aligned with the Energy Institute Guidance on Human Factors in Task-Based Risk Assessment (EI 3580, January 2025) and the ADNOC Corporate 6×6 Risk Matrix (HSE-RM-ST01 v1, August 2019).

---

## 📦 Two Versions Available

| Feature | AI-Assisted Version | Manual Version |
|---|---|---|
| EI 3580 Six-Stage Methodology | ✅ | ✅ |
| ADNOC 6×6 Interactive Matrix | ✅ | ✅ |
| Energy & Error Wheel | ✅ | ✅ |
| All 21 Error-Producing Conditions | ✅ | ✅ |
| Hierarchy of Controls | ✅ | ✅ |
| 9 Frontline Tools (EI 3580 §4) | ✅ | ✅ |
| Risk Register Export View | ✅ | ✅ |
| AI Hazard Suggestions | ✅ (Anthropic API) | ❌ → Built-in Hazard Library |
| AI EPC Suggestions | ✅ (Anthropic API) | ❌ → EPC Guidance Prompts |
| AI Control Suggestions | ✅ (Anthropic API) | ❌ → Control Library Browser |
| AI Quality Review | ✅ (Anthropic API) | ❌ → Manual Quality Checklist |
| External API dependency | Requires Anthropic key | None – fully standalone |
| Works offline | Partial | ✅ Full |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- npm 9+

### Run AI-Assisted Version

```bash
cd ai-version
npm install
# Set your Anthropic API key in .env.local:
echo "VITE_ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env.local
npm run dev
```
> Open http://localhost:5173

### Run Manual Version (No API key needed)

```bash
cd manual-version
npm install
npm run dev
```
> Open http://localhost:5173

---

## 🌐 Deploy to GitHub Pages

### Automated Deployment (Recommended)
This repo includes a GitHub Actions workflow that automatically deploys both versions to GitHub Pages on every push to `main`.

**Setup steps:**
1. Fork or clone this repository to your GitHub account
2. Go to **Settings → Pages → Source** → set to `GitHub Actions`
3. For the AI version: go to **Settings → Secrets and variables → Actions** → add `ANTHROPIC_API_KEY`
4. Push to `main` — the workflow will build and deploy both versions

**Your deployed URLs will be:**
- AI Version: `https://YOUR-USERNAME.github.io/risk2safe-ra-studio/ai/`
- Manual Version: `https://YOUR-USERNAME.github.io/risk2safe-ra-studio/manual/`

### Manual Deployment

```bash
# AI Version
cd ai-version
npm run build        # Output in dist/
# Upload dist/ contents to /ai/ on your web server

# Manual Version
cd manual-version
npm run build        # Output in dist/
# Upload dist/ contents to /manual/ on your web server
```

---

## 📋 EI 3580 Six-Stage Methodology

| Stage | Description | App Tab |
|---|---|---|
| 1 | Identify Task Steps | Task Info + Step Sidebar |
| 2 | Identify Hazards (Energy Sources) | Energies & Hazards |
| 3 | Identify Error-Producing Conditions | Error Conditions |
| 4 | Control Hazards & EPCs | Initial Risk → Controls → Residual Risk |
| 5 | Record Findings | Risk Register |
| 6 | Review Controls | Risk Register + Sign-off |

---

## 🎯 ADNOC 6×6 Risk Matrix

| Category | Label | Severity × Likelihood | Required Action |
|---|---|---|---|
| CAT 1 | HIGH (Red) | 5C–6F and others | Stop work. Reduce to ALARP immediately. GC CEO/Director sign-off |
| CAT 2 | HIGH-MED (Orange) | 4D–5B and others | Reduce to ALARP. Business Manager/SVP sign-off |
| CAT 3 | MEDIUM (Amber) | 3B–4C and others | Monitor & improve. Dept. Manager/VP sign-off |
| CAT 4 | LOW (Green) | 1A–2D and others | Low priority. Line Manager sign-off |

---

## ⚡ Energy Sources (EI 3580 Annex A – Energy & Error Wheel)

Gravity · Motion · Mechanical · Electrical · Pressure · Temperature · Chemical · Biological · Radiation · Sound/Vibration

---

## 🧠 Error-Producing Conditions

**Job Factors (11):** Information Clarity · Equipment Interface · Task Complexity · Routine vs Unusual · Divided Attention · Inadequate Procedures · Preparation Gaps · Time Pressure · Unsuitable Tools · Communication Barriers · Work Environment

**Person Factors (6):** Physical Capability · Fatigue · Stress/Morale · Workload Imbalance · Competence Gap · Competing Priorities

**Organisation Factors (4):** Production Pressure · Supervision Quality · Staffing Levels · Unclear Roles

---

## 🔧 Frontline Risk Tools (EI 3580 §4)

| # | Phase | Tool |
|---|---|---|
| 1 | Pre-job | Identify Energy Sources & EPCs |
| 2 | Pre-job | Last Minute Risk Assessment (LMRA) |
| 3 | During | 15-Second Scan |
| 4 | During | Look, Point, Call Out |
| 5 | During | Self-Check |
| 6 | During | Peer-Check |
| 7 | During | Criteria for Stopping the Job |
| 8 | After | Independent Verification |
| 9 | After | Post-Job Brief Questions |

---

## 🔑 AI Version – API Key Setup

The AI-assisted version uses the [Anthropic Claude API](https://docs.anthropic.com). **Your API key is used only in your browser session and is never transmitted to any server other than `api.anthropic.com`.**

```bash
# Create .env.local in the ai-version/ directory:
VITE_ANTHROPIC_API_KEY=sk-ant-api03-...
```

> ⚠️ **Security Note:** Do NOT commit `.env.local` to version control. It is already included in `.gitignore`. For GitHub Pages deployment, add the key as a GitHub Actions secret named `ANTHROPIC_API_KEY`.

---

## 🏗 Tech Stack

- **React 18** with hooks
- **Vite 5** for bundling and dev server
- **No additional UI libraries** – pure CSS-in-JS with CSS variables
- **Anthropic Claude API** (AI version only) – `claude-sonnet-4-20250514`

---

## 📖 References

- EI 3580 — *Guidance on Human Factors in Task-Based Risk Assessment*, Energy Institute, January 2025
- ADNOC HSE-RM-ST01 v1 — *ADNOC Corporate Risk Matrix*, August 2019
- James Reason — *Managing the Risks of Organisational Accidents*, 1997
- CCPS — *Guidelines for Hazard Evaluation Procedures*, 3rd Edition

---

## 📄 Licence

MIT Licence — free to use, adapt, and distribute with attribution.

---

*Developed for HSE professionals in the oil & gas industry. Aligned with EI 3580 (Jan 2025) and ADNOC risk management standards.*
