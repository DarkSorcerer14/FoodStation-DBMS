# FoodStation — Multi-Vendor Food Delivery System

## Project Overview
A full-stack multi-vendor food delivery platform (like EatSure/online food court) built as a DBMS project. Customers can order from **multiple restaurants in a single checkout**. The system demonstrates end-to-end database operations across Customer → Vendor → Admin dashboards.

**App Name:** FoodStation

---

## Current State
- **Frontend**: All 4 pages complete with premium DM Sans design system and FoodStation branding.
- **Backend**: Node.js + Express running on port 3000 with 11 API endpoints.
- **Database**: MySQL `fooddeliverydb` — 60 food items seeded (6 per vendor, 10 vendors), plus orders, payments, and delivery partners.
- **Simulation**: Fully autonomous E2E simulation from Login → Customer (multi-vendor order) → Vendor → Admin.
- **Vendor Controls**: Order status dropdown with live DB updates.
- **Admin Dashboard**: Fully dynamic — live metrics (Revenue, Orders, Customers), dynamic charts, and comprehensive data tables.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS (4 standalone pages) |
| Backend | Node.js + Express (port 3000) |
| Database | MySQL (`fooddeliverydb`) |
| Dependencies | `express`, `mysql2`, `cors`, `dotenv` |
| Font | DM Sans (Google Fonts) |
| Color Accent | `#E8380D` (red-orange) |

---

## File Structure
| File | Purpose |
|---|---|
| `index.html` | Entry Point — Login role selector, registration, "Run System Simulation" |
| `customer_portal.html` | Customer Portal — Browse restaurants, cart, multi-vendor checkout |
| `vendor_dashboard.html` | Vendor Dashboard — Manage orders, menu items, status updates |
| `admin_dashboard.html` | Admin Panel — Live metrics, Revenue charts, Data management |
| `app_server.js` | Express Backend — API endpoints, DB connection, seeding logic |
| `database_setup.sql` | SQL Schema — Table structures and initial seed data |
| `.env` | Environment Config — `DB_PASSWORD=DarkSorcerer@014` |

---

## API Endpoints
| Method | Route | Description |
|---|---|---|
| GET | `/api/food-items` | All food items |
| GET | `/api/food-items-detailed` | Food items with vendor names |
| GET | `/api/vendors` | All vendors |
| GET | `/api/customers` | All customers |
| POST | `/api/customers` | Register new customer |
| POST | `/api/vendors` | Register new vendor |
| GET | `/api/orders` | All orders |
| GET | `/api/orders-detailed` | Orders with customer names |
| POST | `/api/orders` | Place new order |
| PUT | `/api/orders/:id/status` | Update order status |
| GET | `/api/payments` | All transaction logs |
| GET | `/api/delivery-partners` | All delivery personnel |
| GET | `/api/dashboard-stats` | Aggregated metrics for Admin |

---

## Database Schema

### `orders` (AUTO_INCREMENT on OrderID)
Columns: `OrderID`, `CustomerID`, `vendor_id`, `OrderDate`, `TotalAmount`, `OrderStatus`, `payment`

### `food_items` (60 items)
Columns: `id`, `name`, `price`, `vendor_id`, `category`, `status`

### `payments`
Columns: `id`, `order_id`, `method`, `status`, `date`

### `delivery_partners`
Columns: `id`, `name`, `phone`, `vehicle`, `avg_time`, `status`

---

## Known Issues
- **No auth** — role-simulated via dropdown (Login emails pre-filled)
- **No cart persistence** — JS memory only
- **Order items** — individual items per order not yet stored in a separate table

---

## How to Run
```bash
cd "c:\Users\ayush\FoodStation_DBMS"
node app_server.js
# http://localhost:3000
```
Requires MySQL running + `.env` with `DB_PASSWORD=DarkSorcerer@014`.

---

## Next Steps
1. Cart persistence — `localStorage`
2. Auth system — JWT or sessions
3. Real-time vendor updates — polling or WebSockets
4. Order items table — store individual food items per order
5. Multi-city support — location-based vendor filtering
