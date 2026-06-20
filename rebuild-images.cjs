const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const MAPPING = {
  "Grand Central Terminal": "Grand Central Terminal",
  "SUMMIT One Vanderbilt": "One Vanderbilt",
  "Biblioteca Pública de Nueva York": "New York Public Library Main Branch",
  "Bryant Park": "Bryant Park",
  "5th Avenue": "Fifth Avenue",
  "Catedral de St. Patrick": "St. Patrick's Cathedral (Manhattan)",
  "Rockefeller Center": "Rockefeller Center",
  "Top of the Rock": "30 Rockefeller Plaza",
  "Times Square": "Times Square",
  "Koreatown": "Koreatown, Manhattan",
  "Empire State Building": "Empire State Building",
  "Madison Square Garden": "Madison Square Garden",
  "Fulton Street": "Fulton Center",
  "Oculus": "World Trade Center station (PATH)",
  "9/11 Memorial": "National September 11 Memorial & Museum",
  "Museo 9/11": "National September 11 Memorial & Museum",
  "Trinity Church": "Trinity Church (Manhattan)",
  "Wall Street": "Wall Street",
  "Federal Hall": "Federal Hall",
  "Bolsa de Nueva York": "New York Stock Exchange Building",
  "Charging Bull": "Charging Bull",
  "Stone Street": "Stone Street (Manhattan)",
  "Battery Park": "The Battery (Manhattan)",
  "Battery Park City": "Battery Park City",
  "Bowling Green": "Bowling Green (New York City)",
  "Staten Island Ferry": "Staten Island Ferry",
  "St. George Terminal": "St. George Terminal",
  "Empire Outlets": "Empire Outlets",
  "Puente de Brooklyn": "Brooklyn Bridge",
  "DUMBO": "Dumbo, Brooklyn",
  "Washington Street": "Manhattan Bridge",
  "Pebble Beach (Brooklyn Bridge Park)": "Brooklyn Bridge Park",
  "Jane's Carousel": "Jane's Carousel",
  "Chinatown": "Chinatown, Manhattan",
  "Little Italy": "Little Italy, Manhattan",
  "SoHo": "SoHo, Manhattan",
  "Nolita": "Nolita",
  "The Pond": "The Pond (Central Park)",
  "Bethesda Terrace": "Bethesda Terrace and Fountain",
  "Bow Bridge": "Bow Bridge (Central Park)",
  "Strawberry Fields": "Strawberry Fields (memorial)",
  "The Mall": "The Mall (Central Park)",
  "Central Park Zoo": "Central Park Zoo",
  "Museo de Historia Natural": "American Museum of Natural History",
  "Upper West Side": "Upper West Side",
  "Roosevelt Island Tramway": "Roosevelt Island Tramway",
  "Roosevelt Island": "Roosevelt Island",
  "Southpoint Park": "Franklin D. Roosevelt Four Freedoms Park",
  "Smallpox Hospital": "Smallpox Hospital",
  "Bloomingdale's": "Bloomingdale's",
  "Upper East Side": "Upper East Side",
  "The Met": "Metropolitan Museum of Art",
  "MoMA": "Museum of Modern Art",
  "Guggenheim": "Solomon R. Guggenheim Museum",
  "Museum Mile": "Museum Mile, New York City",
  "Chelsea Market": "Chelsea Market",
  "High Line": "High Line",
  "Little Island": "Little Island at Pier 55",
  "Hudson Yards": "Hudson Yards, Manhattan",
  "Vessel": "Vessel (structure)",
  "Edge": "Edge (observation deck)",
  "Friends Experience": "Friends",
  "West Village": "West Village",
  "Edificio de Friends": "Friends",
  "Harlem": "Harlem",
  "Misa góspel (Abyssinian Baptist)": "Abyssinian Baptist Church",
  "Soul food (Sylvia's)": "Sylvia's Restaurant of Harlem",
  "Apollo Theater": "Apollo Theater",
  "Herald Square": "Herald Square",
  "Macy's": "Macy's Herald Square",
  "Century 21": "Century 21 (department store)",
  "Jersey Gardens": "The Mills at Jersey Gardens",
  "Woodbury Common": "Woodbury Common Premium Outlets",
  "Stamford Train Station": "Stamford Transportation Center",
  "Stamford": "Stamford, Connecticut",
  "Cove Island Park": "Cove Island Park",
  "Niagara Falls State Park": "Niagara Falls State Park",
  "American Falls": "American Falls",
  "Bridal Veil Falls": "Bridal Veil Falls (Niagara Falls)",
  "Horseshoe Falls": "Horseshoe Falls"
};

const imagesJsonPath = 'public/places/images.json';
const placesDir = path.join(__dirname, 'public', 'places');

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function getWikipediaImages(title) {
  if (title === "Friends") {
    return [
      "https://upload.wikimedia.org/wikipedia/commons/1/17/The_Friends_Apartment_%2822940041969%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/NYC_Friends_Apartment_Building_%2822499701821%29.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Friends_Apartment%2C_New_York_%28869395563%29.jpg"
    ];
  }

  const url = `https://en.wikipedia.org/api/rest_v1/page/media-list/${encodeURIComponent(title)}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'NYC-Tour-Planner/1.0' } });
    if (!res.ok) return [];
    const data = await res.json();
    const images = [];
    for (const item of data.items) {
      if (item.type === 'image' && item.srcset && item.srcset.length > 0) {
        // Find best thumbnail size (closest to 600-800px)
        const srcs = item.srcset.map(s => {
          const parts = s.src.split(' ');
          const url = parts[0];
          const widthMatch = parts.length > 1 ? parts[1].match(/(\d+)x/) : null;
          const w = widthMatch ? parseInt(widthMatch[1]) : 800;
          return { url: url.startsWith('//') ? 'https:' + url : url, w };
        });
        srcs.sort((a, b) => b.w - a.w);
        const best = srcs.find(s => s.w >= 600 && s.w <= 1200) || srcs[0];
        
        // Exclude svgs, logos, maps
        const titleLower = item.title.toLowerCase();
        if (!titleLower.endsWith('.svg') && !titleLower.includes('logo') && !titleLower.includes('map')) {
          images.push(best.url);
          if (images.length >= 4) break;
        }
      }
    }
    return images;
  } catch (e) {
    console.error(`Failed to fetch for ${title}: ${e.message}`);
    return [];
  }
}

async function downloadImage(url, destPath) {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NYC-Tour-Planner/1.0',
          'Referer': 'https://en.wikipedia.org/'
        }
      });
      if (res.status === 429) {
        await sleep(5000);
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const fileStream = fs.createWriteStream(destPath);
      await finished(Readable.fromWeb(res.body).pipe(fileStream));
      return true;
    } catch (e) {
      await sleep(2000);
    }
  }
  return false;
}

async function main() {
  if (!fs.existsSync(placesDir)) fs.mkdirSync(placesDir, { recursive: true });
  
  // Clean all old images
  const files = fs.readdirSync(placesDir);
  for (const f of files) {
    if (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')) {
      fs.unlinkSync(path.join(placesDir, f));
    }
  }

  const result = {};

  for (const [placeName, wikiTitle] of Object.entries(MAPPING)) {
    console.log(`Processing ${placeName} -> ${wikiTitle}`);
    const urls = await getWikipediaImages(wikiTitle);
    
    const placeImages = [];
    let count = 1;
    for (const url of urls) {
      const safeName = placeName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const ext = url.split('.').pop().split('?')[0].toLowerCase() || 'jpg';
      const filename = `${safeName}_${count}.${ext}`;
      const destPath = path.join(placesDir, filename);
      
      console.log(`  Downloading ${filename}...`);
      const success = await downloadImage(url, destPath);
      if (success) {
        placeImages.push({
          url: `/places/${filename}`,
          thumb: `/places/${filename}`,
          title: filename
        });
        count++;
      }
      await sleep(500); // polite delay
    }
    
    if (placeImages.length > 0) {
      result[placeName] = placeImages;
    } else {
      console.log(`  WARNING: No images found for ${placeName}`);
    }
  }

  fs.writeFileSync(imagesJsonPath, JSON.stringify(result, null, 2));
  console.log('All done! images.json updated.');
}

main().catch(console.error);
