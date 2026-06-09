
async function test() {
  const query = encodeURIComponent('New York Central Park');
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}&gsrnamespace=6&gsrlimit=8&prop=imageinfo&iiprop=url|sha1&iiurlwidth=1024&format=json&origin=*`;
  const res = await fetch(url, { headers: { 'User-Agent': 'nyc-tour-planner-test/1.0 (daniel@example.com)' }});
  const data = await res.json();
  const pages = data.query.pages;
  console.log(JSON.stringify(Object.values(pages).map(p => p.imageinfo?.[0]), null, 2));
}
test().catch(console.error);
