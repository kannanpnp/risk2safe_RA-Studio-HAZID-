name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
          cache-dependency-path: |
            ai-version/package-lock.json
            manual-version/package-lock.json

      # ── Build AI Version ───────────────────────────────────────────────
      - name: Install AI version dependencies
        run: cd ai-version && npm ci

      - name: Build AI version
        env:
          VITE_ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
          VITE_BASE: /risk2safe-ra-studio/ai/
        run: cd ai-version && npm run build

      # ── Build Manual Version ───────────────────────────────────────────
      - name: Install Manual version dependencies
        run: cd manual-version && npm ci

      - name: Build Manual version
        env:
          VITE_BASE: /risk2safe-ra-studio/manual/
        run: cd manual-version && npm run build

      # ── Assemble combined output ──────────────────────────────────────
      - name: Assemble deployment directory
        run: |
          mkdir -p _site/ai _site/manual
          cp -r ai-version/dist/. _site/ai/
          cp -r manual-version/dist/. _site/manual/
          # Root landing page
          cat > _site/index.html << 'EOF'
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Risk2Safe Risk Assessment Studio</title>
            <style>
              *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
              body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0b1220; color: #e2e8f0; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; }
              .logo { font-size: 48px; margin-bottom: 16px; }
              h1 { font-size: clamp(24px, 5vw, 40px); font-weight: 800; color: #fff; margin-bottom: 8px; letter-spacing: -1px; }
              .sub { color: #94a3b8; font-size: 14px; margin-bottom: 48px; }
              .badge { display: inline-block; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.4); color: #f59e0b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-bottom: 48px; }
              .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; max-width: 680px; width: 100%; }
              .card { background: #111827; border: 1px solid #1e3a5f; border-radius: 12px; padding: 28px; text-decoration: none; color: inherit; transition: all 0.2s; }
              .card:hover { border-color: #f59e0b; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
              .card-icon { font-size: 32px; margin-bottom: 12px; }
              .card-title { font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 6px; }
              .card-sub { font-size: 12px; color: #f59e0b; font-weight: 600; margin-bottom: 10px; }
              .card-desc { font-size: 13px; color: #94a3b8; line-height: 1.6; }
              .footer { margin-top: 48px; font-size: 12px; color: #475569; text-align: center; }
            </style>
          </head>
          <body>
            <div class="logo">⬡</div>
            <h1>Risk2Safe RA Studio</h1>
            <p class="sub">Task-Based Risk Assessment · EI 3580 · ADNOC 6×6</p>
            <div class="badge">Choose your version below</div>
            <div class="cards">
              <a href="./ai/" class="card">
                <div class="card-icon">🤖</div>
                <div class="card-title">AI-Assisted Version</div>
                <div class="card-sub">Powered by Claude · Anthropic API</div>
                <div class="card-desc">AI-generated hazard suggestions, EPC identification, hierarchy-aligned control recommendations, and automated quality review. Requires Anthropic API key.</div>
              </a>
              <a href="./manual/" class="card">
                <div class="card-icon">📋</div>
                <div class="card-title">Manual Version</div>
                <div class="card-sub">Fully Standalone · Works Offline</div>
                <div class="card-desc">Complete EI 3580 methodology with built-in hazard library (60+ hazards by energy type), control library, EPC guidance, and manual quality checklist. No API key required.</div>
              </a>
            </div>
            <div class="footer">Risk2Safe Risk Assessment Studio &nbsp;·&nbsp; EI 3580 (Jan 2025) &nbsp;·&nbsp; ADNOC HSE-RM-ST01 v1 (Aug 2019)</div>
          </body>
          </html>
          EOF

      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: _site

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
