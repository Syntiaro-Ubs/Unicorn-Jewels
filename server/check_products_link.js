const db = require('./db');
async function run() {
  try {
    const [rows] = await db.query('SELECT id, name, instagram_link FROM products');
    console.log('Products:', rows);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
run();
