const db = require('./db');

async function migrateShopByLook() {
    try {
        console.log('Starting shop_by_look migration...');
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS shop_by_look (
                id INT AUTO_INCREMENT PRIMARY KEY,
                variant VARCHAR(100) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                eyebrow VARCHAR(100),
                content_align VARCHAR(20) DEFAULT 'left',
                image_url TEXT,
                display_order INT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Table shop_by_look created or already exists.');

        // Seed initial data if table is empty
        const [existing] = await db.query('SELECT COUNT(*) as count FROM shop_by_look');
        if (existing[0].count === 0) {
            const initialLooks = [
                {
                    variant: 'sculptural',
                    title: 'The Sculptural Edit',
                    description: 'Bold forms, polished metal, and high-jewelry silhouettes curated for statement dressing.',
                    eyebrow: 'Shop by Look',
                    content_align: 'left',
                    image_url: 'https://images.unsplash.com/photo-1770062422744-dcecde9c84ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMG1vZGVsJTIwZWRpdG9yaWFsJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Njc2Mzg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                    display_order: 1
                },
                {
                    variant: 'vault',
                    title: 'The Evening Vault',
                    description: 'Rare stones and luminous settings assembled for private viewings and after-dark occasions.',
                    eyebrow: 'Shop by Look',
                    content_align: 'center',
                    image_url: 'https://images.unsplash.com/photo-1614999612412-3b1dbcd68e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwamV3ZWxyeSUyMGRpYW1vbmQlMjBuZWNrbGFjZSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc2NzY1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                    display_order: 2
                }
            ];

            for (const look of initialLooks) {
                await db.query(
                    'INSERT INTO shop_by_look (variant, title, description, eyebrow, content_align, image_url, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [look.variant, look.title, look.description, look.eyebrow, look.content_align, look.image_url, look.display_order]
                );
            }
            console.log('Seeded initial shop_by_look data.');
        }

        console.log('✅ shop_by_look migration completed successfully');
    } catch (error) {
        console.error('❌ shop_by_look migration failed:', error);
    }
}

module.exports = migrateShopByLook;

// Run as standalone script if called directly
if (require.main === module) {
    migrateShopByLook().then(() => process.exit()).catch(() => process.exit(1));
}
