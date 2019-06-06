const fs = require('fs');
const execSync = require('child_process').execSync;

const file = 'data.json';
const documents  = +process.argv[2]; 
const database   = 'recursos';
const collection = 'temas';
const host = 'ds153763.mlab.com:53763';
const user = 'recursos';
const password = 'recursos2018aa';

if (fs.existsSync(file)) fs.unlinkSync(file);

console.log(`Importing ${documents} documents. Please wait...`);

const start = process.hrtime();

let content = '';
for (let i = 0; i < documents; i++)     
  content += '{"nombre": "tema ' + i + '"}' + "\n";

fs.appendFileSync(file, content);
execSync(`mongoimport -h ${host} -u ${user} -p ${password} -d ${database} -c ${collection} --file ${file} --drop`);

const end = process.hrtime(start);
console.log(`Execution time: ${end[0]} sec.`);