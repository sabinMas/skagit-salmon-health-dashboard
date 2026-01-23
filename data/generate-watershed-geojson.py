"""
Script to generate a GeoJSON file with polygon outlines for Puget Sound
watersheds used in the Puget Salmon Health dashboard.

This script queries the Washington Department of Ecology hosted feature
service that provides Water Resource Inventory Areas (WRIAs) at a
1:24,000 scale. Each watershed in the dashboard corresponds to one or
more WRIA numbers defined by the state. The script downloads the
polygons for each relevant WRIA, merges them into a single (multiâ€‘)
polygon per watershed, and writes the results to
``data/puget-sound-watersheds.geojson``.

Usage:
    python generate_watershed_geojson.py

Requirements:
    - Python 3.8+
    - requests (`pip install requests`)

Note:
    This script must be executed in an environment with internet
    access. The container environment used by ChatGPT does not have
    outgoing network access, so the script is provided here as a
    reference for local execution. When run locally, it will download
    the latest WRIA boundaries and build the GeoJSON file.
"""

import json
import os
from typing import Dict, List

import requests

BASE_URL = (
    "https://services.arcgis.com/6lCKYNJLvwTXqrmp/arcgis/rest/services/ECY/FeatureServer/11/query"
)

# Mapping of dashboard watershed names to the WRIA numbers that define them.
WATERSHED_TO_WRIAS: Dict[str, List[int]] = {
    # Skagit River watershed is comprised of the Lower Skagitâ€“Samish (WRIA 3)
    # and Upper Skagit (WRIA 4) inventory areas.
    "Skagit River": [3, 4],
    # The other watersheds map directly to a single WRIA number.
    "Stillaguamish River": [5],
    "Snohomish River": [7],
    "Cedar-Sammamish River": [8],
    "Duwamish River": [9],
    "Puyallup-White River": [10],
}


def fetch_wrial_geometries(wria_numbers: List[int]) -> List[List[List[List[float]]]]:
    """Download polygon coordinates for the given WRIA numbers.

    Parameters
    ----------
    wria_numbers : List[int]
        One or more WRIA_NR values to retrieve from the service.

    Returns
    -------
    List[List[List[List[float]]]]
        A list of polygon coordinate arrays. Each polygon coordinate
        array is a list of rings, where the outer ring is the first
        element. The returned polygons have latitude/longitude
        coordinates (EPSG:4326) and are rounded to 5 decimal places to
        control file size without significantly degrading shape
        fidelity.
    """
    query = f"WRIA_NR in ({','.join(str(n) for n in wria_numbers)})"
    params = {
        "where": query,
        "outFields": "WRIA_NR,WRIA_NM",
        "outSR": "4326",
        # The geometryPrecision parameter reduces the number of decimal
        # places returned for coordinates. A precision of 5 provides
        # roughly 1.1 m (3.6 ft) resolution, which is sufficient for
        # watershed boundaries drawn at map scales used in the dashboard.
        "geometryPrecision": 5,
        "f": "geojson",
    }
    response = requests.get(BASE_URL, params=params)
    response.raise_for_status()
    data = response.json()

    polygons: List[List[List[List[float]]]] = []
    for feature in data.get("features", []):
        geom = feature.get("geometry")
        if not geom:
            continue
        if geom["type"] == "Polygon":
            # Polygon geometries are represented as a list of rings.
            polygons.append(geom["coordinates"])
        elif geom["type"] == "MultiPolygon":
            # Flatten MultiPolygon into a list of rings.
            polygons.extend(geom["coordinates"])
        else:
            raise ValueError(f"Unexpected geometry type: {geom['type']}")
    return polygons


def build_feature(name: str, wria_numbers: List[int]) -> Dict:
    """Build a GeoJSON feature for the given watershed.

    Parameters
    ----------
    name : str
        Watershed name matching the CSV data file (e.g. "Skagit River").
    wria_numbers : List[int]
        List of WRIA numbers that make up the watershed.

    Returns
    -------
    Dict
        A GeoJSON feature with merged geometry and a name property.
    """
    polygons = fetch_wrial_geometries(wria_numbers)
    if not polygons:
        raise RuntimeError(f"No geometry returned for WRIA numbers {wria_numbers}")
    # If the watershed consists of multiple polygons, create a MultiPolygon;
    # otherwise, create a simple Polygon.
    if len(polygons) == 1:
        geometry = {
            "type": "Polygon",
            "coordinates": polygons[0],
        }
    else:
        geometry = {
            "type": "MultiPolygon",
            "coordinates": polygons,
        }
    return {
        "type": "Feature",
        "properties": {
            "name": name,
        },
        "geometry": geometry,
    }


def build_watershed_collection() -> Dict:
    """Construct a FeatureCollection for all Puget Sound watersheds in the dashboard."""
    features = []
    for watershed, wrias in WATERSHED_TO_WRIAS.items():
        print(f"Downloading geometry for {watershed} (WRIA {wrias})...")
        feature = build_feature(watershed, wrias)
        features.append(feature)
    return {
        "type": "FeatureCollection",
        "features": features,
    }


def main() -> None:
    # Ensure the output directory exists.
    out_dir = os.path.join(os.path.dirname(__file__), "data")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "puget-sound-watersheds.geojson")

    feature_collection = build_watershed_collection()
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(feature_collection, f, ensure_ascii=False, indent=2)
    print(f"GeoJSON saved to {out_path}")


if __name__ == "__main__":
    main()
