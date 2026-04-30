const db = require('./db');

async function check() {
    try {
        const [rows] = await db.query('SELECT * FROM home_instagram_posts');
        console.log('Instagram Posts in DB:');
        rows.forEach(row => {
            console.log(`ID: ${row.id}, URL: ${row.image_url.substring(0, 50)}...`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

check();
