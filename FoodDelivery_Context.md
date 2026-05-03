# FoodStation — Multi-Vendor Food Delivery System

## Project Overview
A full-stack multi-vendor food delivery platform built as a DBMS project. The system demonstrates end-to-end database operations across Customer → Vendor → Admin dashboards.

**App Name:** FoodStation

---

## Current State
- **Frontend**: All 4 pages complete with premium DM Sans design system.
- **Backend**: Node.js + Express (Port 3000) with 12 API endpoints.
- **Database**: MySQL `fooddeliverydb` — Comprehensive schema with orders, payments, and delivery partners.
- **Admin Dashboard**: 100% Dynamic — Enhanced high-contrast typography for accessibility. Live metrics, dynamic charts, and comprehensive data tables.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS |
| Backend | Node.js + Express |
| Database | MySQL |

---

## API Endpoints
| Method | Route | Description |
|---|---|---|
| GET | `/api/dashboard-stats` | Aggregated metrics for Admin |
| GET | `/api/orders-detailed` | Orders with customer names |
| GET | `/api/food-items-detailed` | Food items with vendor names |
| GET | `/api/payments` | All transaction logs |
| GET | `/api/delivery-partners` | All delivery personnel |
| GET | `/api/customers` | All customers |
| GET | `/api/vendors` | All vendors |
| POST | `/api/orders` | Place new order |
| PUT | `/api/orders/:id/status` | Update order status |

---

## Database Schema
### `orders`
`OrderID`, `CustomerID`, `vendor_id`, `OrderDate`, `TotalAmount`, `OrderStatus`, `payment`

---

## How to Run
1. Ensure MySQL is running.
2. Update `.env` with your `DB_PASSWORD`.
3. `node app_server.js`
4. Open `http://localhost:3000/index.html`

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
