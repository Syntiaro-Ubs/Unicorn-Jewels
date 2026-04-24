CREATE DATABASE IF NOT EXISTS unicorn_jewels;
USE unicorn_jewels;

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
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
INSERT INTO admins (username, email, password) 
VALUES ('admin', 'admin@unicornjewels.com', '$2b$10$t3YvehjrcmRvsRwJSuqlcuZGb/NpmcO.jZIp.KK6wFuK1/ssBPIT.')
ON DUPLICATE KEY UPDATE password=VALUES(password);
