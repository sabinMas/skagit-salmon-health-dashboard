# Puget Sound Salmon & Watershed Health Data Sources

This document provides a comprehensive reference to all available data sources that can be integrated into the Puget Sound Chinook Salmon Population Health Dashboard.

## Table of Contents

1. [Population Data Sources](#population-data-sources)
2. [Watershed Health Data](#watershed-health-data)
3. [Habitat & Environmental Data](#habitat--environmental-data)
4. [API Access & Technical Details](#api-access--technical-details)
5. [Integration Guide](#integration-guide)

---

## Population Data Sources

### 1. WDFW Salmonid Population Indicators (SPI) Database ⭐ PRIMARY SOURCE

**Organization**: Washington Department of Fish and Wildlife (WDFW)

**URLs**:
- Main Hub: https://data.wa.gov/browse?tags=wdfw
- SPI Metrics: https://data.wa.gov/Natural-Resources-Environment/WDFW-Salmonid-Population-Indicators-Database-SPI-M/x25s-cxg8
- SPI Escapement: https://data.wa.gov/Natural-Resources-Environment/WDFW-Salmonid-Population-Indicators-SPI-Escapement/fgyz-n3uk
- SPI Populations: https://data.wa.gov/Natural-Resources-Environment/WDFW-Salmonid-Population-Indicators-SPI-Populations/ncqh-ypvf
- SPI Recovery Goals: https://data.wa.gov/Natural-Resources-Environment/WDFW-Salmonid-Population-Indicators-SPI-Recovery-G/d8mu-pcf6

**API Endpoints**:
```
https://data.wa.gov/api/views/x25s-cxg8/rows.json?$limit=50000    # Metrics
https://data.wa.gov/api/views/fgyz-n3uk/rows.json?$limit=50000    # Escapement
https://data.wa.gov/api/views/ncqh-ypvf/rows.json?$limit=50000    # Populations
https://data.wa.gov/api/views/d8mu-pcf6/rows.json?$limit=50000    # Recovery Goals
```

**Data Included**:
- Annual escapement counts (spawning populations)
- Hatchery proportion (pHOS - proportion of hatchery-origin spawners)
- Population estimates
- Recovery targets and interim goals
- Trend analysis (5-year, 10-year geometric means)
- Population status classifications

**Coverage**: 
- All ESUs/DPSs including Puget Sound Chinook (22 populations)
- Historical data: 1990-2024
- Annual updates: Typically Spring release

**Data Quality**: Peer-reviewed, co-managed by WDFW and 17 Treaty Indian Tribes

**Documentation**: https://dev.socrata.com/foundry/data.wa.gov/x25s-cxg8

---

### 2. Puget Sound Partnership Vital Signs

**Organization**: Puget Sound Partnership (PSP)

**URLs**:
- Vital Signs Portal: https://www.pugetsoundinfo.wa.gov
- Chinook Salmon Indicator: https://www.pugetsoundinfo.wa.gov/Indicator/Detail/4
- Maps: https://pssalmonhub.wa.gov/pages/salmon-maps
- Recovery Hub: https://pssalmonhub.wa.gov

**Data Included**:
- Natural-origin Chinook on spawning grounds
- Geometric means (low productivity and high productivity scenarios)
- Population-specific targets
- Recovery plan updates
- Long-term trends (1999-2023)
- Trend direction (improving/declining/unknown)

**Coverage**:
- 22 Puget Sound Chinook populations
- Basin-wide aggregates
- Individual watershed detail

**Data Quality**: PSP coordinates with WDFW, NOAA, and tribal co-managers

**Update Frequency**: Annual (released with WDFW SPI data)

---

### 3. NOAA Fisheries Salmon Population Summaries (SPS)

**Organization**: National Oceanic and Atmospheric Administration (NOAA) Fisheries

**URLs**:
- SPS Tool: https://www.fisheries.noaa.gov/resource/tool-app/salmon-population-summaries-sps
- Puget Sound Chinook: https://www.fisheries.noaa.gov/west-coast/endangered-species-conservation/puget-sound-chinook-salmon
- Inport Database: https://www.fisheries.noaa.gov/inport/item/17904

**Data Included**:
- Multi-ESU population comparisons
- Spawner abundance data
- Trend metrics
- Recovery assessment status
- Ocean conditions affecting survival
- Hatchery information

**Coverage**: All West Coast ESUs including Puget Sound

**Data Quality**: Federal ESA recovery plan data (high quality)

---

## Watershed Health Data

### 1. Washington Department of Ecology - Watershed Health Monitoring (WHM) 🏆 ESSENTIAL

**Organization**: Washington Department of Ecology

**URLs**:
- Main Program: https://ecology.wa.gov/research-data/monitoring-assessment/river-stream-monitoring/habitat-monitoring/watershed-health
- Database Search: https://ecology.wa.gov/research-data/monitoring-assessment/river-stream-monitoring/habitat-monitoring/watershed-health
- Puget Sound Regional Report: https://ecology.wa.gov/research-data/monitoring-assessment/river-stream-monitoring/habitat-monitoring/watershed-health/regional-
- Stream Benthos: https://pugetsoundstreambenthos.org

**Monitoring Sites**: ~350 sites across Washington (updated every 4 years)

**Metrics Collected**:
- **Biological**: Benthic Index of Biotic Integrity (B-IBI)
- **Physical Habitat**: 
  - Substrate composition and stability
  - Stream flow patterns
  - Temperature regime
  - Riparian condition
  - Pool-riffle structure
- **Water Chemistry**:
  - Dissolved oxygen
  - pH
  - Nitrogen levels (total, nitrate, ammonia)
  - Phosphorus
  - Turbidity
  - Conductivity

**Data Quality**: Standardized protocols across all sites (QA/QC certified)

**Update Frequency**: Every 4 years (next cycle 2025)

**Key Findings (2021 Report)**:
- Biotic health improving in some areas
- Common stressors: poor bed stability, low dissolved oxygen, elevated sand/fines, high nitrogen
- Land use and riparian condition are key factors

---

### 2. U.S. Geological Survey (USGS) Stream Monitoring

**Organization**: USGS Water Resources Division

**URLs**:
- USGS Water Data: https://waterdata.usgs.gov/wa/nwis
- Real-time Data: https://waterdata.usgs.gov/nwis/qw

**Data Available**:
- Real-time water temperature
- Stream discharge/flow
- Water chemistry
- Biological data (some stations)

**Coverage**: Scattered sites throughout Puget Sound watersheds

**Update Frequency**: Real-time to daily depending on parameter

---

## Habitat & Environmental Data

### 1. Critical Habitat Designations

**Source**: NOAA Fisheries Endangered Species Act Critical Habitat

**URLs**:
- Puget Sound Critical Habitat: https://www.fisheries.noaa.gov/resource/map-gis-data/critical-habitat-puget-sound-chinook-salmon
- Detailed Maps: https://www.fisheries.noaa.gov/west-coast/endangered-species-conservation/puget-sound-chinook-salmon

**Data Included**:
- Freshwater spawning habitat zones
- Freshwater rearing habitat zones  
- Estuarine habitat zones
- Marine habitat zones

**Coverage**: GeoJSON/Shapefiles available for download

---

### 2. Fish Passage Barriers Database

**Organization**: WDFW & Multiple Agencies

**Data Available**:
- Dams and their passage status
- Culvert inventory
- Tide gates
- Fish passage modification projects

**Note**: Scattered databases, no unified API currently. Data available through individual agency requests.

---

### 3. Land Use & Impervious Surface

**Source**: Multiple agencies

**Data Available**:
- Percent impervious surface by watershed
- Forest cover
- Agricultural land
- Urban development
- Riparian condition

**Providers**:
- Washington State Department of Ecology
- National Land Cover Database (NLCD)
- USGS

---

## API Access & Technical Details

### Socrata Open Data API (WDFW Data)

**Base URL**: `https://data.wa.gov/api/views/{dataset_id}/rows.json`

**Example Query**:
```bash
curl -X GET "https://data.wa.gov/api/views/x25s-cxg8/rows.json?$limit=100&$where=ESU%3D%27Puget%20Sound%27"
```

**Query Parameters**:
- `$limit` - Number of rows to return (max 50000)
- `$offset` - Starting row
- `$where` - Filter condition
- `$select` - Specific columns
- `$order` - Sort order

**Documentation**: https://dev.socrata.com/docs/endpoints.html

**CORS**: Enabled for web applications

### Response Format

```json
{
  "data": [
    {
      "ESU/DPS Name": "Puget Sound Chinook",
      "Population": "Skagit",
      "Species": "Chinook",
      "Metric": "Abundance",
      "Year": 2023,
      "Value": 11184,
      "Status": "Critical"
    }
  ]
}
```

---

## Integration Guide

### Adding Watershed Health Data

1. **Download WHM data**:
   ```bash
   # Access via Ecology's data portal
   curl https://ecology.wa.gov/api/watershed-health-data/download
   ```

2. **Parse and filter for Puget Sound**

3. **Integrate into dashboard**:
   ```javascript
   // Add to script.js
   const WATERSHED_HEALTH_DATA = {
     metrics: "https://ecology.wa.gov/api/views/.../rows.json"
   };
   ```

4. **Join with population data** by watershed name

5. **Visualize** B-IBI scores on map

### Adding Temperature Monitoring

1. **Query USGS stations**:
   ```javascript
   const usgsUrl = "https://waterdata.usgs.gov/api/nwis/qw?state=WA&parameterCode=00010&format=json";
   ```

2. **Parse temperature data**

3. **Create heatmap or overlay** on map

### Adding Historical Trend Data

1. **Extract 20-year time series from SPI data**:
   ```javascript
   // Filter by year
   const historicalData = spiData.filter(d => d.Year >= 2004 && d.Year <= 2024);
   ```

2. **Calculate 5-year geometric means**

3. **Render as line chart** for each population

---

## Data Quality & Citation

### Recommended Citations

**WDFW SPI Data**:
```
Washington Department of Fish and Wildlife. (2024). Salmonid Population Indicators (SPI) Database. 
Retrieved from https://data.wa.gov
```

**Puget Sound Partnership**:
```
Puget Sound Partnership. (2024). Puget Sound Vital Signs: Chinook Salmon. 
Retrieved from https://www.pugetsoundinfo.wa.gov
```

**Watershed Health Data**:
```
Washington Department of Ecology. (2021). Watershed Health Monitoring Program Results. 
Retrieved from https://ecology.wa.gov/research-data/monitoring-assessment
```

---

## Data Limitations

1. **Population Data**
   - Annual counts (not real-time)
   - Some populations have limited monitoring
   - Escapement may be underestimated in certain rivers

2. **Watershed Health**
   - Monitoring every 4 years (not continuous)
   - Limited spatial coverage
   - Difficult to attribute causality

3. **Habitat Data**
   - Critical habitat designations static
   - Actual habitat conditions change
   - Fish passage barriers inventory incomplete

---

## Contact Information

**WDFW Salmon Recovery**
- Email: anadromous.fish@dfw.wa.gov
- Phone: (360) 902-2200
- Web: https://wdfw.wa.gov

**Puget Sound Partnership**
- Web: https://www.psp.wa.gov
- Contact: https://www.psp.wa.gov/contact.php

**Washington Department of Ecology**
- Water Quality Program: (360) 407-6600
- Monitoring Data: https://ecology.wa.gov/research-data

---

**Last Updated**: January 23, 2026
**Data Verified**: January 2026
