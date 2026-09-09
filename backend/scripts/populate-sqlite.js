const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', '.tmp', 'data.db');
const db = new Database(dbPath);

const CARDS_DATA = [
  {
    title: 'UI/UX Design',
    description:
      'Human-centered UI/UX design blending creativity, usability, and aesthetics for memorable experiences.',
    fileId: null,
  },
  {
    title: 'Websites',
    description:
      'Fast, scalable, and beautiful websites crafted for performance, engagement, and lasting impact.',
    fileId: 29, // PaintRoller.svg
  },
  {
    title: 'Mobile Apps',
    description:
      'Seamless Android and iOS apps delivering intuitive experiences and powerful business functionality.',
    fileId: 31, // Sparkle.svg
  },
  {
    title: 'AI & Automation',
    description:
      'Smart systems that streamline processes, enhance decisions, and unlock next-level efficiency.',
    fileId: null,
  },
  {
    title: 'E-Commerce',
    description:
      'Custom online stores and marketplaces engineered for growth, flexibility, and effortless user journeys.',
    fileId: null,
  },
  {
    title: 'IoT & Innovation',
    description:
      'Connected devices and embedded systems bringing digital intelligence into real-world products.',
    fileId: null,
  },
];

// Target our_processes entities (entity_id 23 is used by active landing page)
const targetEntityIds = [23, 1];

console.log('Cleaning old mobileCards relations if any...');
for (const entityId of targetEntityIds) {
  const existingCmps = db
    .prepare(
      "SELECT cmp_id FROM components_sections_our_processes_cmps WHERE entity_id = ? AND field = 'mobileCards'"
    )
    .all(entityId);

  for (const row of existingCmps) {
    db.prepare('DELETE FROM components_sections_process_card_mobile_s WHERE id = ?').run(row.cmp_id);
    db.prepare('DELETE FROM files_related_mph WHERE related_id = ? AND related_type = ?').run(
      row.cmp_id,
      'sections.process-card-mobile'
    );
  }

  db.prepare(
    "DELETE FROM components_sections_our_processes_cmps WHERE entity_id = ? AND field = 'mobileCards'"
  ).run(entityId);
}

console.log('Inserting 6 mobile cards into SQLite...');
const insertCard = db.prepare(
  'INSERT INTO components_sections_process_card_mobile_s (title, description) VALUES (?, ?)'
);
const insertCmpRel = db.prepare(
  'INSERT INTO components_sections_our_processes_cmps (entity_id, cmp_id, component_type, field, "order") VALUES (?, ?, ?, ?, ?)'
);
const insertFileRel = db.prepare(
  'INSERT INTO files_related_mph (file_id, related_id, related_type, field, "order") VALUES (?, ?, ?, ?, ?)'
);

for (const entityId of targetEntityIds) {
  let order = 1;
  for (const card of CARDS_DATA) {
    const cardResult = insertCard.run(card.title, card.description);
    const cardId = cardResult.lastInsertRowid;

    insertCmpRel.run(
      entityId,
      cardId,
      'sections.process-card-mobile',
      'mobileCards',
      order
    );

    if (card.fileId) {
      insertFileRel.run(
        card.fileId,
        cardId,
        'sections.process-card-mobile',
        'icon',
        1
      );
    }

    order++;
  }
}

console.log('Successfully inserted all mobile cards into SQLite!');

// Verify
const verify = db
  .prepare(
    `SELECT c.id, c.title, c.description, f.name as icon_name, f.url as icon_url
     FROM components_sections_process_card_mobile_s c
     JOIN components_sections_our_processes_cmps rel ON rel.cmp_id = c.id
     LEFT JOIN files_related_mph frel ON frel.related_id = c.id AND frel.related_type = 'sections.process-card-mobile'
     LEFT JOIN files f ON f.id = frel.file_id
     WHERE rel.entity_id = 23
     ORDER BY rel."order" ASC`
  )
  .all();

console.log('Verification for our-process section (entity 23):');
console.table(verify);

db.close();
