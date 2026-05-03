const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./')); 

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

app.post('/api/customers', (req, res) => {
  const { name, email, phone, city } = req.body;
  db.query('INSERT INTO customers (name, email, phone, city) VALUES (?, ?, ?, ?)', [name, email, phone, city], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId });
  });
});

app.post('/api/vendors', (req, res) => {
  const { name, location, contact, rating, status } = req.body;
  db.query('INSERT INTO vendors (name, location, contact, rating, status) VALUES (?, ?, ?, ?, ?)', [name, location, contact, rating || 4.0, status || 'Active'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, id: result.insertId });
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
  const { total_amount, customer_id, items } = req.body;
  const status = 'Placed';

  db.query('INSERT INTO orders (OrderDate, TotalAmount, OrderStatus, CustomerID) VALUES (NOW(), ?, ?, ?)', 
    [total_amount, status, customer_id || 1], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    
    const orderId = result.insertId;
    
    if (items && items.length > 0) {
      const values = items.map(item => [orderId, item.id, item.quantity || 1, item.price]);
      db.query('INSERT INTO order_items (order_id, food_id, quantity, price) VALUES ?', [values], (itemErr) => {
        if (itemErr) console.error('Error inserting order items:', itemErr);
        res.json({ success: true, orderId: orderId });
      });
    } else {
      res.json({ success: true, orderId: orderId });
    }
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

app.get('/api/orders-detailed', (req, res) => {
  db.query('SELECT o.*, c.name as customer_name FROM orders o LEFT JOIN customers c ON o.CustomerID = c.id ORDER BY o.OrderDate DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/food-items-detailed', (req, res) => {
  db.query('SELECT f.*, v.name as vendor_name FROM food_items f LEFT JOIN vendors v ON f.vendor_id = v.id', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/payments', (req, res) => {
  db.query('SELECT p.*, o.TotalAmount FROM payments p LEFT JOIN orders o ON p.order_id = o.OrderID ORDER BY p.date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/delivery-partners', (req, res) => {
  db.query('SELECT * FROM delivery_partners', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get('/api/dashboard-stats', (req, res) => {
  db.query('SELECT COUNT(*) as cnt, CAST(COALESCE(SUM(TotalAmount),0) AS SIGNED) as rev FROM orders', (e1, r1) => {
    if (e1) return res.status(500).json({ error: e1.message });
    db.query('SELECT COUNT(*) as cnt FROM vendors WHERE status="Active"', (e2, r2) => {
      if (e2) return res.status(500).json({ error: e2.message });
      db.query('SELECT COUNT(*) as cnt FROM customers', (e3, r3) => {
        if (e3) return res.status(500).json({ error: e3.message });
        res.json({ totalOrders: r1[0].cnt, totalRevenue: r1[0].rev, activeVendors: r2[0].cnt, totalCustomers: r3[0].cnt });
      });
    });
  });
});

// Setup dummy tables if not exist on start
const setupSql = `
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS delivery_partners;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS food_items;
DROP TABLE IF EXISTS vendors;
DROP TABLE IF EXISTS customers;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE IF NOT EXISTS food_items (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), price INT, vendor_id INT, category VARCHAR(50), status VARCHAR(20));
CREATE TABLE IF NOT EXISTS orders (OrderID INT AUTO_INCREMENT PRIMARY KEY, CustomerID INT, vendor_id INT, OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP, TotalAmount INT, OrderStatus VARCHAR(20), payment VARCHAR(20));
CREATE TABLE IF NOT EXISTS order_items (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, food_id INT, quantity INT, price INT, FOREIGN KEY (order_id) REFERENCES orders(OrderID));
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

INSERT IGNORE INTO orders (OrderID, CustomerID, vendor_id, OrderDate, TotalAmount, OrderStatus, payment) VALUES
(1, 1, 1, '2024-03-01 12:30:00', 330, 'Delivered', 'UPI'),
(2, 2, 2, '2024-03-02 14:15:00', 120, 'Delivered', 'Credit Card'),
(3, 3, 3, '2024-03-03 18:45:00', 250, 'Processing', 'Cash on Delivery'),
(4, 4, 4, '2024-03-04 10:15:00', 300, 'Placed', 'UPI'),
(5, 5, 5, '2024-03-05 13:45:00', 90, 'Delivered', 'Debit Card'),
(6, 6, 6, '2024-03-06 19:30:00', 220, 'Processing', 'Cash on Delivery'),
(7, 7, 7, '2024-03-07 20:00:00', 350, 'Placed', 'Credit Card'),
(8, 8, 8, '2024-03-08 11:20:00', 100, 'Delivered', 'UPI'),
(9, 9, 9, '2024-03-09 15:10:00', 280, 'Delivered', 'Net Banking'),
(10, 10, 10, '2024-03-10 18:00:00', 120, 'Processing', 'UPI');

CREATE TABLE IF NOT EXISTS payments (id INT AUTO_INCREMENT PRIMARY KEY, order_id INT, method VARCHAR(50), status VARCHAR(20), date DATETIME DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS delivery_partners (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100), phone VARCHAR(15), vehicle VARCHAR(50), avg_time VARCHAR(20), status VARCHAR(20));

INSERT IGNORE INTO payments (id, order_id, method, status, date) VALUES
(1,1,'UPI','Completed','2024-03-01 12:31:00'),(2,2,'Credit Card','Completed','2024-03-02 14:20:00'),
(3,3,'Cash on Delivery','Pending','2024-03-03 18:50:00'),(4,4,'UPI','Completed','2024-03-04 10:20:00'),
(5,5,'Debit Card','Completed','2024-03-05 13:50:00'),(6,6,'Cash on Delivery','Pending','2024-03-06 19:35:00'),
(7,7,'Credit Card','Completed','2024-03-07 20:05:00'),(8,8,'UPI','Completed','2024-03-08 11:25:00'),
(9,9,'Net Banking','Completed','2024-03-09 15:15:00'),(10,10,'UPI','Pending','2024-03-10 18:05:00');

INSERT IGNORE INTO delivery_partners (id, name, phone, vehicle, avg_time, status) VALUES
(1,'Arjun','9998887777','Bike','35 min','Available'),(2,'Ravi','9887776666','Scooter','25 min','Available'),
(3,'Manoj','9776665555','Bike','40 min','On delivery'),(4,'Suresh','9665554444','Bike','30 min','Available'),
(5,'Deepak','9554443333','Scooter','28 min','Available'),(6,'Ramesh','9443332222','Bike','45 min','On delivery'),
(7,'Kiran','9332221111','Bike','35 min','Available'),(8,'Ajay','9221110000','Scooter','20 min','Available'),
(9,'Naveen','9110009999','Bike','40 min','On delivery'),(10,'Harish','9009998888','Bike','25 min','Available');
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
