import json
import re

with open('public/subway-stations.geojson', 'r', encoding='utf-8') as f:
    data = json.load(f)

clean_features = []
for f in data['features']:
    desc = f['properties'].get('description', '')
    
    # Extract NAME
    name_match = re.search(r'atr-name">NAME</span>:</strong> <span class="atr-value">([^<]+)</span>', desc)
    name = name_match.group(1) if name_match else "Unknown"
    
    # Extract LINE
    line_match = re.search(r'atr-name">LINE</span>:</strong> <span class="atr-value">([^<]+)</span>', desc)
    line = line_match.group(1) if line_match else "Unknown"
    
    f['properties'] = {
        'name': name,
        'line': line
    }
    clean_features.append(f)

data['features'] = clean_features

with open('public/subway-stations-clean.geojson', 'w', encoding='utf-8') as f:
    json.dump(data, f, separators=(',', ':'))
print("Done. Cleaned", len(clean_features), "stations.")
