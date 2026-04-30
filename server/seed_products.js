const db = require('./db');

async function seedProducts() {
    try {
        console.log('Seeding initial products...');

        // Get category and collection maps
        const [categories] = await db.query('SELECT id, name FROM categories');
        const [collections] = await db.query('SELECT id, name FROM collections');

        const catMap = categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.id }), {});
        const collMap = collections.reduce((acc, coll) => ({ ...acc, [coll.name]: coll.id }), {});

        const products = [
            {
                name: 'Promise Bloom',
                slug: 'promise-bloom',
                price: '$12,500',
                price_num: 12500,
                metal: 'Platinum · Round Brilliant',
                image_url: 'https://images.unsplash.com/photo-1724937721228-f7bf3df2a4d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGVybmFsbHklMjBkZXNpcmVkJTIwY2xhc3NpYyUyMGRpYW1vbmQlMjBqZXdlbHJ5fGVufDF8fHx8MTc3Njc2NTMyN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                collection_name: 'Promise Bloom',
                category_name: 'Engagement',
                is_featured: true
            },
            {
                name: 'The Vanguard',
                slug: 'the-vanguard',
                price: '$8,900',
                price_num: 8900,
                metal: '18k Rose Gold',
                image_url: 'https://images.unsplash.com/photo-1635987739727-11e2578bd0cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMHNjdWxwdHVyYWwlMjBnb2xkfGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                collection_name: 'The Vanguard',
                category_name: 'Rings',
                is_featured: true
            },
            {
                name: 'Lumina Letter',
                slug: 'lumina-letter',
                price: '$2,750',
                price_num: 2750,
                metal: '18k Yellow Gold',
                image_url: 'https://images.unsplash.com/photo-1637536701306-3214e9cec64a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMGFuZCUyMHdoaXRlJTIwamV3ZWxyeSUyMGVkaXRvcmlhbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc3Njc2NTMyOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                collection_name: 'Lumina Letter',
                category_name: 'Necklaces',
                is_featured: true
            },
            {
                name: 'Aura Everyday',
                slug: 'aura-everyday',
                price: '$4,200',
                price_num: 4200,
                metal: 'Platinum',
                image_url: 'https://images.unsplash.com/photo-1633701394188-c11a1e6a4e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwZW5kJTIwbHV4dXJ5JTIwamV3ZWxyeSUyMG1vZGVsJTIwc2hvb3R8ZW58MXx8fHwxNzc2NzY1MzI4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                collection_name: 'Aura Everyday',
                category_name: 'Bracelets',
                is_featured: true
            },
            {
                name: 'Sapphire Cushion Ring',
                slug: 'sapphire-cushion-ring',
                price: '$4,800',
                price_num: 4800,
                metal: 'Platinum · Cushion Cut',
                image_url: 'https://images.unsplash.com/photo-1610661022658-5068c4d8f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBwZW5kYW50JTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzc2NzY1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                category_name: 'Rings',
                tag: 'NEW',
                is_new_arrival: true
            },
            {
                name: 'Sapphire Cushion Pendant',
                slug: 'sapphire-cushion-pendant',
                price: '$5,200',
                price_num: 5200,
                metal: '18k White Gold',
                image_url: 'https://images.unsplash.com/photo-1610661022658-5068c4d8f286?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBwZW5kYW50JTIwbmVja2xhY2UlMjBsdXh1cnl8ZW58MXx8fHwxNzc2NzY1MzI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                category_name: 'Necklaces',
                tag: 'NEW',
                is_new_arrival: true
            },
            {
                name: 'Sapphire Cushion Earrings',
                slug: 'sapphire-cushion-earrings',
                price: '$5,950',
                price_num: 5950,
                metal: 'Platinum · Pair',
                image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXBwaGlyZSUyMGRpYW1vbmQlMjBlYXJyaW5ncyUyMGx1eHVyeSUyMHdoaXRlJTIwYmFja2dyb3VuZHxlbnwxfHx8fDE3NzY3NjUzMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
                category_name: 'Earrings',
                tag: 'EXCLUSIVE',
                is_new_arrival: true
            }
        ];

        for (const p of products) {
            await db.query(
                `INSERT INTO products (name, slug, price, price_num, description, image_url, category_id, collection_id, metal, tag, is_featured, is_new_arrival) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    p.name, 
                    p.slug, 
                    p.price, 
                    p.price_num, 
                    'Exquisite piece crafted with precision.', 
                    p.image_url, 
                    p.category_name ? catMap[p.category_name] : null, 
                    p.collection_name ? collMap[p.collection_name] : null, 
                    p.metal, 
                    p.tag || '', 
                    p.is_featured || false, 
                    p.is_new_arrival || false
                ]
            );
        }

        console.log('✅ Products seeded successfully');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
    } finally {
        process.exit();
    }
}

seedProducts();
