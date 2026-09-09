const Database = require('better-sqlite3');
const db = new Database('c:/Users/amngu/thumbstack/lead-magnet/backend/.tmp/data.db');

console.log('--- ALL TABLES LIKE our_process or mobile ---');
const tables = db.prepare("SELECT name, sql FROM sqlite_master WHERE name LIKE '%our_process%' OR name LIKE '%mobile%'").all();
console.log(JSON.stringify(tables, null, 2));

console.log('--- COMPONENTS_SECTIONS_OUR_PROCESSES ROWS ---');
try {
  const rows = db.prepare("SELECT * FROM components_sections_our_processes").all();
  console.log(JSON.stringify(rows, null, 2));
} catch (e) {
  console.error(e.message);
}

console.log('--- RELATED LINKS FOR OUR_PROCESSES ---');
const allTables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
for (const t of allTables) {
  if (t.name.includes('our_process')) {
    console.log('TABLE:', t.name);
    console.log(db.prepare(`SELECT * FROM "${t.name}"`).all());
  }
}
