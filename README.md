# FoodStation — Multi-Vendor Food Delivery System

FoodStation is a full-stack multi-vendor food delivery platform developed as a DBMS project. It allows customers to order from multiple restaurants in a single checkout process, demonstrating end-to-end database operations across Customer, Vendor, and Admin roles.

## 🚀 Key Features
- **Multi-Vendor Checkout**: Order from multiple restaurants simultaneously.
- **Role-Based Dashboards**:
  - **Customer**: Browse food items by category/vendor and manage cart.
  - **Vendor**: Manage orders, update status (Placed, Preparing, Out for Delivery, Delivered), and view menu items.
  - **Admin**: Monitor system metrics, view all data tables, and manage platform health.
- **End-to-End Simulation**: Autonomous flow demonstrating the lifecycle of an order from placement to delivery.
- **Premium UI**: Modern design system using DM Sans typography and a vibrant red-orange accent (`#E8380D`).

## 🛠️ Tech Stack
| Layer | Technology |
|---|---|
| **Frontend** | Vanilla HTML5, CSS3 (Flexbox/Grid), JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Styling** | Google Fonts (DM Sans), Custom CSS |

## 📂 File Structure
- `index.html`: Role-based login and system simulation entry point.
- `customer.html`: Customer portal for browsing and ordering.
- `vendor.html`: Dashboard for restaurant owners to manage their orders.
- `food_delivery_admin_dashboard.html`: Comprehensive admin panel for platform monitoring.
- `server.js`: Express server handles API requests and MySQL connectivity.
- `schema.sql`: SQL script for database initialization and seeding.
- `.env`: Environment variables for database credentials.

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v14+)
- MySQL Server

### Database Setup
1. Create a database named `fooddeliverydb`.
2. Run the queries in `schema.sql` to create tables and seed initial data.

### Configuration
Create a `.env` file in the root directory with the following:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fooddeliverydb
```

### Running the App
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node server.js
   ```
3. Open `index.html` in your browser (or access via `http://localhost:3000`).

## 🔌 API Endpoints
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/food-items` | Fetch all available food items. |
| `GET` | `/api/vendors` | Fetch all registered vendors. |
| `GET` | `/api/customers` | Fetch all registered customers. |
| `GET` | `/api/orders` | Fetch all orders (latest first). |
| `POST` | `/api/orders` | Place a new order. |
| `PUT` | `/api/orders/:id/status` | Update the status of an existing order. |

## 🔮 Future Improvements
- **Live Metrics**: Replace static admin statistics with real-time SQL aggregations.
- **Authentication**: Implement JWT or Session-based authentication for secure access.
- **Persistence**: Add `localStorage` support for cart persistence across refreshes.
- **Real-time Updates**: Integrate WebSockets for instant order notifications to vendors.

---
Developed as a DBMS Project by [DarkSorcerer14](https://github.com/DarkSorcerer14).
