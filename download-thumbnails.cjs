const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

const dataPath = 'public/places/images.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Escapes the string for URL
function getFilenameFromUrl(url) {
  // e.g. https://upload.wikimedia.org/wikipedia/commons/7/71/Image-Grand_central_Station_Outside_Night_2.jpg
  const parts = url.split('/');
  return decodeURIComponent(parts[parts.length - 1]);
}

async function getThumbnailUrl(filename) {
  try {
    const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
    const res = await fetch(apiUrl, {
      headers: { 'User-Agent': 'NYC-Tour-Planner/1.0 (Local-PWA-Downloader)' }
    });
    const json = await res.json();
    const pages = json.query.pages;
    const pageId = Object.keys(pages)[0];
    
    const imageinfo = pages[pageId].imageinfo;
    if (imageinfo && imageinfo.length > 0) {
      return imageinfo[0].thumburl || imageinfo[0].url;
    }
    return null;
  } catch (err) {
    console.error(`Error getting thumbnail info for ${filename}:`, err.message);
    return null;
  }
}

async function downloadImage(url, dest, retryCount = 0) {
  if (!url) return false;
  if (!url.startsWith('http')) return true;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NYC-Tour-Planner/1.0',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://en.wikipedia.org/'
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
    
    // Check file size
    const stats = fs.statSync(dest);
    if (stats.size < 500) {
      throw new Error(`Downloaded file is too small (${stats.size} bytes), probably an error page.`);
    }
    
    return true;
  } catch (error) {
    if (retryCount < 3) {
      console.log(`Network error on ${url}, waiting 3s...`);
      await sleep(3000);
      return downloadImage(url, dest, retryCount + 1);
    }
    console.error(`Giving up on ${url}: ${error.message}`);
    // Clean up corrupted file
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    return false;
  }
}

async function main() {
  const publicPlacesDir = path.join(__dirname, 'public', 'places');
  if (!fs.existsSync(publicPlacesDir)) {
    fs.mkdirSync(publicPlacesDir, { recursive: true });
  }

  let downloadedCount = 0;
  let errorCount = 0;
  
  for (const [placeName, images] of Object.entries(data)) {
    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (img.url.startsWith('http')) {
        const safePlaceName = placeName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${safePlaceName}_${i + 1}.jpg`;
        const dest = path.join(publicPlacesDir, filename);
        
        const originalFilename = getFilenameFromUrl(img.url);
        console.log(`Fetching info for ${originalFilename}...`);
        
        const thumbUrl = await getThumbnailUrl(originalFilename);
        
        console.log(`Downloading ${filename} for ${placeName}...`);
        const success = await downloadImage(thumbUrl || img.url, dest);
        
        if (success) {
          img.url = `/places/${filename}`;
          img.thumb = `/places/${filename}`;
          downloadedCount++;
        } else {
          errorCount++;
        }
        
        // Wait 1.5s between downloads
        await sleep(1500);
      }
    }
    // Save progress periodically
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }

  console.log(`Finished! Downloaded ${downloadedCount} images, ${errorCount} errors.`);
}

main();
