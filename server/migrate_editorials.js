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
        console.log('Creating home_editorials table...');
        await connection.execute(`
            CREATE TABLE IF NOT EXISTS home_editorials (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                image_url TEXT,
                button_text VARCHAR(255) DEFAULT 'DISCOVER MORE',
                button_link VARCHAR(255),
                is_reversed BOOLEAN DEFAULT FALSE,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);
        console.log('home_editorials table created successfully.');

        // Insert initial data based on existing hardcoded sections
        const [rows] = await connection.execute('SELECT COUNT(*) as count FROM home_editorials');
        if (rows[0].count === 0) {
            console.log('Seeding initial editorial data...');
            const silverCollectionFrontImg = "https://images.unsplash.com/photo-1758391929001-55983449a84c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBqZXdlbHJ5JTIwY29sbGVjdGlvbiUyMG1vZGVsJTIwZWRpdG9yaWFsfGVufDF8fHx8MTc3Njc2NTMyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";
            const platinumPerfectionImg = "https://images.unsplash.com/photo-1679156271420-e6c596e9c10a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGF0aW51bSUyMGRpYW1vbmQlMjByaW5nJTIwbHV4dXJ5fGVufDF8fHx8MTc3Njc2NTMzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

            await connection.execute(`
                INSERT INTO home_editorials (title, description, image_url, button_text, is_reversed, order_index) VALUES 
                ('The Silver Collection', 'Our signature silver pieces embody modern sophistication. Each design is meticulously crafted by master artisans who bring decades of expertise to every detail, creating heirlooms for generations to come.', ?, 'DISCOVER MORE', FALSE, 1),
                ('Platinum Perfection', 'The rarest and most precious of metals, platinum represents the pinnacle of luxury. Our platinum collection showcases extraordinary diamonds set in designs that celebrate life''s most meaningful moments.', ?, 'EXPLORE COLLECTION', TRUE, 2)
            `, [silverCollectionFrontImg, platinumPerfectionImg]);
            console.log('Initial data seeded.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await connection.end();
        console.log('Migration completed.');
    }
}

migrate();
