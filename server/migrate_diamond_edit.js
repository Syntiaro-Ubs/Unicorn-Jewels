require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
    console.log('Connecting to database...');
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'Omkar@123',
        database: process.env.DB_NAME || 'unicorn_jewels'
    });

    try {
        console.log('Creating home_diamond_edit table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS home_diamond_edit (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                subtitle VARCHAR(255),
                image_url TEXT,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log('home_diamond_edit table created successfully.');

        // Seed initial data
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM home_diamond_edit');
        if (rows[0].count === 0) {
            console.log('Seeding initial Diamond Edit data...');
            const diamondEdit1 = "https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
            const diamondEdit2 = "https://images.unsplash.com/photo-1590845947379-6c663322efea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwbmVja2xhY2UlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
            const diamondEdit3 = "https://images.unsplash.com/photo-1612437830721-4f8eab90c5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwYnJhY2VsZXQlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

            await connection.execute(`
                INSERT INTO home_diamond_edit (title, subtitle, image_url, order_index) VALUES 
                ('Red Diamond Pendant', 'The Eternal Flame', ?, 1),
                ('Red Diamond Bracelet', 'Passion Captured', ?, 2),
                ('Red Diamond Ring', 'Rare Romance', ?, 3)
            `, [diamondEdit1, diamondEdit2, diamondEdit3]);
            console.log('Initial Diamond Edit data seeded.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
        console.log('Migration completed.');
    }
}

migrate();
