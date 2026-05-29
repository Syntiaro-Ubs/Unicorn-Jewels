const db = require('./db');

async function updateAdmin() {
    try {
        const perms = JSON.stringify(["home", "banner", "products", "taxonomy", "shop-by-look", "users", "orders", "team"]);
        await db.query('UPDATE admins SET permissions = ? WHERE username = ?', [perms, 'admin']);
        console.log('Admin permissions updated successfully');
    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        process.exit();
    }
}

updateAdmin();
