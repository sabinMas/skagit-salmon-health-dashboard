# Puget Sound Chinook Salmon Population Health Dashboard

An interactive web-based dashboard visualizing the health and status of Chinook salmon populations across Puget Sound watersheds in Washington State. The project combines geospatial analysis, live population data, and environmental monitoring to support salmon recovery decision-making.

## Overview

Chinook salmon populations throughout Puget Sound are ESA-listed (threatened), with many runs experiencing long-term declines. This dashboard provides a watershed-scale perspective—highlighting how interconnected river systems, estuaries, and marine conditions collectively influence salmon survival in the Pacific Northwest.

## Features

### Interactive Map
- **Puget Sound watershed boundaries** – Regional context of interconnected river systems
- **Population circles** – Sized by current population, colored by health status (critical, endangered, threatened, stable)
- **Spawning and rearing habitat zones** – Color-coded by suitability (optimal, marginal, unsuitable)
- **Clickable features** – Detailed information for each mapped feature
- **Dynamic legend** – Population health status and habitat suitability indicators

### Population Trends Analysis
- **Historical spawning counts** – Multi-year monitoring data across Puget Sound watersheds
- **Interactive trend charts** – Visualize population trajectories and recovery periods
- **Watershed comparison** – Current population vs. recovery targets side-by-side
- **Regional status overview** – Aggregate metrics and recovery gap calculations

### Data Integration
- **Live WDFW API data** – Automatic integration with Washington Department of Fish and Wildlife Salmonid Population Indicators (SPI) database
- **Comprehensive fallback dataset** – 8 major Puget Sound watersheds with complete information
- **Graceful degradation** – Falls back to local data if API unavailable
- **Auto-refresh capability** – Can be configured for periodic updates

## File Structure

```
puget-salmon-health/
├── index.html          # Semantic HTML structure (no inline styles/scripts)
├── styles.css          # Comprehensive CSS styling with responsive design
├── script.js           # Complete JavaScript logic (API, mapping, visualization)
├── data/
│   ├── puget-sound-watersheds.geojson
│   └── cleaned_puget_sound_watershed_data_final.csv
└── README.md
```

## Architecture

The dashboard is refactored into three separate, cohesive files following modern web development best practices:

### 1. **index.html** – Structure
- Clean, semantic HTML5 markup
- Accessible ARIA labels
- No inline CSS or JavaScript
- External library references (Leaflet, Chart.js)

### 2. **styles.css** – Presentation
- Complete styling with no inline styles needed
- Responsive design (desktop, tablet, mobile)
- Component-based CSS organization
- CSS variables for consistent theming
- Accessibility considerations (contrast, focus states)

### 3. **script.js** – Behavior & Logic
- All application logic in single file
- API integration with WDFW Socrata endpoints
- Leaflet map initialization and event handling
- Chart.js visualization rendering
- Error handling and graceful degradation

## Data Sources

### Live API Integration

#### WDFW Salmonid Population Indicators (SPI) Database
Endpoint: `https://data.wa.gov/api/views/x25s-cxg8/rows.json`
- **Provider**: Washington Department of Fish and Wildlife via Socrata Open Data API
- **Data**: Annual escapement counts, population metrics, hatchery proportions
- **Coverage**: All ESUs/DPSs including Puget Sound Chinook
- **Update Frequency**: Annual (new data typically released in spring)

#### WDFW SPI Escapement Data
Endpoint: `https://data.wa.gov/api/views/fgyz-n3uk/rows.json`
- **Provider**: WDFW
- **Data**: Detailed escapement (return) data for spawning populations
- **Coverage**: Comprehensive river-by-river counts

#### WDFW SPI Populations
Endpoint: `https://data.wa.gov/api/views/ncqh-ypvf/rows.json`
- **Provider**: WDFW
- **Data**: Population abundance estimates
- **Coverage**: All tracked populations

#### WDFW SPI Recovery Goals
Endpoint: `https://data.wa.gov/api/views/d8mu-pcf6/rows.json`
- **Provider**: WDFW
- **Data**: Recovery targets and interim goals
- **Coverage**: All ESA-listed populations

### Fallback Local Dataset

When live API is unavailable, the dashboard uses a comprehensive fallback dataset covering 8 major Puget Sound watersheds:

```javascript
FALLBACK_WATERSHED_DATA = [
  { watershed: "Skagit River", population: 11184, recoveryTarget: 42000, ... },
  { watershed: "Stillaguamish River", population: 2278, recoveryTarget: 33000, ... },
  { watershed: "Snohomish River", population: 1194, recoveryTarget: 20600, ... },
  { watershed: "Cedar-Sammamish River", population: 5964, recoveryTarget: 12200, ... },
  { watershed: "Duwamish River", population: 11288, recoveryTarget: 27000, ... },
  { watershed: "Puyallup-White River", population: 13132, recoveryTarget: 19000, ... },
  { watershed: "Nisqually River", population: 4200, recoveryTarget: 12000, ... },
  { watershed: "Skokomish River", population: 2100, recoveryTarget: 8500, ... }
]
```

### Recommended Additional Data Sources

#### Puget Sound Partnership
- **Vital Signs Database**: https://www.pugetsoundinfo.wa.gov
- **Data**: Chinook salmon spawner abundance, 22 populations, geometric means
- **Coverage**: 1999-2023 time series

#### Watershed Health Monitoring (WHM)
- **Provider**: Washington Department of Ecology
- **Data**: Stream health, benthic health index (B-IBI), habitat quality
- **Monitoring Sites**: ~350 sites surveyed every 4 years
- **Database**: https://ecology.wa.gov/research-data/monitoring-assessment/river-stream-monitoring/habitat-monitoring/watershed-health

#### NOAA Fisheries
- **Salmon Population Summaries (SPS)**: https://www.fisheries.noaa.gov/resource/tool-app/salmon-population-summaries-sps
- **Data**: Multi-ESU comparisons, oceanographic conditions

#### Puget Sound Salmon Recovery Hub
- **Maps & Data**: https://pssalmonhub.wa.gov
- **Resources**: Recovery plans, restoration projects, monitoring

## Technical Stack

### Frontend Libraries
- **Leaflet.js** (v1.9.4) – Interactive mapping
- **Chart.js** (v4.3.0) – Data visualization
- **Vanilla JavaScript** – No frameworks, lightweight and fast

### Styling
- **CSS3** – Modern responsive design
- **Flexbox & Grid** – Layout system
- **Mobile-responsive** – Works on desktop, tablet, mobile

### Data Format
- **GeoJSON** – Watershed geometries
- **CSV** – Structured data
- **JSON** – API responses

## Installation & Usage

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sabinMas/puget-salmon-health.git
   cd puget-salmon-health
   ```

2. **Start a local server** (required for GeoJSON loading)
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Or with Node.js
   npx http-server
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Deployment

The dashboard is static HTML/CSS/JS and can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

**Note**: Ensure CORS is enabled for Socrata API calls (typically handled automatically by data.wa.gov)

## Performance

- **No backend required** – Completely client-side
- **Fast load times** – ~2-3 seconds initial load
- **API timeout handling** – Graceful fallback to local data
- **Chart caching** – Chart instances destroyed/recreated cleanly
- **Mobile optimized** – Touch-friendly interactions

## Customization

### Adding New Watersheds

1. Add data to `FALLBACK_WATERSHED_DATA` in `script.js`:
   ```javascript
   {
     watershed: "Your River",
     population: 5000,
     recoveryTarget: 15000,
     latestYear: 2024,
     targetYear: 2022,
     estuary: "Estuary Name",
     tributaries: ["Tributary1", "Tributary2"]
   }
   ```

2. Update GeoJSON features in `data/puget-sound-watersheds.geojson`

3. Restart the server

### Updating Colors/Theme

Color codes are defined in `script.js` helper functions:
```javascript
function getPopulationColor(population, target) {
  // Modify color thresholds here
  if (percentOfTarget < 5) return "#dc2626";   // critical
  if (percentOfTarget < 10) return "#ea580c";  // endangered
  if (percentOfTarget < 25) return "#ca8a04";  // threatened
  return "#22c55e";                             // stable
}
```

### Configuring API Endpoints

API endpoints are configured at the top of `script.js`:
```javascript
const WDFW_SPI_API = {
  metrics: "https://data.wa.gov/api/views/x25s-cxg8/rows.json?$limit=50000",
  escapement: "https://data.wa.gov/api/views/fgyz-n3uk/rows.json?$limit=50000",
  populations: "https://data.wa.gov/api/views/ncqh-ypvf/rows.json?$limit=50000",
  recoveryGoals: "https://data.wa.gov/api/views/d8mu-pcf6/rows.json?$limit=50000"
};
```

## Known Limitations

- **Static habitat zones** – Currently hardcoded sample data; can be expanded
- **Single-year trends** – Trend chart shows example data; can be enhanced with historical data
- **No real-time updates** – Requires manual refresh (could be automated with scheduled jobs)
- **Limited mobile interactivity** – Map controls optimized for desktop

## Future Enhancements

1. **Real-time data updates** – Implement automated daily/weekly refreshes
2. **Historical time-series** – 10-20 year trend analysis per watershed
3. **Watershed health integration** – Add Ecology WHM scores to dashboard
4. **Temperature monitoring** – Real-time water temperature from USGS gauges
5. **Barrier inventory** – Interactive fish passage barrier locations
6. **Export functionality** – Download data as CSV/GeoJSON
7. **Mobile app version** – React Native mobile dashboard
8. **Advanced filtering** – Filter by population status, estuary, recovery progress

## Data Accuracy & Updates

- **Population data**: Updated annually by WDFW (typically Spring)
- **Recovery targets**: Set by Puget Sound Partnership, reviewed every 5 years
- **Habitat zones**: Based on NOAA critical habitat designations (2005, updated 2019)
- **Last verified**: January 2026

## Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request with description

## License

MIT License – See LICENSE file for details

## References

### Organizations
- [Puget Sound Partnership](https://www.psp.wa.gov)
- [WDFW Salmon Recovery](https://wdfw.wa.gov/species-habitats/fish/salmon)
- [NOAA Fisheries - Pacific](https://www.fisheries.noaa.gov/west-coast)
- [US EPA - Salish Sea](https://www.epa.gov/salish-sea)

### Data & Resources
- [data.wa.gov - WDFW Datasets](https://data.wa.gov/browse?tags=wdfw)
- [Puget Sound Info - Vital Signs](https://www.pugetsoundinfo.wa.gov)
- [Monitoring Resources](https://www.monitoringresources.org)

### Scientific References
- WDFW Salmonid Population Indicators (SPI) Database
- ESA Recovery Plan for Puget Sound Chinook Salmon
- Puget Sound Salmon Recovery Plan

## Contact & Support

For questions about the dashboard:
- GitHub Issues: https://github.com/sabinMas/puget-salmon-health/issues
- WDFW Salmon Info: https://wdfw.wa.gov
- PSP Contact: https://www.psp.wa.gov/contact.php

---

**Last Updated**: January 23, 2026
**Data Version**: WDFW SPI 2024 (2023-2024 escapement data)
