// Sample data - you'll load real WDFW data later
const populationData = {
  years: [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 
          2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024],
  counts: [1850, 1720, 1950, 1680, 1520, 1450, 1380, 1290, 1410, 1240,
           1180, 1050, 980, 875, 920, 845, 780, 710, 745, 432]
};

// Initialize Leaflet map
const map = L.map('map').setView([48.35, -122.15], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// Add Skagit River (sample GeoJSON - replace with real data)
const skagitRiver = {
  "type": "FeatureCollection",
  "features": [{
    "type": "Feature",
    "properties": {"name": "Skagit River Watershed"},
    "geometry": {
      "type": "Polygon",
      "coordinates": [[
        [-122.30, 48.50], [-122.10, 48.45], [-121.95, 48.25],
        [-122.05, 48.10], [-122.25, 48.15], [-122.30, 48.50]
      ]]
    }
  }]
};

L.geoJSON(skagitRiver, {
  style: {
    color: '#1a5f7a',
    weight: 3,
    opacity: 0.8,
    fillOpacity: 0.2,
    fillColor: '#2ecc71'
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup('<strong>' + feature.properties.name + '</strong><br>ESA-listed threatened species');
  }
}).addTo(map);

// Add sample spawning habitat zones
const habitatZones = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {"name": "Upper Skagit", "suitability": "optimal"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-122.05, 48.40], [-122.00, 48.38], [-121.98, 48.30],
          [-122.03, 48.28], [-122.05, 48.40]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {"name": "Sauk River Confluence", "suitability": "marginal"},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-122.15, 48.32], [-122.10, 48.30], [-122.08, 48.22],
          [-122.13, 48.20], [-122.15, 48.32]
        ]]
      }
    }
  ]
};

function getHabitatColor(suitability) {
  if (suitability === 'optimal') return '#2ecc71';
  if (suitability === 'marginal') return '#f39c12';
  return '#e74c3c';
}

L.geoJSON(habitatZones, {
  style: function(feature) {
    return {
      color: getHabitatColor(feature.properties.suitability),
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.4
    };
  },
  onEachFeature: function(feature, layer) {
    layer.bindPopup(
      '<strong>' + feature.properties.name + '</strong><br>' +
      'Suitability: ' + feature.properties.suitability
    );
  }
}).addTo(map);

// Add legend
const legend = L.control({position: 'bottomright'});
legend.onAdd = function(map) {
  const div = L.DomUtil.create('div', 'info');
  div.style.background = 'white';
  div.style.padding = '10px';
  div.style.borderRadius = '5px';
  div.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
  div.innerHTML = `
    <h4 style="margin: 0 0 10px 0; color: #1a5f7a;">Spawning Habitat</h4>
    <p style="margin: 5px 0;"><i style="background: #2ecc71; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Optimal</p>
    <p style="margin: 5px 0;"><i style="background: #f39c12; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Marginal</p>
    <p style="margin: 5px 0;"><i style="background: #e74c3c; width: 18px; height: 18px; display: inline-block; border-radius: 3px;"></i> Unsuitable</p>
  `;
  return div;
};
legend.addTo(map);

// Population status update
const latestYear = populationData.years[populationData.years.length - 1];
const latestCount = populationData.counts[populationData.counts.length - 1];
const previousCount = populationData.counts[populationData.counts.length - 2];
const change = latestCount - previousCount;
const percentChange = ((change / previousCount) * 100).toFixed(1);

document.getElementById('status-content').innerHTML = `
  <p><strong>Current Year:</strong> ${latestYear}</p>
  <p><strong>Spawning Count:</strong> ${latestCount}</p>
  <p><strong>10-Year Average:</strong> ${Math.round(populationData.counts.slice(-10).reduce((a,b) => a+b) / 10)}</p>
  <p style="color: ${change < 0 ? '#e74c3c' : '#2ecc71'};">
    <strong>Change from ${latestYear - 1}:</strong> ${change > 0 ? '+' : ''}${change} (${percentChange}%)
  </p>
  <p style="font-size: 0.85rem; margin-top: 0.75rem; color: #666;">
    ⚠️ <strong>Critical:</strong> Populations remain well below recovery goals
  </p>
`;

// Create population trend chart
const ctx = document.getElementById('populationChart').getContext('2d');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: populationData.years,
    datasets: [{
      label: 'Spawning Count',
      data: populationData.counts,
      borderColor: '#1a5f7a',
      backgroundColor: 'rgba(26, 95, 122, 0.1)',
      borderWidth: 2,
      tension: 0.3,
      pointRadius: 3,
      pointBackgroundColor: '#1a5f7a'
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#666'
        },
        grid: {
          color: 'rgba(0,0,0,0.05)'
        }
      },
      x: {
        ticks: {
          color: '#666'
        },
        grid: {
          display: false
        }
      }
    }
  }
});
