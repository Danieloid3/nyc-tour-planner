import fs from 'fs';
import path from 'path';

const itineraryPath = path.join(process.cwd(), 'src', 'data', 'itinerary.ts');
const code = fs.readFileSync(itineraryPath, 'utf8');

const nameRegex = /name:\s*["']([^"']+)["']/g;
const placeNames = [];
let match;
while ((match = nameRegex.exec(code)) !== null) {
  placeNames.push(match[1]);
}

const uniquePlaces = [...new Set(placeNames)];
console.log(`Found ${uniquePlaces.length} places to fetch images for.`);

const outDir = path.join(process.cwd(), 'public', 'places');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const imagesDb = {};

async function fetchPlace(placeName) {
  const query = encodeURIComponent(`New York ${placeName}`);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|sha1&iiurlwidth=1024&format=json&origin=*`;
  
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'WanderAppLocalBuild/1.0 (daniel@example.com)'
      }
    });
    
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const parsed = await res.json();
    
    if (!parsed.query || !parsed.query.pages) {
      console.log(`No images found for ${placeName}`);
      return [];
    }
    
    const pages = Object.values(parsed.query.pages).sort((a, b) => a.index - b.index);
    const results = [];
    const uniqueHashes = new Set();
    
    for (const page of pages) {
      const imageInfo = page.imageinfo?.[0];
      if (imageInfo?.thumburl && imageInfo?.sha1 && !uniqueHashes.has(imageInfo.sha1)) {
        uniqueHashes.add(imageInfo.sha1);
        
        const ext = '.jpg';
        const safeName = placeName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeName}_${results.length + 1}${ext}`;
        const filepath = path.join(outDir, filename);
        
        console.log(`Downloading ${filename}...`);
        
        const imgRes = await fetch(imageInfo.thumburl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
            'Referer': 'https://commons.wikimedia.org/'
          }
        });
        
        if (!imgRes.ok) throw new Error(`Failed to download image HTTP ${imgRes.status}`);
        
        const buffer = await imgRes.arrayBuffer();
        fs.writeFileSync(filepath, Buffer.from(buffer));
        
        results.push({
          url: `/places/${filename}`,
          thumb: `/places/${filename}`,
          title: page.title.replace('File:', '').replace(/\.[^/.]+$/, '')
        });
        
        if (results.length >= 2) break;
      }
    }
    return results;
  } catch (e) {
    console.error(`Error processing ${placeName}:`, e.message);
    return [];
  }
}

async function main() {
  for (const place of uniquePlaces) {
    console.log(`Fetching ${place}...`);
    const images = await fetchPlace(place);
    imagesDb[place] = images;
    // Sleep a bit to avoid rate limiting
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(path.join(outDir, 'images.json'), JSON.stringify(imagesDb, null, 2));
  console.log('Done!');
}

main();
