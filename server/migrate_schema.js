const db = require('./db');

async function migrate() {
    try {
        console.log('Starting migration...');
        // Add column
        try {
            await db.query('ALTER TABLE banner_content ADD COLUMN page_key VARCHAR(100) NOT NULL UNIQUE AFTER id');
            console.log('Column page_key added.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Column page_key already exists.');
            } else {
                throw err;
            }
        }

        // Set default value for existing rows
        await db.query("UPDATE banner_content SET page_key = 'home' WHERE page_key = '' OR page_key IS NULL");
        console.log('Default values set.');
        
        console.log('✅ Migration completed successfully');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
