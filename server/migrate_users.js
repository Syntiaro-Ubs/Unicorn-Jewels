const db = require('./db');

async function migrateUsers() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created or already exists.');

        // Add phone column if it doesn't exist
        try {
            await db.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
            console.log('Phone column added to users table.');
        } catch (e) {
            // Ignore if column already exists
        }

        await db.query(`
            CREATE TABLE IF NOT EXISTS user_orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                order_id VARCHAR(50) NOT NULL,
                product_name VARCHAR(255) NOT NULL,
                price VARCHAR(50) NOT NULL,
                image_url TEXT,
                status VARCHAR(50) DEFAULT 'Processing',
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('User orders table created or already exists.');

        await db.query(`
            CREATE TABLE IF NOT EXISTS user_addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                type VARCHAR(50) NOT NULL, -- e.g. 'Home', 'Office'
                is_primary BOOLEAN DEFAULT FALSE,
                street VARCHAR(255),
                apartment VARCHAR(100),
                city VARCHAR(100),
                state VARCHAR(100),
                zip VARCHAR(20),
                country VARCHAR(100),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('User addresses table created or already exists.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrateUsers();
