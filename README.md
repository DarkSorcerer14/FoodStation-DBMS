# FoodStation — Multi-Vendor Food Delivery System

FoodStation is a full-stack multi-vendor food delivery platform developed as a Database Management Systems (DBMS) project. It enables customers to order from multiple restaurants within a single checkout process, showcasing end-to-end database operations across Customer, Vendor, and Admin roles.

## Key Features
- **Multi-Vendor Checkout**: Seamlessly order from multiple restaurants in a single transaction.
- **Role-Based Dashboards**:
  - **Customer Portal**: Browse food items by category or vendor, manage shopping carts, and place orders.
  - **Vendor Dashboard**: Manage incoming orders, update real-time status (Placed, Preparing, Out for Delivery, Delivered), and monitor menu items.
  - **Admin Panel**: Monitor system-wide metrics, view all data tables, and manage platform health.
- **End-to-End Simulation**: An autonomous flow demonstrating the complete lifecycle of an order from placement to final delivery.
- **Modern UI Design**: High-fidelity design system utilizing DM Sans typography and a professional color palette with a vibrant red-orange accent (`#E8380D`).

## Technical Stack
| Layer | Technology |
|---|---|
| **Frontend** |HTML5, CSS3, JavaScript |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |

## Project Structure
- `portal_login.html`: Entry point featuring role-based authentication simulation and system flow triggers.
- `customer_portal.html`: Primary interface for customer browsing and order placement.
- `vendor_dashboard.html`: Management interface for restaurant owners to process orders.
- `admin_dashboard.html`: Comprehensive administrative dashboard for platform oversight.
- `app_server.js`: Express application handling REST API endpoints and database connectivity.
- `database_setup.sql`: Database definition and initial data seeding script.
- `.env`: Secure configuration for database credentials and environment variables.

## Installation and Setup

### Prerequisites
- Node.js (Version 14 or higher)
- MySQL Server

### Database Initialization
1. Create a new MySQL database named `fooddeliverydb`.
2. Execute the `database_setup.sql` script to initialize tables and seed the initial dataset.

### Configuration
Configure your database credentials by creating a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=fooddeliverydb
```

### Execution
1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the application server:
   ```bash
   node app_server.js
   ```
3. Access the application by opening `portal_login.html` in a web browser or navigating to `http://localhost:3000`.

## API Documentation
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/food-items` | Retrieves all available food items. |
| `GET` | `/api/vendors` | Retrieves a list of all registered vendors. |
| `GET` | `/api/customers` | Retrieves a list of all registered customers. |
| `GET` | `/api/orders` | Retrieves order history, sorted by most recent first. |
| `POST` | `/api/orders` | Creates a new order record in the database. |
| `PUT` | `/api/orders/:id/status` | Updates the status of a specific order. |

## Future Development
- **Dynamic Analytics**: Transition from static administrative metrics to live SQL-aggregated data.
- **Secure Authentication**: Implement JWT or session-based authentication protocols.
- **Cart Persistence**: Utilize `localStorage` or server-side sessions for persistent shopping carts.
- **Real-time Notifications**: Integrate WebSockets for instantaneous order alerts to vendors.

---

### Developed By
- **Ayush Aryan** (RA2411003012173)
- **Vivek Kumar Prusty** (RA2411003012179)
