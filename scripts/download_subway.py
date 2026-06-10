import urllib.request
import json

lines_url = "https://data.cityofnewyork.us/api/geospatial/3qz8-muuu?method=export&format=GeoJSON"
stations_url = "https://data.cityofnewyork.us/api/geospatial/kk4q-3rt2?method=export&format=GeoJSON"

try:
    with urllib.request.urlopen(lines_url) as response:
        data = json.loads(response.read().decode())
        with open("public/subway-lines.geojson", "w") as f:
            json.dump(data, f)
    print("Lines downloaded")
except Exception as e:
    print("Lines failed:", e)

try:
    with urllib.request.urlopen(stations_url) as response:
        data = json.loads(response.read().decode())
        with open("public/subway-stations.geojson", "w") as f:
            json.dump(data, f)
    print("Stations downloaded")
except Exception as e:
    print("Stations failed:", e)
