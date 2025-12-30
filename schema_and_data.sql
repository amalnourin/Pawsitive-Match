-- Creates the main database schema
CREATE DATABASE IF NOT EXISTS pawsitive_match;

-- Set this as the active database for subsequent commands
USE pawsitive_match;

-- 1. PETS Table
CREATE TABLE pets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    species VARCHAR(50),
    breed VARCHAR(100),
    age_years INT,
    description TEXT,
    image_url VARCHAR(255)
);

-- 2. ADOPTION REQUESTS Table
CREATE TABLE adoption_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    pet_id VARCHAR(50),
    address VARCHAR(255),
    reason TEXT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. USERS Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Insert sample pet data
INSERT INTO pets (name, species, breed, age_years, description, image_url) VALUES
('Buddy', 'Dog', 'Golden Retriever', 2, 'Friendly and playful, loves fetch and long walks in the park.', 'golden-retriver-1.jpg'),
('Bella', 'Cat', 'Siamese Cat', 1, 'Affectionate and calm, loves to curl up on laps for a good nap.', 'cat.jpg'),
('Max', 'Dog', 'Labrador', 3, 'Energetic and loyal, this boy would make a great running partner.', 'labrador.jpeg'),
('Lucy', 'Cat', 'Persian Cat', 4, 'A gentle and fluffy princess who enjoys quiet afternoons.', 'cat-2.jpg');

SELECT * FROM pets;