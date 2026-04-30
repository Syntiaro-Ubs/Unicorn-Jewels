const db = require('./db');

async function migrate() {
    try {
        console.log('Starting instagram posts migration update...');

        // Create home_instagram_posts table (if not exists)
        await db.query(`
            CREATE TABLE IF NOT EXISTS home_instagram_posts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                image_url TEXT NOT NULL,
                post_url TEXT NOT NULL,
                order_index INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Clear existing data to re-seed with full URLs
        await db.query('DELETE FROM home_instagram_posts');
        console.log('Cleared existing Instagram posts.');

        const initialPosts = [
            { 
                image_url: 'https://images.unsplash.com/photo-1662434921251-a6eba45ac40c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZyUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
                post_url: 'https://www.instagram.com/p/C_rings' 
            },
            { 
                image_url: 'https://images.unsplash.com/photo-1590845947379-6c663322efea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwbmVja2xhY2UlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
                post_url: 'https://www.instagram.com/p/C_necklaces' 
            },
            { 
                image_url: 'https://images.unsplash.com/photo-1612437830721-4f8eab90c5a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwYnJhY2VsZXQlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
                post_url: 'https://www.instagram.com/p/C_bracelets' 
            },
            { 
                image_url: 'https://images.unsplash.com/photo-1726507367666-08c5f025bdf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwZWFycmluZ3MlMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
                post_url: 'https://www.instagram.com/p/C_earrings' 
            },
            { 
                image_url: 'https://images.unsplash.com/photo-1587947330318-88fcd9055420?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwZW5nYWdlbWVudCUyMHJpbmclMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzc2NzY1MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
                post_url: 'https://www.instagram.com/p/C_engagement' 
            },
            { 
                image_url: 'https://images.unsplash.com/photo-1702476320482-0736c4b962f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBoaWdoJTIwamV3ZWxyeSUyMHNldCUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral', 
                post_url: 'https://www.instagram.com/p/C_sets' 
            }
        ];

        for (let i = 0; i < initialPosts.length; i++) {
            const post = initialPosts[i];
            await db.query(
                'INSERT INTO home_instagram_posts (image_url, post_url, order_index) VALUES (?, ?, ?)',
                [post.image_url, post.post_url, i]
            );
        }
        console.log('Re-seeded Instagram posts with full URLs.');

        console.log('Instagram posts migration update completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
