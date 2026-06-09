import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'public', 'places');
const jsonPath = path.join(outDir, 'images.json');
let imagesDb = {};
if (fs.existsSync(jsonPath)) {
  imagesDb = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

const itineraryPath = path.join(process.cwd(), 'src', 'data', 'itinerary.ts');
const code = fs.readFileSync(itineraryPath, 'utf8');

const nameRegex = /name:\s*["']([^"']+)["']/g;
const placeNames = [];
let match;
while ((match = nameRegex.exec(code)) !== null) {
  placeNames.push(match[1]);
}
const uniquePlaces = [...new Set(placeNames)];

async function fetchPlace(placeName) {
  const query = encodeURIComponent(`New York ${placeName}`);
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url|sha1&iiurlwidth=1024&format=json&origin=*`;
  
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'WanderAppLocalBuild/1.0' } });
    if (!res.ok) return null;
    const parsed = await res.json();
    if (!parsed.query || !parsed.query.pages) return [];
    
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
        
        if (!fs.existsSync(filepath) || fs.statSync(filepath).size < 1000) {
          console.log(`Downloading ${filename}...`);
          const imgRes = await fetch(imageInfo.thumburl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
              'Referer': 'https://commons.wikimedia.org/'
            }
          });
          
          if (!imgRes.ok) {
            console.log(`Failed HTTP ${imgRes.status}`);
            continue;
          }
          
          const buffer = await imgRes.arrayBuffer();
          fs.writeFileSync(filepath, Buffer.from(buffer));
          await new Promise(r => setTimeout(r, 1000)); // Sleep 1s after download
        }
        
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
    return null;
  }
}

async function main() {
  for (const place of uniquePlaces) {
    if (!imagesDb[place] || imagesDb[place].length === 0) {
      console.log(`Fetching missing ${place}...`);
      const images = await fetchPlace(place);
      if (images) {
        imagesDb[place] = images;
        fs.writeFileSync(jsonPath, JSON.stringify(imagesDb, null, 2));
      }
      await new Promise(r => setTimeout(r, 1500)); // Sleep 1.5s between API calls to avoid 429
    }
  }
  console.log('All done!');
}

main();
