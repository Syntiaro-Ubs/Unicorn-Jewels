const db = require('./db');

async function migrate() {
    try {
        console.log('Adding stock and barcode columns to products table...');
        
        try {
            await db.query(`ALTER TABLE products ADD COLUMN stock INT DEFAULT 0`);
            console.log('Added stock column');
        } catch (e) {
            console.log('Stock column might already exist:', e.message);
        }

        try {
            await db.query(`ALTER TABLE products ADD COLUMN barcode VARCHAR(255) DEFAULT ''`);
            console.log('Added barcode column');
        } catch (e) {
            console.log('Barcode column might already exist:', e.message);
        }

        console.log('Migration completed successfully');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
