const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // Serve static files like html

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'food_delivery'
});

db.connect((err) => {
  if (err) console.error('DB connection error:', err);
  else console.log('Connected to MySQL database');
});

// API Routes
app.get('/api/customers', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/vendors', (req, res) => {
  db.query('SELECT * FROM vendors', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/food-items', (req, res) => {
  db.query('SELECT * FROM food_items', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders ORDER BY OrderDate DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post('/api/orders', (req, res) => {
  const { total_amount, customer_id } = req.body;
  const status = 'Placed';

  db.query('SELECT MAX(OrderID) as maxId FROM orders', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const nextOrderId = (rows[0].maxId || 0) + 1;
    const query = 'INSERT INTO orders (OrderID, OrderDate, TotalAmount, OrderStatus, CustomerID) VALUES (?, NOW(), ?, ?, ?)';
    
    db.query(query, [nextOrderId, total_amount, status, customer_id || 1], (insertErr) => {
      if (insertErr) return res.status(500).json({ error: insertErr.message });
      res.json({ success: true, orderId: nextOrderId });
    });
  });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  db.query('UPDATE orders SET OrderStatus = ? WHERE OrderID = ?', [status, id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Setup dummy tables if not exist on start
const setupSql = `
CREATE TABLE IF NOT EXISTS food_items (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), price INT, vendor_id INT, category VARCHAR(50), status VARCHAR(20));
CREATE TABLE IF NOT EXISTS orders (id INT AUTO_INCREMENT PRIMARY KEY, customer_id INT, vendor_id INT, date DATETIME DEFAULT CURRENT_TIMESTAMP, amount INT, status VARCHAR(20), payment VARCHAR(20));
CREATE TABLE IF NOT EXISTS customers (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), email VARCHAR(100) UNIQUE, phone VARCHAR(15), city VARCHAR(50));
CREATE TABLE IF NOT EXISTS vendors (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), location VARCHAR(200), contact VARCHAR(15), rating DECIMAL(2,1), status VARCHAR(20));

INSERT IGNORE INTO customers (id, name, email, phone, city) VALUES 
(1, 'Rahul Sharma', 'rahul@gmail.com', '9876543210', 'Chennai'),
(2, 'Anita Verma', 'anita@gmail.com', '9123456780', 'Bangalore'),
(3, 'Karan Mehta', 'karan@gmail.com', '9012345678', 'Mumbai'),
(4, 'Priya Nair', 'priya@gmail.com', '9988776655', 'Kerala'),
(5, 'Amit Singh', 'amit@gmail.com', '9871234567', 'Delhi'),
(6, 'Sneha Reddy', 'sneha@gmail.com', '9765432109', 'Hyderabad'),
(7, 'Vikram Patel', 'vikram@gmail.com', '9654321098', 'Ahmedabad'),
(8, 'Neha Kapoor', 'neha@gmail.com', '9543210987', 'Pune'),
(9, 'Rohit Das', 'rohit@gmail.com', '9432109876', 'Kolkata'),
(10, 'Pooja Iyer', 'pooja@gmail.com', '9321098765', 'Chennai');

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

INSERT IGNORE INTO food_items (id, name, price, vendor_id, category, status) VALUES 
(1, 'Paneer Butter Masala', 250, 1, 'Main Course', 'Available'),
(2, 'Garlic Naan', 60, 1, 'Breads', 'Available'),
(3, 'Dal Makhani', 200, 1, 'Main Course', 'Available'),
(4, 'Chicken Tikka', 280, 1, 'Starter', 'Available'),
(5, 'Mutton Curry', 350, 1, 'Main Course', 'Available'),
(6, 'Jeera Rice', 150, 1, 'Rice', 'Available'),
(7, 'Gulab Jamun', 80, 2, 'Dessert', 'Available'),
(8, 'Rasgulla', 90, 2, 'Dessert', 'Available'),
(9, 'Chocolate Cake', 150, 2, 'Dessert', 'Out of stock'),
(10, 'Vanilla Pastry', 120, 2, 'Dessert', 'Available'),
(11, 'Walnut Brownie', 140, 2, 'Dessert', 'Available'),
(12, 'Vanilla Ice Cream', 100, 2, 'Dessert', 'Available'),
(13, 'Veg Burger', 120, 3, 'Fast Food', 'Available'),
(14, 'Chicken Burger', 160, 3, 'Fast Food', 'Available'),
(15, 'Cheese Burger', 180, 3, 'Fast Food', 'Available'),
(16, 'French Fries', 90, 3, 'Sides', 'Available'),
(17, 'Coke (Medium)', 60, 3, 'Beverage', 'Available'),
(18, 'Chicken Nuggets', 140, 3, 'Sides', 'Available'),
(19, 'Margherita Pizza', 300, 4, 'Pizza', 'Available'),
(20, 'Pepperoni Pizza', 450, 4, 'Pizza', 'Available'),
(21, 'Farmhouse Pizza', 380, 4, 'Pizza', 'Available'),
(22, 'Garlic Bread', 150, 4, 'Sides', 'Available'),
(23, 'White Sauce Pasta', 250, 4, 'Pasta', 'Available'),
(24, 'Choco Lava Cake', 130, 4, 'Dessert', 'Available'),
(25, 'Masala Dosa', 90, 5, 'Breakfast', 'Available'),
(26, 'Plain Dosa', 70, 5, 'Breakfast', 'Available'),
(27, 'Idli Sambar', 60, 5, 'Breakfast', 'Available'),
(28, 'Medu Vada', 60, 5, 'Breakfast', 'Available'),
(29, 'Rava Dosa', 100, 5, 'Breakfast', 'Out of stock'),
(30, 'Filter Coffee', 40, 5, 'Beverage', 'Available'),
(31, 'Chicken Biryani', 220, 6, 'Main Course', 'Available'),
(32, 'Mutton Biryani', 320, 6, 'Main Course', 'Available'),
(33, 'Veg Biryani', 180, 6, 'Main Course', 'Available'),
(34, 'Egg Biryani', 190, 6, 'Main Course', 'Available'),
(35, 'Mixed Raita', 50, 6, 'Sides', 'Available'),
(36, 'Mirchi Ka Salan', 60, 6, 'Sides', 'Available'),
(37, 'Butter Chicken', 280, 7, 'Main Course', 'Available'),
(38, 'Tandoori Chicken', 320, 7, 'Starter', 'Available'),
(39, 'Butter Naan', 50, 7, 'Breads', 'Available'),
(40, 'Paneer Tikka', 240, 7, 'Starter', 'Available'),
(41, 'Dal Fry', 160, 7, 'Main Course', 'Available'),
(42, 'Sweet Lassi', 80, 7, 'Beverage', 'Available'),
(43, 'Cappuccino', 150, 8, 'Beverage', 'Available'),
(44, 'Espresso', 120, 8, 'Beverage', 'Available'),
(45, 'Mocha Frappe', 180, 8, 'Beverage', 'Available'),
(46, 'Club Sandwich', 160, 8, 'Snack', 'Available'),
(47, 'Blueberry Muffin', 110, 8, 'Dessert', 'Available'),
(48, 'Cold Coffee', 140, 8, 'Beverage', 'Available'),
(49, 'Vada Pav', 40, 9, 'Street Food', 'Available'),
(50, 'Pav Bhaji', 120, 9, 'Street Food', 'Available'),
(51, 'Pani Puri', 50, 9, 'Street Food', 'Available'),
(52, 'Bhel Puri', 60, 9, 'Street Food', 'Available'),
(53, 'Punjabi Samosa', 30, 9, 'Street Food', 'Available'),
(54, 'Masala Chai', 25, 9, 'Beverage', 'Available'),
(55, 'Greek Salad', 200, 10, 'Healthy', 'Available'),
(56, 'Caesar Salad', 220, 10, 'Healthy', 'Available'),
(57, 'Quinoa Bowl', 280, 10, 'Healthy', 'Available'),
(58, 'Green Detox Juice', 150, 10, 'Healthy', 'Available'),
(59, 'Grilled Chicken Salad', 260, 10, 'Healthy', 'Available'),
(60, 'Fresh Fruit Bowl', 180, 10, 'Healthy', 'Available');
`;

setupSql.split(';').forEach(query => {
  if (query.trim()) {
    db.query(query, (err) => { if(err) console.log(err.message) });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
