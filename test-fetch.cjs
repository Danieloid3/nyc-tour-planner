const fs = require('fs');

async function fetchAccurateImages(query) {
  try {
    // Search Wikimedia Commons directly for files matching the query
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&utf8=&format=json`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'nyc-tour-planner/2.0' }
    });
    const searchData = await searchRes.json();
    if (!searchData.query || !searchData.query.search.length) return [];
    
    // Filter out images that are likely "views from" or irrelevant
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
               (lower.endsWith('.jpg') || lower.endsWith('.jpeg'));
      })
      .slice(0, 4);

    if (validTitles.length === 0) return [];

    // Now fetch the actual URLs for these titles
    const titlesParam = validTitles.map(t => encodeURIComponent(t)).join('|');
    const imgUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${titlesParam}&prop=imageinfo&iiprop=url&format=json`;
    const imgRes = await fetch(imgUrl, {
      headers: { 'User-Agent': 'nyc-tour-planner/2.0' }
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

async function test() {
  const imgs = await fetchAccurateImages('SUMMIT One Vanderbilt');
  console.log('SUMMIT:', imgs);
  
  const imgs2 = await fetchAccurateImages('Grand Central Terminal');
  console.log('Grand Central:', imgs2);
}

test();
