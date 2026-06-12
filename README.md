# FashionCart — MERN Stack E-Commerce

A complete full-stack fashion e-commerce application built with the MERN stack.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | **React 18** + **Tailwind CSS v4** + **Vite** |
| Routing | **React Router v6** |
| HTTP Client | **Axios** |
| Backend | **Node.js** + **Express.js** |
| Database | **MongoDB Atlas** + **Mongoose** |
| Auth | **JWT** + **bcryptjs** |

## Features

- ✅ User Authentication (Register, Login, JWT)
- ✅ 66+ Products across 6 categories with real images
- ✅ Add to Cart with qty increment/decrement
- ✅ Wishlist
- ✅ 3-Step Checkout
- ✅ Order History with Order Tracking
- ✅ User Profile (edit info, address, password)
- ✅ AI Size Advisor (4-step wizard)
- ✅ Virtual Try-On (live camera + color switching)
- ✅ Shop The Look (curated outfit galleries)
- ✅ About, FAQ, Contact, Privacy, Terms pages
- ✅ Fully responsive design

## Run Locally

### Backend
```bash
cd backend
node server.js
# Runs on http://localhost:3000
```

### React Frontend
```bash
cd react-frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

## Demo Account
- Email: `suryasekar626@gmail.com`
- Password: `Surya@123`

## Project Structure
```
website-1/
├── backend/              Node.js + Express API
│   ├── routes/           Auth, Products, Cart, Wishlist, Orders, Contact
│   ├── database.js       MongoDB models (6 schemas)
│   └── server.js         Express server
├── react-frontend/       React + Tailwind frontend
│   └── src/
│       ├── components/   Navbar, Footer, CartSidebar, ProductCard, Toast
│       ├── context/      AuthContext, CartContext
│       ├── data/         Local product catalog (66 items)
│       ├── pages/        17 pages
│       └── utils/        Axios API client
└── frontend/             Legacy HTML/CSS version
```
