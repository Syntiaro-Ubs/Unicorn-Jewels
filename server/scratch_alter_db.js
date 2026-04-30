const pool = require('./db');

async function alterTable() {
    try {
        await pool.query('ALTER TABLE products ADD COLUMN hover_image_url VARCHAR(255) DEFAULT NULL;');
        console.log('Successfully added hover_image_url column.');
    } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
            console.log('Column hover_image_url already exists.');
        } else {
            console.error('Error altering table:', err);
        }
    } finally {
        process.exit();
    }
}

alterTable();
