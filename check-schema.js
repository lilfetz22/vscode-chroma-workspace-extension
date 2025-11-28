const fs = require('fs');
const initSqlJs = require('sql.js');

const dbPath = 'C:/Users/WilliamFetzner/Documents/chroma_project_database/.chroma/chroma.db';

async function checkDatabase() {
    console.log('Loading database from:', dbPath);
    
    // Initialize sql.js
    const SQL = await initSqlJs();
    
    // Load the database file
    const buffer = fs.readFileSync(dbPath);
    const db = new SQL.Database(buffer);

    console.log('\n=== Tags Table Schema ===');
    const schema = db.exec("SELECT sql FROM sqlite_master WHERE type='table' AND name='tags'");
    console.log(JSON.stringify(schema, null, 2));

    console.log('\n=== Table Info (Column Definitions) ===');
    const info = db.exec("PRAGMA table_info(tags)");
    console.log(JSON.stringify(info, null, 2));

    console.log('\n=== Current Tags in Database ===');
    const tags = db.exec("SELECT * FROM tags LIMIT 20");
    console.log(JSON.stringify(tags, null, 2));

    console.log('\n=== Count of Tags ===');
    const count = db.exec("SELECT COUNT(*) as count FROM tags");
    console.log(JSON.stringify(count, null, 2));

    console.log('\n=== Tags with NULL names ===');
    const nullTags = db.exec("SELECT * FROM tags WHERE name IS NULL LIMIT 10");
    console.log(JSON.stringify(nullTags, null, 2));

    db.close();
}

checkDatabase().catch(console.error);
