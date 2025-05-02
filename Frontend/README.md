Here’s a polished and ready-to-use **GitHub `README.md`** for your **Yogi Engineering E-Commerce Application**, based on the structure and features you've shared:

---

```markdown
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
|-------------|-----------------------------------------|
| Frontend    | React, React Router, React Toastify     |
| Backend     | Node.js, Express                        |
| Database    | SQL Server                              |
| Styling     | Bootstrap, Custom CSS                   |
| Auth & API  | JWT, bcrypt, Axios                      |

---

## 📁 Folder Structure

```

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

- Node.js & npm
- SQL Server (configured with user, password, and DB)
- Postman (optional for API testing)

### 🔧 Setup Steps

```bash
# Clone the repo
git clone <gh repo clone jaybabariya1612/YOGI-ENG-ECOMMARCE>
cd YOGI_ENG

# Setup Backend
cd Backend
npm install
# Create a .env file using the template below
node server.js

# Setup Frontend
cd ../Frontend
npm install
npm start
````

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

| Component                   | Description                                     |
| --------------------------- | ----------------------------------------------- |
| `Login.jsx`                 | Login via email/password, Google, or mobile OTP |
| `Signup.jsx`                | User registration with form validation          |
| `Shop.jsx`                  | All products with GET DETAILS links             |
| `Product.jsx`               | Individual product details                      |
| `Cart.jsx`                  | View, update, and remove cart items             |
| `Checkout.jsx`              | Place an order with shipping info               |
| `Orders.jsx`                | View past orders by user                        |
| `Contact.jsx`/`Service.jsx` | Submit contact or service inquiry forms         |

---

## 🔌 API Endpoints

| Method | Endpoint           | Function                  |
| ------ | ------------------ | ------------------------- |
| POST   | `/api/register`    | User registration         |
| POST   | `/api/login`       | Email/password login      |
| POST   | `/api/otp-login`   | Mobile OTP login          |
| GET    | `/api/products`    | Get all products          |
| GET    | `/api/product/:id` | Get product details by ID |
| POST   | `/api/cart`        | Add product to cart       |
| POST   | `/api/order`       | Submit order              |
| POST   | `/api/service`     | Submit service inquiry    |

---

## 🧪 Testing

* **Frontend**: Manually tested in-browser with various form scenarios.
* **Backend**: API tested via Postman and functional checks.
* **Toast notifications**: Shown for success/error feedback across all forms.

---

## 📎 Notes

* Ensure all product images are in `/public/images/` with correct filenames.
* Update `.env` and API base URLs if deploying to production or external host.
* Optimize performance by lazy loading heavy components if needed.

---


## 🤝 Contributing

Feel free to fork this repository, raise issues, or suggest improvements. Pull requests are welcome.

---

## 📄 License

MIT License © [JAY BABARIYA]

```

---

Let me know if you'd like to:
- Include screenshots
- Add deployment (e.g., Vercel/Render/Azure)
- Write a `CONTRIBUTING.md` file or GitHub Actions workflow
```
