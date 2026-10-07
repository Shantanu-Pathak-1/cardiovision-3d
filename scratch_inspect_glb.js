const fs = require('fs');
const buf = fs.readFileSync('c:/Users/ShanDev/Downloads/human-body/cardio-react/public/heart.glb');
const str = buf.toString('latin1');
const matches = [];
const regex = /"name"\s*:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(str)) !== null) {
  matches.push(match[1]);
}
console.log('Unique names in GLB:', [...new Set(matches)]);
