const db = require('./db');

async function check() {
    try {
        const [rows] = await db.query('DESCRIBE products');
        console.log(rows);
    } catch (error) {
        console.error(error);
    } finally {
        process.exit();
    }
}
check();
