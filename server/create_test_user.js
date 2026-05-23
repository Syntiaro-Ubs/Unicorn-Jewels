const db = require('./db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createTestUser() {
    try {
        const email = 'test@example.com';
        const password = 'password123';
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if user already exists
        const [existing] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('Test user already exists!');
            console.log('Email:', email);
            console.log('Password:', password);
        } else {
            // Create test user
            await db.query(
                'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
                ['Test', 'User', email, hashedPassword]
            );
            console.log('✅ Test user created successfully!');
            console.log('Email:', email);
            console.log('Password:', password);
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating test user:', error.message);
        process.exit(1);
    }
}

createTestUser();
