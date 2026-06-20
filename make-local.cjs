const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const dataPath = 'public/places/images.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function downloadImage(url, dest, retryCount = 0) {
  if (!url.startsWith('http')) return true;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://commons.wikimedia.org/'
      }
    });

    if (response.status === 429 && retryCount < 3) {
      console.log(`Rate limited on ${url}, waiting 5s...`);
      await sleep(5000);
      return downloadImage(url, dest, retryCount + 1);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    const fileStream = fs.createWriteStream(dest, { flags: 'w' });
    await finished(Readable.fromWeb(response.body).pipe(fileStream));
    return true;
  } catch (error) {
    if (retryCount < 3) {
      console.log(`Network error on ${url}, waiting 3s...`);
      await sleep(3000);
      return downloadImage(url, dest, retryCount + 1);
    }
    console.error(`Giving up on ${url}: ${error.message}`);
    return false;
  }
}

async function main() {
  const publicPlacesDir = path.join(__dirname, 'public', 'places');
  if (!fs.existsSync(publicPlacesDir)) {
    fs.mkdirSync(publicPlacesDir, { recursive: true });
  }

  let downloadedCount = 0;
  
  for (const [placeName, images] of Object.entries(data)) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.url.startsWith('http')) {
        const safePlaceName = placeName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safePlaceName}_${i + 1}.jpg`;
        const dest = path.join(publicPlacesDir, filename);
        
        console.log(`Downloading ${filename} for ${placeName}...`);
        
        const success = await downloadImage(img.url, dest);
        if (success) {
          img.url = `/places/${filename}`;
          img.thumb = `/places/${filename}`;
          downloadedCount++;
        }
        
        // Wait 1.5s between downloads to be very gentle with Wikimedia servers
        await sleep(1500);
      }
    }
    // Save progress periodically
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }

  console.log(`Finished! Downloaded ${downloadedCount} images to local storage.`);
}

main();
