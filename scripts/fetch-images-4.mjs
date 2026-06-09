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

const userAgents = [
  'WanderAppLocalBuild/1.2 (Contact: user@example.com)',
  'MyCoolApp/3.0 (Mozilla compatible)',
  'ImageFetcher/2.0',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15'
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchFromCommons(query, placeName, results, uniqueHashes, targetCount = 4) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&gsrlimit=30&prop=imageinfo&iiprop=url|sha1&iiurlwidth=1024&format=json&origin=*`;
  
  try {
    const res = await fetch(url, { headers: { 'User-Agent': userAgents[0] } });
    if (!res.ok) return;
    const parsed = await res.json();
    if (!parsed.query || !parsed.query.pages) return;
    
    const pages = Object.values(parsed.query.pages).sort((a, b) => a.index - b.index);
    
    for (const page of pages) {
      if (results.length >= targetCount) break;
      const imageInfo = page.imageinfo?.[0];
      if (imageInfo?.thumburl && imageInfo?.sha1 && !uniqueHashes.has(imageInfo.sha1)) {
        // Also check if the URL looks like a duplicate (sometimes identical images have different sha1 due to metadata)
        if ([...uniqueHashes].some(h => h.includes(imageInfo.thumburl.split('/').pop().slice(0, 10)))) continue;
        
        uniqueHashes.add(imageInfo.sha1);
        uniqueHashes.add(imageInfo.thumburl); // add url as well to prevent dupes
        
        const ext = '.jpg';
        const safeName = placeName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safeName}_${Math.floor(Math.random()*10000)}${ext}`;
        const filepath = path.join(outDir, filename);
        
        let downloaded = false;
        let retries = 3;
        while (!downloaded && retries > 0) {
          try {
            console.log(`Downloading ${filename}...`);
            const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
            const imgRes = await fetch(imageInfo.thumburl, {
              headers: { 'User-Agent': ua, 'Accept': 'image/*,*/*;q=0.8', 'Referer': 'https://commons.wikimedia.org/' }
            });
            
            if (imgRes.ok) {
              const buffer = await imgRes.arrayBuffer();
              fs.writeFileSync(filepath, Buffer.from(buffer));
              downloaded = true;
              await sleep(1000); 
            } else {
              retries--;
              await sleep(2000);
            }
          } catch (err) {
            retries--;
            await sleep(2000);
          }
        }
        
        if (downloaded) {
          results.push({
            url: `/places/${filename}`,
            thumb: `/places/${filename}`,
            title: page.title.replace('File:', '').replace(/\.[^/.]+$/, '')
          });
        }
      }
    }
  } catch (e) {
    console.error(`Error querying commons for ${query}:`, e.message);
  }
}

async function fetchPlace(placeName, existingImages) {
  let results = [...existingImages];
  const uniqueHashes = new Set(existingImages.map(img => img.url));

  let query = placeName;
  if (query.includes('(')) {
    query = query.split('(')[0].trim();
  }
  query = query.replace(/'/g, '');
  query = `New York ${query}`;

  if (placeName.includes("Misa góspel")) query = "Abyssinian Baptist Church Harlem";
  if (placeName.includes("Soul food (Sylvia")) query = "Sylvia's Restaurant Harlem";
  if (placeName === "Charging Bull") query = "Charging Bull Wall Street";
  if (placeName === "Chelsea Market") query = "Chelsea Market New York";
  if (placeName === "Little Island") query = "Little Island New York";

  await fetchFromCommons(query, placeName, results, uniqueHashes, 4);

  if (results.length < 4) {
    await fetchFromCommons(placeName, placeName, results, uniqueHashes, 4);
  }

  // If STILL less than 4, find a generic photo but use a unique query per place so they aren't completely identical
  if (results.length < 4) {
    const genericQueries = [
      `New York City architecture`,
      `New York City street`,
      `Manhattan skyline`,
      `New York City landmark`
    ];
    for (let gq of genericQueries) {
      if (results.length >= 4) break;
      await fetchFromCommons(gq, placeName, results, uniqueHashes, 4);
    }
  }

  return results.slice(0, 4);
}

async function main() {
  for (const place of uniquePlaces) {
    if (!imagesDb[place]) imagesDb[place] = [];
    
    // Check for identical files based on title
    const seenTitles = new Set();
    imagesDb[place] = imagesDb[place].filter(img => {
      const isDupe = seenTitles.has(img.title);
      seenTitles.add(img.title);
      const p = path.join(process.cwd(), 'public', img.url);
      return !isDupe && fs.existsSync(p) && fs.statSync(p).size > 1000;
    });

    if (imagesDb[place].length < 4) {
      console.log(`Processing ${place}... (${imagesDb[place].length}/4)`);
      const updatedImages = await fetchPlace(place, imagesDb[place]);
      
      imagesDb[place] = updatedImages;
      fs.writeFileSync(jsonPath, JSON.stringify(imagesDb, null, 2));
      await sleep(500);
    }
  }
  console.log('All done!');
}

main();
