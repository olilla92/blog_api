import Database from 'better-sqlite3';

// Adatbázis létrehozás
const db = new Database('./database.sqlite');

// Tábla létrehozása (ha nem létezik)
db.prepare(`
  CREATE TABLE IF NOT EXISTS blogok (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    szerzo TEXT,
    cim TEXT,
    kategoria TEXT,
    tartalom TEXT,
    kelt DATETIME DEFAULT CURRENT_TIMESTAMP,
    modositva DATETIME
  )
`).run();

// Alap blog adatok (csak ha üres az adatbázis)
const initialBlogs = [
  {
    szerzo: 'Kiss Anna',
    cim: 'A reggeli rutinom',
    kategoria: 'Életmód',
    tartalom: 'Megosztom veletek a reggeli rutinomat, ami segít energikusan kezdeni a napot.',
  },
  {
    szerzo: 'Kiss Anna',
    cim: 'Minimalista életmód alapjai',
    kategoria: 'Életmód',
    tartalom: 'Kevesebb tárgy, több élmény – tapasztalataim a minimalista életmódról.',
  },
  {
    szerzo: 'Kovács Péter',
    cim: 'JavaScript kezdőknek',
    kategoria: 'Programozás',
    tartalom: 'Ebben a bejegyzésben a változók használatát és az alap szintaxist mutatom be.',
  },
  {
    szerzo: 'Kovács Péter',
    cim: 'Node.js bevezetés',
    kategoria: 'Programozás',
    tartalom: 'Hogyan működik a szerveroldali JavaScript Node.js-szel?',
  },
  {
    szerzo: 'Szabó Eszter',
    cim: 'Tavaszi utazás Bécsbe',
    kategoria: 'Utazás',
    tartalom: 'Egy napos kiruccanás Bécsben, látnivalók, kávézók és kulturális élmények.',
  },
  {
    szerzo: 'Szabó Eszter',
    cim: 'Top 3 múzeum Európában',
    kategoria: 'Utazás',
    tartalom: 'Kedvenc múzeumaim Párizsban, Amszterdamban és Berlinben – rövid ajánló.',
  },
];

// Csak akkor tölti be a kezdeti adatokat, ha még nincs adat
const count = db.prepare('SELECT COUNT(*) AS cnt FROM blogok').get().cnt;
if (count === 0) {
  const insert = db.prepare(`
    INSERT INTO blogok (szerzo, cim, kategoria, tartalom)
    VALUES (?, ?, ?, ?)
  `);
  const insertMany = db.transaction((blogs) => {
    for (const blog of blogs) {
      insert.run(blog.szerzo, blog.cim, blog.kategoria, blog.tartalom);
    }
  });
  insertMany(initialBlogs);
}

// CRUD műveletek exportálása
export const getBlogok = () => db.prepare('SELECT * FROM blogok').all();

export const getBlog = (id) =>
  db.prepare('SELECT * FROM blogok WHERE id = ?').get(id);

export const saveBlog = (szerzo, cim, kategoria, tartalom) =>
  db.prepare(`
    INSERT INTO blogok (szerzo, cim, kategoria, tartalom)
    VALUES (?, ?, ?, ?)
  `).run(szerzo, cim, kategoria, tartalom);

export const updateBlog = (id, szerzo, cim, kategoria, tartalom) =>
  db.prepare(`
    UPDATE blogok
    SET szerzo = ?, cim = ?, kategoria = ?, tartalom = ?, modositva = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(szerzo, cim, kategoria, tartalom, id);

export const deleteBlog = (id) =>
  db.prepare('DELETE FROM blogok WHERE id = ?').run(id);
