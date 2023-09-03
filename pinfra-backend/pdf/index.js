const fs = require('fs');
const path = require('path');

const pdfObj = {};
fs.readdirSync(path.resolve('./pdf/templates')).forEach(file => {
  let name = file.substr(0, file.indexOf('.'));
  pdfObj[name] = require(path.resolve(`./pdf/templates/${name}`)); 
});
module.exports = pdfObj;