const fs = require('fs');
const data = fs.readFileSync('src/data/itinerary.ts', 'utf8');
const regex = /name:\s*"([^"]+)"/g;
let match;
const names = [];
while ((match = regex.exec(data)) !== null) {
  names.push(match[1]);
}
console.log(JSON.stringify(names, null, 2));
