CREATE DATABASE IF NOT EXISTS unicorn_jewels;
USE unicorn_jewels;

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    permissions TEXT, -- JSON array of allowed paths
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS banner_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    description TEXT,
    image_url TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(100) NOT NULL UNIQUE,
    content_json LONGTEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

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
);

-- Insert initial shop by look cards
INSERT INTO shop_by_look (variant, title, description, eyebrow, content_align, image_url, display_order) 
VALUES 
(
    'sculptural',
    'The Sculptural Edit',
    'Bold forms, polished metal, and high-jewelry silhouettes curated for statement dressing.',
    'Shop by Look',
    'left',
    'https://images.unsplash.com/photo-1770062422744-dcecde9c84ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdmFudCUyMGdhcmRlJTIwamV3ZWxyeSUyMG1vZGVsJTIwZWRpdG9yaWFsJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3Njc2Mzg3M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    1
),
(
    'vault',
    'The Evening Vault',
    'Rare stones and luminous settings assembled for private viewings and after-dark occasions.',
    'Shop by Look',
    'center',
    'https://images.unsplash.com/photo-1614999612412-3b1dbcd68e40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoaWdoJTIwamV3ZWxyeSUyMGRpYW1vbmQlMjBuZWNrbGFjZSUyMGNsb3NlJTIwdXB8ZW58MXx8fHwxNzc2NzY1MzM2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    2
)
ON DUPLICATE KEY UPDATE title=title;

-- Insert initial banner content for home page
INSERT INTO banner_content (page_key, title, subtitle, description, image_url) 
VALUES (
    'home',
    'Unicorn Jewels', 
    'Sustainable spark. Soulful shine.', 
    'Discover our newest collection of handcrafted jewelry, where every piece tells a story of exceptional artistry and enduring beauty.', 
    'https://images.unsplash.com/photo-1729641246245-64405c363263?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2RlbCUyMHdlYXJpbmclMjBsdXh1cnklMjBkaWFtb25kJTIwamV3ZWxyeSUyMGF2YW50LWdhcmRlfGVufDF8fHx8MTc3Njc2NTMxOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
) ON DUPLICATE KEY UPDATE title=title;

-- Insert a default admin (password: admin123)
INSERT INTO admins (username, email, password, permissions) 
VALUES ('admin', 'admin@unicornjewels.com', '$2b$10$t3YvehjrcmRvsRwJSuqlcuZGb/NpmcO.jZIp.KK6wFuK1/ssBPIT.', '["home", "banner", "products", "taxonomy", "shop-by-look", "users", "team"]')
ON DUPLICATE KEY UPDATE password=VALUES(password), permissions=VALUES(permissions);
