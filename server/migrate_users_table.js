const db = require('./db');
require('dotenv').config();

async function migrateUsersTable() {
    try {
        console.log('Creating users table if it does not exist...');
        
        const query = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        `;
        
        await db.query(query);
        console.log('✅ Users table created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating users table:', error.message);
        process.exit(1);
    }
}

migrateUsersTable();
