# Taipei, in a day

A visually rich one-day Taipei planner for friends visiting Taiwan. It includes:

- A curated route through Chiang Kai-shek Memorial Hall, National Palace Museum, Chun Shui Tang, and Taipei 101
- A stylized route map with an optional Google Maps hand-off
- Bubble tea recommendations and local notes
- Start-time, tempo, filtering, completion tracking, save, share, and light/dark theme controls
- Automatic GitHub Pages deployment from `main`

## Run locally

Open `index.html` directly in a browser, or serve the folder with any static file server:

```powershell
python -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy

The workflow in `.github/workflows/deploy-pages.yml` deploys the root folder to GitHub Pages on every push to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.
