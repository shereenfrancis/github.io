# Aeronaut on Vercel

Connect repository `shereenfrancis/github.io`, branch `main`, and set **Root Directory** to `aeronaut-live` in the Vercel project. Choose Framework Preset: Other. The site root serves `index.html`, and four Node.js functions under `/api` proxy real aircraft feeds.

Endpoints: `/api/health` (function running), `/api/status` (provider status for one warm function instance), `/api/aircraft?lat=-26.204&lon=28.047` (regional reports), `/api/global` (OpenSky worldwide). An `ok` health endpoint does NOT mean the providers work. Verify both data feeds independently. Worldwide anonymous usage is provider-limited, and may return 403/429. Successful data is cached at Vercel's CDN. Free global snapshots are not a continuously updating world radar.

The public website is independent of your existing github.io root; only the `aeronaut-live/` directory is used by this Vercel project.
