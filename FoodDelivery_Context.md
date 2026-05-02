# FoodStation — Multi-Vendor Food Delivery System

## Project Overview
A full-stack multi-vendor food delivery platform (like EatSure/online food court) built as a DBMS project. Customers can order from **multiple restaurants in a single checkout**. The system demonstrates end-to-end database operations across Customer → Vendor → Admin dashboards.

**App Name:** FoodStation

---

## Current State
- **Frontend**: All 4 pages complete with premium DM Sans design system and FoodStation branding.
- **Backend**: Node.js + Express running on port 3000 with 6 API endpoints.
- **Database**: MySQL `fooddeliverydb` — 60 food items seeded (6 per vendor, 10 vendors).
- **Simulation**: Fully autonomous E2E simulation from Login → Customer (multi-vendor order) → Vendor → Admin.
- **Vendor Controls**: Order status dropdown (Placed/Preparing/Out for Delivery/Delivered) with live DB updates.

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
| `index.html` | Login — role selector, "Run System Simulation" button |
| `customer_portal.html` | Customer portal — browse, cart, multi-vendor checkout |
| `vendor_dashboard.html` | Vendor dashboard — orders with status dropdown, menu items |
| `admin_dashboard.html` | Admin panel — sidebar nav, metrics, all data tables |
| `app_server.js` | Express backend — API endpoints, DB connection, seeding |
| `.env` | `DB_PASSWORD=DarkSorcerer@014` |

---

## API Endpoints
| Method | Route | Description |
|---|---|---|
| GET | `/api/food-items` | All food items |
| GET | `/api/vendors` | All vendors |
| GET | `/api/customers` | All customers |
| GET | `/api/orders` | All orders (sorted by `OrderDate DESC`) |
| POST | `/api/orders` | Place new order (`{ total_amount, customer_id }`) |
| PUT | `/api/orders/:id/status` | Update order status (`{ status }`) |

---

## Database Schema

### `orders` (No AUTO_INCREMENT on OrderID)
Backend uses `SELECT MAX(OrderID) + 1` before every INSERT.
Columns: `OrderID`, `CustomerID`, `OrderDate`, `TotalAmount`, `OrderStatus`

### `food_items` (60 items, 6 per vendor)
Columns: `id`, `name`, `price`, `vendor_id`, `category`, `status`

### `vendors` (10 vendors)
Cuisine-specific Unsplash images mapped in `customer_portal.html` vendorImages object.

---

## Design System
| Token | Value |
|---|---|
| Font | `DM Sans` |
| Accent | `#E8380D` |
| Background | `#F8F8FA` |
| Surface | `#FFFFFF` |
| Border | `#E8E8EC` |
| Text | `#111` |
| Text Muted | `#6E6E73` |
| Login BG | `#000` with radial glow |

---

## E2E Simulation Flow
Uses `sessionStorage` to chain state across pages:
1. Login → Customer: Selects 2 vendors, adds item from each, multi-vendor checkout
2. Customer → Vendor: Highlights new order from DB
3. Vendor → Admin: Shows system-wide data highlighted
4. Clears session on completion

---

## Known Issues
- **No auth** — role-simulated via dropdown
- **No cart persistence** — JS memory only, lost on refresh
- **OrderID** — manual MAX+1 (no AUTO_INCREMENT)
- **Admin metrics** — hardcoded static values, not live DB queries

---

## How to Run
```bash
cd "c:\Users\ayush\Downloads\DBMS Project"
node app_server.js
# http://localhost:3000
```
Requires MySQL running + `.env` with `DB_PASSWORD=DarkSorcerer@014`.

---

## Next Steps
1. Live admin metrics — replace static stats with `COUNT(*)`/`SUM()` queries
2. Cart persistence — `localStorage`
3. Auth system — JWT or sessions
4. Real-time vendor updates — polling or WebSockets
5. Order items table — store individual food items per order
