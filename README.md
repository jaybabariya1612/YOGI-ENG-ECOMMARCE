Here’s your polished, ready-to-use **README.md** for the **Yogi Engineering E-Commerce Application**, perfectly formatted for GitHub:

````markdown
# 🛍️ Yogi Engineering E-Commerce Application

A full-stack e-commerce platform built using **React** (Frontend), **Node.js + Express** (Backend), and **SQL Server** (Database). This application supports user authentication, product browsing, shopping cart management, order checkout, and service inquiries with a clean and responsive UI.

---

## 🚀 Features

- 🔐 **User Authentication**: Secure login/signup with JWT, Google login, and mobile OTP support.  
- 🛒 **Product Listing & Detail View**: Dynamic product fetching from database, including detailed individual views.  
- 🧺 **Shopping Cart**: Add/remove items, quantity management, and real-time total updates.  
- 💳 **Checkout System**: Input user address, review cart items, and place an order.  
- 📬 **Contact & Service Forms**: Submit general inquiries or request services with validation and toast feedback.  
- 📱 **Responsive Design**: Optimized for desktop and mobile with modern UI/UX practices.  

---

## 🛠️ Tech Stack

| Layer       | Technologies                            |
|-------------|---------------------------------------|
| Frontend    | React, React Router, React Toastify   |
| Backend     | Node.js, Express                      |
| Database    | SQL Server                          |
| Styling     | Bootstrap, Custom CSS                 |
| Auth & API  | JWT, bcrypt, Axios                    |

---

## 📁 Folder Structure

```plaintext
YOGI_ENG/
├── Backend/
│   ├── db.js
│   ├── server.js
│   ├── routes/
│   │   └── auth.js
│   ├── models/
│   └── .env
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── About.jsx
│   │   ├── Api.jsx
│   │   ├── App.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Layout.jsx
│   │   ├── Login.jsx
│   │   ├── Media.css
│   │   ├── MobileLogin.jsx
│   │   ├── Orders.jsx
│   │   ├── Product.jsx
│   │   ├── ProductCartCount.jsx
│   │   ├── Profile.jsx
│   │   ├── ResetPassword.jsx
│   │   ├── Service.jsx
│   │   ├── Shop.jsx
│   │   ├── Signup.jsx
│   │   └── Style.css
````

---

## 🧰 Installation & Setup

### 📦 Prerequisites

* Node.js & npm
* SQL Server (configured with user, password, and database)
* Postman (optional, for API testing)

### 🔧 Setup Steps

```bash
# Clone the repository
git clone https://github.com/jaybabariya1612/YOGI-ENG-ECOMMARCE.git
cd YOGI_ENG

# Backend setup
cd Backend
npm install
# Create a .env file (see template below)
node server.js

# Frontend setup
cd ../Frontend
npm install
npm start
```

### 📄 .env Template (Backend)

```
PORT=5000
DB_USER=your_sql_user
DB_PASSWORD=your_sql_password
DB_SERVER=your_sql_server
DB_DATABASE=your_database_name
JWT_SECRET=your_jwt_secret
```

---

## 🌐 Local URLs

* Frontend: `http://localhost:3000`
* Backend: `http://localhost:5000`

---

## 💡 Key Pages

| Component                     | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `Login.jsx`                   | Login via email/password, Google, or mobile OTP |
| `Signup.jsx`                  | User registration with validation               |
| `Shop.jsx`                    | List all products with detail view links        |
| `Product.jsx`                 | Individual product details                      |
| `Cart.jsx`                    | View and modify shopping cart                   |
| `Checkout.jsx`                | Place an order with shipping information        |
| `Orders.jsx`                  | View user order history                         |
| `Contact.jsx` / `Service.jsx` | Submit contact or service inquiries             |

---

## 🔌 API Endpoints

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | `/api/register`    | User registration      |
| POST   | `/api/login`       | Email/password login   |
| POST   | `/api/otp-login`   | Mobile OTP login       |
| GET    | `/api/products`    | Fetch all products     |
| GET    | `/api/product/:id` | Fetch product by ID    |
| POST   | `/api/cart`        | Add to cart            |
| POST   | `/api/order`       | Submit an order        |
| POST   | `/api/service`     | Submit service inquiry |

---

## 🧪 Testing

* Frontend manually tested on multiple browsers and devices
* Backend tested with Postman API calls
* Toast notifications provide feedback for all form actions

---

## 📎 Notes

* Ensure all product images are stored under `/public/images/` with correct filenames
* Update `.env` and API URLs before deployment to production
* Consider lazy loading heavy components for better performance

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to fork the repo and submit pull requests.

---

## 📄 License

MIT License © \[Jay Babariya]
