const db = require('./db');

const createProductVariantsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS product_variants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      size VARCHAR(50),
      color VARCHAR(50),
      stock INT DEFAULT 0,
      sku VARCHAR(100),
      price DECIMAL(10, 2),
      images TEXT,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `;

  try {
    await db.query(sql);
    console.log('✓ product_variants table created successfully');
  } catch (err) {
    console.error('Error creating product_variants table:', err);
  }
};

// Add weight column to products table
const addWeightColumn = async () => {
  try {
    // Check if column exists first
    const [columns] = await db.query(`
      SHOW COLUMNS FROM products LIKE 'weight'
    `);
    
    if (columns.length === 0) {
      await db.query(`
        ALTER TABLE products 
        ADD COLUMN weight DECIMAL(10, 2) DEFAULT 0.3
      `);
      console.log('✓ weight column added to products table');
    } else {
      console.log('✓ weight column already exists');
    }
  } catch (err) {
    console.error('Error adding weight column:', err);
  }
};

// Run migrations
(async () => {
  await createProductVariantsTable();
  await addWeightColumn();
  process.exit(0);
})();
