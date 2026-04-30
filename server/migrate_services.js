const db = require('./db');

async function migrate() {
    try {
        console.log('Starting services migration...');

        // Create home_services table
        await db.query(`
            CREATE TABLE IF NOT EXISTS home_services (
                id INT AUTO_INCREMENT PRIMARY KEY,
                tag VARCHAR(50),
                title VARCHAR(255) NOT NULL,
                description TEXT,
                button_text VARCHAR(100),
                button_link VARCHAR(255),
                image_url TEXT,
                is_reversed BOOLEAN DEFAULT FALSE,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table home_services created or already exists.');

        // Seed initial data
        const [existing] = await db.query('SELECT COUNT(*) as count FROM home_services');
        if (existing[0].count === 0) {
            const initialServices = [
                {
                    tag: 'CONCIERGE',
                    title: 'Personal Styling',
                    description: 'Our style consultants curate a personalized selection based on your taste, occasion, and wardrobe — whether for a gala, a wedding, or everyday elegance.',
                    button_text: 'Book a Session',
                    button_link: 'appointment',
                    image_url: 'https://images.unsplash.com/photo-1634546269105-4dbc3e8f0052?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMHN0eWxpbmclMjBqZXdlbHJ5JTIwZXhwZXJ0JTIwY29uc3VsdGF0aW9ufGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                    is_reversed: false,
                    order_index: 1
                },
                {
                    tag: 'SERVICES',
                    title: 'The Art of Giving',
                    description: 'Every piece arrives in our signature presentation box, hand-tied with a silk ribbon. Complimentary engraving and personal shopping assistance ensure a gift as memorable as the jewel itself.',
                    button_text: 'Explore Gift Guide',
                    button_link: 'gift-guide',
                    image_url: 'https://images.unsplash.com/photo-1587947330318-88fcd9055420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwZW5nYWdlbWVudCUyMHJpbmclMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                    is_reversed: true,
                    order_index: 2
                }
            ];

            for (const service of initialServices) {
                await db.query(
                    'INSERT INTO home_services (tag, title, description, button_text, button_link, image_url, is_reversed, order_index) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [service.tag, service.title, service.description, service.button_text, service.button_link, service.image_url, service.is_reversed, service.order_index]
                );
            }
            console.log('Seeded initial services data.');
        }

        console.log('Services migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
