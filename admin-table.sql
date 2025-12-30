use pawsitive_match;

-- 4. ADMINS Table: Stores credentials for shelter/management users
CREATE TABLE admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    shelter_name VARCHAR(100)
);

-- Insert a test admin user (REQUIRED for testing the admin login page)
INSERT INTO admins (name, email, password, shelter_name) VALUES
('Shelter Manager', 'admin@pawsitivematch.com', 'admin123', 'City Animal Shelter');