const db = require('./db');

async function test() {
    try {
        const [rows] = await db.query(`
            SELECT p.*, c.name as category_name, coll.name as collection_name 
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id
            LEFT JOIN collections coll ON p.collection_id = coll.id
            ORDER BY p.created_at DESC
        `);
        console.log("Success:", rows.length);
    } catch (error) {
        console.error("DB Error:", error.message);
    } finally {
        process.exit();
    }
}
test();
