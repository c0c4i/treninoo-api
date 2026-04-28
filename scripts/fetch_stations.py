#!/usr/bin/env python3
"""
Fetches ALL Italian train stations with coordinates from the ViaggiaTreno API.
Outputs assets/data/stations_coordinates.json

Usage:
    python3 scripts/fetch_stations.py
"""

import json
import time
import urllib.request
import urllib.error
import sys
import os

VIAGGIATRENO_BASE = "http://www.viaggiatreno.it/infomobilita/resteasy/viaggiatreno"

# Italian region codes used by ViaggiaTreno (1-22, some may not exist)
REGION_CODES = list(range(0, 23))


def fetch_json(url, retries=3):
    """Fetch JSON from a URL with retries."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read().decode("utf-8")
                return json.loads(data)
        except (urllib.error.URLError, json.JSONDecodeError, Exception) as e:
            if attempt < retries - 1:
                time.sleep(1)
            else:
                print(f"  Failed to fetch {url}: {e}", file=sys.stderr)
                return None


def fetch_stations_by_region(region_code):
    """Fetch all stations for a given region code."""
    url = f"{VIAGGIATRENO_BASE}/elencoStazioni/{region_code}"
    return fetch_json(url)


def main():
    all_stations = {}  # stationCode -> station dict (dedup by code)

    print("Fetching stations from all Italian regions...")
    for region in REGION_CODES:
        stations = fetch_stations_by_region(region)
        if stations is None:
            print(f"  Region {region}: skipped (no data)")
            continue

        count = 0
        for s in stations:
            code = s.get("codiceStazione") or s.get("codStazione")
            name = s.get("localita", {}).get("nomeLungo") or s.get(
                "nomeStazione") or s.get("nomeLungo")
            lat = s.get("lat")
            lng = s.get("lon")

            if not code or not name:
                continue
            if lat is None or lng is None:
                continue
            if lat == 0 and lng == 0:
                continue

            # Normalize code (ViaggiaTreno uses S + digits)
            code = code.strip()
            name = name.strip()

            if code not in all_stations:
                all_stations[code] = {
                    "stationName": name,
                    "stationCode": code,
                    "lat": round(lat, 6),
                    "lng": round(lng, 6),
                }
                count += 1

        print(
            f"  Region {region}: {count} new stations (total so far: {len(all_stations)})")
        time.sleep(0.3)  # be polite to the API

    # Sort by station name
    sorted_stations = sorted(all_stations.values(),
                             key=lambda s: s["stationName"])

    # Write output
    import csv
    
    output_path = os.path.join(
        os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
        "assets", "data", "stations_coordinates.csv"
    )
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, "w", encoding="utf-8", newline='') as f:
        writer = csv.writer(f, delimiter='\t')
        writer.writerow(['stationCode', 'stationName', 'lat', 'lng'])
        for s in sorted_stations:
            writer.writerow([s["stationCode"], s["stationName"], s["lat"], s["lng"]])

    print(f"\nDone! Wrote {len(sorted_stations)} stations to {output_path}")


if __name__ == "__main__":
    main()
