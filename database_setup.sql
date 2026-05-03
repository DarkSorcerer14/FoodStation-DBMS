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

INSERT IGNORE INTO vendors (id, name, location, contact, rating, status) VALUES 
(1, 'Spice Hub', 'T Nagar, Chennai', '9000011111', 4.9, 'Active'),
(2, 'Sweet Treats', 'Anna Nagar, Chennai', '9000022222', 4.2, 'Active'),
(3, 'Burger Point', 'Adyar, Chennai', '9000033333', 4.0, 'Active'),
(4, 'Pizza Palace', 'Velachery, Chennai', '9000044444', 4.6, 'Active'),
(5, 'Dosa Corner', 'Mylapore, Chennai', '9000055555', 4.3, 'Active'),
(6, 'Biryani House', 'OMR, Chennai', '9000066666', 4.7, 'Active'),
(7, 'Tandoori Nights', 'Nungambakkam, Chennai', '9000077777', 4.5, 'Active'),
(8, 'Cafe Delight', 'Besant Nagar, Chennai', '9000088888', 4.2, 'Inactive'),
(9, 'Street Bites', 'Kodambakkam, Chennai', '9000099999', 4.1, 'Active'),
(10, 'Healthy Eats', 'ECR, Chennai', '9000012345', 4.4, 'Active');
