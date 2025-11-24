const fs = require('fs');
const path = require('path');

// Function to convert title to snake_case filename
function titleToFilename(title) {
    return title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '_')      // Replace spaces with underscores
        .replace(/-+/g, '_')       // Replace hyphens with underscores
        .replace(/_+/g, '_')       // Replace multiple underscores with single
        .trim() + '.txt';
}

// Paths
const notesJsonPath = path.join(__dirname, 'import_jsons', 'notes.json');
const txtDirectory = path.join(__dirname, 'import_notes_txts');

console.log('Reading notes.json...');
const notesData = JSON.parse(fs.readFileSync(notesJsonPath, 'utf8'));

let updatedCount = 0;
let notFoundCount = 0;

// Process each note
notesData.forEach((note, index) => {
    const title = note.title;
    const filename = titleToFilename(title);
    const txtFilePath = path.join(txtDirectory, filename);

    console.log(`\nProcessing note ${index + 1}/${notesData.length}: "${title}"`);
    console.log(`  Looking for: ${filename}`);

    if (fs.existsSync(txtFilePath)) {
        const txtContent = fs.readFileSync(txtFilePath, 'utf8');
        note.content = txtContent;
        console.log(`  ✓ Updated with content from ${filename} (${txtContent.length} characters)`);
        updatedCount++;
    } else {
        console.log(`  ✗ File not found: ${filename}`);
        notFoundCount++;
    }
});

// Write updated JSON back to file
console.log('\n' + '='.repeat(60));
console.log(`Writing updated notes.json...`);
fs.writeFileSync(notesJsonPath, JSON.stringify(notesData, null, 2), 'utf8');

console.log(`\nComplete!`);
console.log(`  Updated: ${updatedCount} notes`);
console.log(`  Not found: ${notFoundCount} notes`);
console.log('='.repeat(60));
