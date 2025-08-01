# 🛍️ CENG495 E-Commerce Web Application

This project is my submission for the CENG495 Cloud Computing assignment. It is a full-stack e-commerce application with both user and admin features, deployed publicly via Vercel and using MongoDB Atlas as the cloud database.

---

## 🔗 Live Deployment

**URL**: [https://ceng495-ecommerce-indol.vercel.app](https://ceng495-ecommerce-indol.vercel.app)  

---

## 🔐 Login Credentials

### Admin User
- **Username**: `admin`
- **Password**: `admin123`

### Regular Users
- **Username**: `rio`
- **Password**: `rio123`

- **Username**: `paris`
- **Password**: `paris123`

- **Username**: `tokyo`
- **Password**: `tokyo123`

---

## 🧱 Tech Stack & Architecture

| Layer        | Technology                          |
|-------------|--------------------------------------|
| Frontend     | Next.js (App Router) with TailwindCSS |
| Backend API | Next.js API Routes (App Router)      |
| Auth        | JWT (JSON Web Tokens) with Cookies   |
| Database    | MongoDB Atlas                        |
| ORM         | Mongoose (ODM for MongoDB)           |
| Deployment  | Vercel                                |

### Why These Technologies?

- **Next.js App Router**: Modern, full-stack React framework that supports server components and optimized routing.
- **MongoDB Atlas**: Cloud-hosted NoSQL database with flexible schemas ideal for dynamic data like reviews/items.
- **JWT Auth**: Secure and scalable authentication method with support for roles.
- **Tailwind CSS**: Clean and fast UI development.
- **Vercel**: Seamless deployment with GitHub integration and edge-optimized delivery.

---

## 👥 User Guide

### Public / Unauthenticated Users

- Can view the homepage with categories (Vinyls, Antique Furniture, GPS Watches, Running Shoes) along with trivial sale items.
- Can navigate into any category to see products inside.
- Can click **"Products"** to see every item.
- Can click any item to view further details.

### Registered Users

- Can login and logout from the navigation bar.
- Can submit a **review** and **rating (1–10)** for any product.
- Each review updates the product's average rating and is associated with the user.
- After clicking My Account and View Profile, user can view their overall average rating of items and whole review details with their corresponding item.

### Admin Capabilities

Once logged in as admin:

- Access the **Admin Dashboard** from the Navbar.
- Add new products with full details (including category-specific fields and image).
- Manage all items (delete).
- Add new users or delete existing users.
---

## 🧠 Design Decisions

- Categories and items are both accessible without login to simulate real e-commerce UX.
- Ratings are stored and updated in real-time by recalculating averages.
- Review objects are embedded under both `Item.Reviews` and `User.Reviews` to allow fast reverse lookups.
- Admin and regular user roles are handled through JWT claims.
- MongoDB’s schema flexibility is used to support fields that only apply to certain categories (like `BatteryLife`, `Material`, etc.).
- Deleting a review or user updates all related aggregate fields (`Rating`, `AverageRating`) automatically.

---

## ⚠️ Notes

- Image upload is not implemented; items use direct image links via URLs.

---
