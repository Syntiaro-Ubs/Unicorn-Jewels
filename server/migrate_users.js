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
                product_id VARCHAR(100) NULL,
                quantity INT DEFAULT 1,
                selected_size VARCHAR(50) NULL,
                cancellation_reason TEXT NULL,
                order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);
        console.log('User orders table created or already exists.');

        // Add columns if they don't exist, and ensure type is VARCHAR(100)
        try {
            await db.query('ALTER TABLE user_orders ADD COLUMN product_id VARCHAR(100) NULL');
            console.log('product_id column added to user_orders table.');
        } catch (e) {
            // Ignore if column already exists
        }

        try {
            await db.query('ALTER TABLE user_orders MODIFY COLUMN product_id VARCHAR(100) NULL');
            console.log('product_id column modified to VARCHAR(100) in user_orders table.');
        } catch (e) {
            // Ignore
        }

        try {
            await db.query('ALTER TABLE user_orders ADD COLUMN quantity INT DEFAULT 1');
            console.log('quantity column added to user_orders table.');
        } catch (e) {
            // Ignore if column already exists
        }

        try {
            await db.query('ALTER TABLE user_orders ADD COLUMN selected_size VARCHAR(50) NULL');
            console.log('selected_size column added to user_orders table.');
        } catch (e) {
            // Ignore if column already exists
        }

        try {
            await db.query('ALTER TABLE user_orders ADD COLUMN refund_id VARCHAR(100) NULL');
            console.log('refund_id column added to user_orders table.');
        } catch (e) {
            // Ignore if column already exists
        }

        try {
            await db.query('ALTER TABLE user_orders ADD COLUMN refund_status VARCHAR(50) NULL');
            console.log('refund_status column added to user_orders table.');
        } catch (e) {
            // Ignore if column already exists
        }

        try {
            await db.query('ALTER TABLE user_orders ADD COLUMN cancellation_reason TEXT NULL');
            console.log('cancellation_reason column added to user_orders table.');
        } catch (e) {
            // Ignore if column already exists
        }

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

        await db.query(`
            CREATE TABLE IF NOT EXISTS order_tracking (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id VARCHAR(50) NOT NULL,
                tracking_number VARCHAR(100) NOT NULL UNIQUE,
                carrier VARCHAR(50) DEFAULT 'FedEx',
                status VARCHAR(100) DEFAULT 'Label Created',
                estimated_delivery TIMESTAMP NULL,
                actual_delivery TIMESTAMP NULL,
                shipment_date TIMESTAMP NULL,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX (tracking_number)
            )
        `);
        console.log('Order tracking table created or already exists.');

        await db.query(`
            CREATE TABLE IF NOT EXISTS order_tracking_events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tracking_id INT NOT NULL,
                event_timestamp TIMESTAMP NOT NULL,
                location VARCHAR(255) DEFAULT 'Unknown',
                description TEXT NOT NULL,
                status_code VARCHAR(10) NULL,
                FOREIGN KEY (tracking_id) REFERENCES order_tracking(id) ON DELETE CASCADE,
                INDEX (event_timestamp)
            )
        `);
        console.log('Order tracking events table created or already exists.');

    } catch (error) {
        console.error('Migration failed:', error);
    }
}

module.exports = migrateUsers;

// Run as standalone script if called directly
if (require.main === module) {
    migrateUsers().then(() => process.exit()).catch(() => process.exit(1));
}
