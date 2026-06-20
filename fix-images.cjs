const fs = require('fs');

async function fetchWikiImages(query) {
  try {
    // Search for the page title first
    const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json`, {
      headers: { 'User-Agent': 'nyc-tour-planner/1.0' }
    });
    const searchData = await searchRes.json();
    if (!searchData.query || !searchData.query.search.length) return [];
    
    const bestTitle = searchData.query.search[0].title;
    
    // Get images for that page
    const imgRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&generator=images&titles=${encodeURIComponent(bestTitle)}&gimlimit=50&prop=imageinfo&iiprop=url&format=json`, {
      headers: { 'User-Agent': 'nyc-tour-planner/1.0' }
    });
    const imgData = await imgRes.json();
    if (!imgData.query || !imgData.query.pages) return [];
    
    const pages = Object.values(imgData.query.pages);
    const urls = [];
    for (const page of pages) {
      if (page.imageinfo && page.imageinfo[0] && page.imageinfo[0].url) {
        const url = page.imageinfo[0].url;
        if (url.toLowerCase().endsWith('.jpg') && !url.toLowerCase().includes('logo') && !url.toLowerCase().includes('icon')) {
          urls.push({
            url,
            title: page.title.replace('File:', '')
          });
        }
      }
    }
    return urls;
  } catch (e) {
    console.error('Error fetching wiki images for', query, e);
    return [];
  }
}

async function main() {
  const data = JSON.parse(fs.readFileSync('public/places/images.json', 'utf-8'));
  let fixedCount = 0;

  for (const [placeName, images] of Object.entries(data)) {
    // Replace completely for Friends
    if (placeName === 'Edificio de Friends' || placeName === 'Friends Experience') {
      const newImages = await fetchWikiImages(placeName === 'Edificio de Friends' ? '90 Bedford Street' : 'Friends (sitcom)');
      if (newImages.length >= 4) {
        data[placeName] = newImages.slice(0, 4).map(img => ({
          url: img.url,
          thumb: img.url,
          title: img.title
        }));
        fixedCount++;
        console.log(`Replaced all for ${placeName}`);
      }
      continue;
    }

    // Check for duplicates
    let duplicateIndex = -1;
    const seen = new Set();
    for (let i = 0; i < images.length; i++) {
      if (seen.has(images[i].title)) {
        duplicateIndex = i;
        break;
      }
      seen.add(images[i].title);
    }

    if (duplicateIndex !== -1) {
      const newImages = await fetchWikiImages(placeName);
      // Find an image that we don't already have
      const existingTitles = new Set(images.map(img => img.title));
      const freshImage = newImages.find(img => !existingTitles.has(img.title));
      
      if (freshImage) {
        data[placeName][duplicateIndex] = {
          url: freshImage.url,
          thumb: freshImage.url,
          title: freshImage.title
        };
        fixedCount++;
        console.log(`Fixed duplicate for ${placeName}`);
      } else {
        console.log(`Could not find fresh image for ${placeName}`);
        // Remove the duplicate so it's a 3-image gallery instead of repeating
        data[placeName].splice(duplicateIndex, 1);
        fixedCount++;
      }
    }
  }

  fs.writeFileSync('public/places/images.json', JSON.stringify(data, null, 2));
  console.log(`Finished fixing ${fixedCount} places.`);
}

main();
