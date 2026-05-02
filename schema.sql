CREATE DATABASE IF NOT EXISTS food_delivery;
USE food_delivery;

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    city VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(200),
    contact VARCHAR(15),
    rating DECIMAL(2,1),
    status VARCHAR(20)
);

-- Insert dummy data
INSERT IGNORE INTO customers (name, email, phone, city) VALUES 
('Rahul Sharma', 'rahul@gmail.com', '9876543210', 'Chennai'),
('Anita Verma', 'anita@gmail.com', '9123456780', 'Bangalore');

INSERT IGNORE INTO vendors (name, location, contact, rating, status) VALUES 
('Spice Hub', 'T Nagar, Chennai', '9000011111', 4.9, 'Active'),
('Sweet Treats', 'Anna Nagar, Chennai', '9000022222', 4.2, 'Active');
