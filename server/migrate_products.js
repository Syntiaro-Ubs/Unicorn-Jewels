const db = require('./db');

async function migrate() {
    try {
        console.log('Starting product-related tables migration...');

        // Create Categories Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) NOT NULL UNIQUE,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Categories table ensured.');

        // Create Collections Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS collections (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                slug VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                image_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Collections table ensured.');

        // Create Products Table
        await db.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                slug VARCHAR(255) NOT NULL UNIQUE,
                price VARCHAR(50),
                price_num DECIMAL(10, 2),
                description TEXT,
                image_url TEXT,
                hover_image_url VARCHAR(255) DEFAULT NULL,
                category_id INT,
                collection_id INT,
                metal VARCHAR(100),
                tag VARCHAR(50),
                is_featured BOOLEAN DEFAULT FALSE,
                is_new_arrival BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
                FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE SET NULL
            )
        `);
        console.log('Products table ensured.');

        // Seed initial categories if empty
        const [cats] = await db.query('SELECT count(*) as count FROM categories');
        if (cats[0].count === 0) {
            const categories = [
                { name: 'Rings', image: "https://images.unsplash.com/photo-1544441893-675973e31985?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZ3xlbnwxfHx8fDE3NzQzNDk2MDh8MA&ixlib=rb-4.1.0&q=80&w=400" },
                { name: 'Necklaces', image: "https://images.unsplash.com/photo-1599643478514-4a7190d6ec34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW5kYW50fGVufDF8fHx8MTc3NDM1MjE4M3ww&ixlib=rb-4.1.0&q=80&w=400" },
                { name: 'Bracelets', image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwYnJhY2VsZXR8ZW58MXx8fHwxNzc0MzUyMjExfDA&ixlib=rb-4.1.0&q=80&w=400" },
                { name: 'Earrings', image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYWludHklMjBlYXJyaW5nc3xlbnwxfHx8fDE3NzQzNTIxNjV8MA&ixlib=rb-4.1.0&q=80&w=400" },
                { name: 'Engagement', image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwcmluZ3xlbnwxfHx8fDE3NzQzNTM0MDR8MA&ixlib=rb-4.1.0&q=80&w=400" },
                { name: 'Sets', image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqZXdlbHJ5JTIwc2V0fGVufDF8fHx8MTc3NDM1MzQyOHww&ixlib=rb-4.1.0&q=80&w=400" }
            ];
            for (const cat of categories) {
                await db.query('INSERT INTO categories (name, slug, image_url) VALUES (?, ?, ?)', [cat.name, cat.name.toLowerCase(), cat.image]);
            }
            console.log('Initial categories seeded with images.');
        }

        // Seed initial collections if empty
        const [colls] = await db.query('SELECT count(*) as count FROM collections');
        if (colls[0].count === 0) {
            const collections = [
                { name: 'The Vanguard', image: 'https://images.unsplash.com/photo-1762505464397-6abf1a645981?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaWFtb25kJTIwcmluZ3xlbnwxfHx8fDE3NzQzNDk2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080' },
                { name: 'Lumina Letter', image: 'https://images.unsplash.com/photo-1772571092191-eb7010126fd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaWx2ZXIlMjBuZWNrbGFjZSUyMHBlbmRhbnQlMjBsdXh1cnl8ZW58MXx8fHwxNzc0MzQ5NjIzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
                { name: 'Promise Bloom', image: 'https://images.unsplash.com/photo-1743560834737-e350c159d992?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9taXNlJTIwYmxvb20lMjBqZXdlbHJ5fGVufDF8fHx8MTc3NDM0OTYxN3ww&ixlib=rb-4.1.0&q=80&w=1080' },
                { name: 'Aura Everyday', image: 'https://images.unsplash.com/photo-1721206624552-d945fc1a3b8a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkJTIwYnJhY2VsZXQlMjBtb2Rlcm4lMjBkZXNpZ258ZW58MXx8fHwxNzc0MzQ5NjI2fDA&ixlib=rb-4.1.0&q=80&w=1080' }
            ];
            for (const coll of collections) {
                await db.query('INSERT INTO collections (name, slug, image_url) VALUES (?, ?, ?)', [coll.name, coll.name.toLowerCase().replace(/\s+/g, '-'), coll.image]);
            }
            console.log('Initial collections seeded with images.');
        }

        console.log('✅ Product migration completed successfully');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        process.exit();
    }
}

migrate();
