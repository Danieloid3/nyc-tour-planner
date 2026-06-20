const fs = require('fs');

const RATE_LIMIT_DELAY = 1000;
const USER_AGENT = 'nyc-tour-planner/2.0 (contact: test@example.com)';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAccurateImages(query) {
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&utf8=&format=json&srlimit=20`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const searchData = await searchRes.json();
    if (!searchData.query || !searchData.query.search.length) return [];
    
    // Filter out irrelevant images
    const validTitles = searchData.query.search
      .map(s => s.title)
      .filter(t => {
        const lower = t.toLowerCase();
        return !lower.includes('from') && 
               !lower.includes('view of') && 
               !lower.includes('as seen') && 
               !lower.includes('looking at') &&
               !lower.includes('logo') &&
               !lower.includes('icon') &&
               !lower.includes('map') &&
               !lower.includes('flag') &&
               !lower.includes('plan') &&
               !lower.includes('diagram') &&
               (lower.endsWith('.jpg') || lower.endsWith('.jpeg'));
      })
      .slice(0, 4);

    if (validTitles.length === 0) return [];

    const titlesParam = validTitles.map(t => encodeURIComponent(t)).join('|');
    const imgUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&format=json`;
    const imgRes = await fetch(imgUrl, {
      headers: { 'User-Agent': USER_AGENT }
    });
    const imgData = await imgRes.json();
    
    if (!imgData.query || !imgData.query.pages) return [];

    const pages = Object.values(imgData.query.pages);
    const urls = [];
    for (const page of pages) {
      if (page.imageinfo && page.imageinfo[0] && page.imageinfo[0].url) {
        urls.push({
          url: page.imageinfo[0].url,
          thumb: page.imageinfo[0].url,
          title: page.title.replace('File:', '')
        });
      }
    }
    return urls;
  } catch (e) {
    console.error('Error fetching accurate images for', query, e);
    return [];
  }
}

async function main() {
  const dataPath = 'public/places/images.json';
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  let updatedCount = 0;
  
  const places = Object.keys(data);
  for (const placeName of places) {
    console.log(`Processing: ${placeName}`);
    
    // Some mapping for better search
    let searchName = placeName;
    if (placeName === 'Edificio de Friends') searchName = 'Friends Apartment Building 90 Bedford';
    if (placeName === 'Friends Experience') searchName = 'Friends Experience New York';
    if (placeName === 'Biblioteca Pública de Nueva York') searchName = 'New York Public Library Main Branch';
    if (placeName === 'Top of the Rock') searchName = 'Top of the Rock Observation Deck';
    
    const newImages = await fetchAccurateImages(searchName);
    
    if (newImages.length > 0) {
      data[placeName] = newImages;
      updatedCount++;
    } else {
      // Fallback: Try removing "New York" or just trying again with a broader search
      const fallbackImages = await fetchAccurateImages(placeName);
      if (fallbackImages.length > 0) {
        data[placeName] = fallbackImages;
        updatedCount++;
      } else {
        console.log(`⚠️ Could not find better images for ${placeName}, keeping old ones.`);
      }
    }
    
    // Save incrementally
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    
    await delay(RATE_LIMIT_DELAY);
  }
  
  console.log(`Finished! Updated ${updatedCount} out of ${places.length} places.`);
}

main();
