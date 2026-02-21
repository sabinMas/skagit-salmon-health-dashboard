# Quick Start Guide

Get the Puget Sound Salmon Health Dashboard running in minutes!

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A text editor (VS Code, Sublime Text, etc.)
- Git (optional, for cloning)
- Python 3 or Node.js (for running local server)

## Installation

### Option 1: Clone from GitHub

```bash
# Clone the repository
git clone https://github.com/sabinMas/puget-salmon-health.git
cd puget-salmon-health

# Start local server
python -m http.server 8000

# Open in browser
# Visit http://localhost:8000
```

### Option 2: Download ZIP

1. Click "Code" → "Download ZIP" on GitHub
2. Extract the files
3. Open `index.html` in a web server (see Running Locally below)

## Running Locally

You **need** a local web server to run the dashboard (file:// protocol won't work with GeoJSON).

### Python 3 (Recommended)

```bash
cd puget-salmon-health
python -m http.server 8000
```

Then visit: `http://localhost:8000`

### Python 2

```bash
cd puget-salmon-health
python -m SimpleHTTPServer 8000
```

### Node.js

```bash
npx http-server
```

### VS Code

1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

## File Structure

```
puget-salmon-health/
├── index.html              # Main HTML file
├── styles.css              # All styling (no inline CSS)
├── script.js               # All JavaScript logic
├── data/
│   ├── puget-sound-watersheds.geojson
│   └── cleaned_puget_sound_watershed_data_final.csv
├── README.md               # Full documentation
├── DATA_SOURCES.md         # Data sources reference
└── QUICKSTART.md           # This file
```

## What You'll See

When the dashboard loads:

1. **Header** - Title and subtitle
2. **Map (Left Side)** - Interactive Leaflet map with:
   - Colored circles representing watersheds
   - Green shades = healthy populations
   - Red shades = critically endangered
   - Habitat zones overlaid
3. **Dashboard (Right Side)** - Cards showing:
   - Regional population status
   - 5-year trend chart
   - Watershed comparison bar chart
   - Key threats list
   - Recovery resources

## How to Use

### Interacting with the Map

- **Zoom**: Scroll wheel or use + / - buttons
- **Pan**: Click and drag
- **Click Watersheds**: Shows detailed information in status panel
- **Hover**: Displays popup information

### Reading the Data

**Population Status Colors**:
- 🔴 **Critical** (Red) - Less than 5% of recovery target
- 🟠 **Endangered** (Orange) - 5-10% of recovery target  
- 🟡 **Threatened** (Yellow) - 10-25% of recovery target
- 🟢 **Stable** (Green) - 25% or more of recovery target

**Key Metrics**:
- **Current Population** - Number of spawning adults (latest year)
- **Recovery Target** - Goal number needed for population recovery
- **Progress** - Current population as % of target
- **Recovery Gap** - How many more spawners needed

## Customization

### Change Colors

Edit `script.js`, find `getPopulationColor()` function:

```javascript
function getPopulationColor(population, target) {
  const percentOfTarget = (population / target) * 100;
  if (percentOfTarget < 5) return "#dc2626";   // Change red
  if (percentOfTarget < 10) return "#ea580c";  // Change orange
  if (percentOfTarget < 25) return "#ca8a04";  // Change yellow
  return "#22c55e";                             // Change green
}
```

### Add a New Watershed

1. Open `script.js`
2. Find `FALLBACK_WATERSHED_DATA` array (around line 40)
3. Add new entry:

```javascript
{
  watershed: "New River Name",
  population: 5000,           // Latest population count
  latestYear: 2024,           // Year of data
  recoveryTarget: 15000,      // Recovery goal
  targetYear: 2022,           // Year of goal
  status: "Threatened",       // Critical/Endangered/Threatened/Stable
  estuary: "Bay Name",        // Where it flows to
  tributaries: ["Tributary1", "Tributary2"]  // Smaller streams
}
```

4. Save and refresh browser

### Change Map Background

Edit `script.js`, find Leaflet tile layer (around line 200):

```javascript
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  // Change to different tile provider:
  // CartoDB Light: https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png
  // ESRI Satellite: https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}
  attribution: "© OpenStreetMap contributors",
  maxZoom: 18,
  minZoom: 7
}).addTo(map);
```

## Updating Data

### From Live API

The dashboard automatically tries to fetch live WDFW data from:
`https://data.wa.gov/api/views/x25s-cxg8/rows.json`

If this fails, it falls back to the local `FALLBACK_WATERSHED_DATA`.

### Manual Update

1. Download latest data from [data.wa.gov](https://data.wa.gov)
2. Update `FALLBACK_WATERSHED_DATA` in `script.js`
3. Save and refresh

## Deployment

### GitHub Pages (Free)

```bash
# Make sure you're in the repo directory
git add .
git commit -m "Update dashboard"
git push origin main
```

Then enable GitHub Pages:
1. Go to Settings → Pages
2. Select "Deploy from a branch"
3. Choose "main" branch
4. Access at: `https://yourusername.github.io/puget-salmon-health`

### Netlify (Free)

1. Sign up at [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Click "Deploy"

### Vercel (Free)

1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Click "Deploy"

## Troubleshooting

### "Cannot GET /index.html"

**Problem**: You're not running a web server

**Solution**: Use Python or Node.js to run a local server (see "Running Locally" above)

### Map shows but no data

**Problem**: GeoJSON file not loading

**Solution**: 
- Make sure you're using a web server (not file://)
- Check browser console for errors (F12)
- Verify `data/puget-sound-watersheds.geojson` exists

### "Failed to fetch live WDFW data"

**Problem**: API is unavailable

**Solution**: This is normal - dashboard falls back to local data automatically

### Charts not rendering

**Problem**: Chart.js library issue

**Solution**:
- Clear browser cache (Ctrl+Shift+Del)
- Try different browser
- Check internet connection (needs to load libraries from CDN)

### Styling looks broken

**Problem**: CSS not loading

**Solution**:
- Verify `styles.css` exists in root directory
- Clear browser cache
- Check browser console for 404 errors

## Getting Help

### Documentation
- Full docs: `README.md`
- Data sources: `DATA_SOURCES.md`
- GitHub Issues: https://github.com/sabinMas/puget-salmon-health/issues

### External Resources
- WDFW Salmon Info: https://wdfw.wa.gov/species-habitats/fish/salmon
- Puget Sound Partnership: https://www.psp.wa.gov
- NOAA Fisheries: https://www.fisheries.noaa.gov/west-coast

## Next Steps

1. ✅ Get the dashboard running locally
2. 📊 Explore the data and maps
3. 🎨 Customize colors and add your watersheds
4. 📈 Integrate additional data sources (see DATA_SOURCES.md)
5. 🚀 Deploy to GitHub Pages or Netlify
6. 📧 Share with your team!

## Tips & Tricks

### Speed Up Development

- Use "Live Server" extension for instant reloads
- Keep browser console open (F12) to see errors
- Test in multiple browsers

### Better Data Exploration

- Click each watershed to see detailed info
- Check the legend in bottom-right corner
- Read the threats section for context
- Review recovery resources for action items

### Extending Functionality

Possible enhancements:
- Add water temperature layer
- Show fish passage barriers
- Display restoration projects
- Add historical photos/stories
- Create export to PDF feature
- Build mobile app version

---

**Stuck? Check the browser console (F12 → Console tab) for error messages!**

Happy exploring! 🐟
