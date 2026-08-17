const fs = require('fs');
const dir = 'd:/ClipMind AI/frontend/src/pages/';
const tmp = dir + 'CreatorHistoryNew.jsx';
const target = dir + 'CreatorHistory.jsx';
fs.writeFileSync(target, fs.readFileSync(tmp, 'utf8'));
fs.unlinkSync(tmp);
fs.unlinkSync(__filename);
console.log('swapped CreatorHistory.jsx');
