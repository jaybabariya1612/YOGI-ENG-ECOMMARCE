// ✅ Importing necessary modules and components
import React from "react"; // Importing React
import ReactDOM from "react-dom/client"; // Importing ReactDOM for rendering the app
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Importing routing components for navigation
import { GoogleOAuthProvider } from "@react-oauth/google"; // Importing Google OAuth provider for Google login

import "./index.css"; // Importing global CSS styles
import reportWebVitals from "./reportWebVitals"; // Importing web vitals for performance monitoring

// Importing layout and pages
import Layout from "./Layout"; 
import Footer from "./Footer"; 

// Importing page components for routing
import Home from "./Home";
import Shop from "./Shop";
import About from "./About";
import Contact from "./Contact";
import Service from "./Service";
import Login from "./Login";
import SignUp from "./Signup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Product from "./product";
import Cart from "./Cart";
import Checkout from "./Checkout";
import Orders from "./Orders";
import MobileLogin from "./MobileLogin";
import ProductCartCount from "./ProductCartCount";
import Profile from "./Profile";
import { ToastContainer } from "react-toastify"; // Importing ToastContainer for global toast notifications

// ✅ Google OAuth Client ID
const GOOGLE_CLIENT_ID = "68874597550-pdc2lt629urgq8mbkd4mm5sig963k284.apps.googleusercontent.com"; // Google OAuth Client ID for authentication

// ✅ AppRoutes function with all nested routes
function AppRoutes() {
  return (
    <BrowserRouter> {/* Wrapping all routes with BrowserRouter for client-side routing */}
      <div>
        <Routes>
          {/* Layout route, which serves as the parent for all nested routes */}
          <Route path="/" element={<Layout />}>
            {/* Nested routes under the Layout component */}
            <Route index element={<Home />} /> {/* Home page */}
            <Route path="Home" element={<Home />} /> {/* Another Home route for "/Home" */}
            <Route path="Shop" element={<Shop />} /> {/* Shop page */}
            <Route path="About" element={<About />} /> {/* About page */}
            <Route path="Contact" element={<Contact />} /> {/* Contact page */}
            <Route path="Service" element={<Service />} /> {/* Service page */}
            <Route path="Login" element={<Login />} /> {/* Login page */}
            <Route path="SignUp" element={<SignUp />} /> {/* Sign-up page */}
            <Route path="ForgotPassword" element={<ForgotPassword />} /> {/* Forgot password page */}
            <Route path="ResetPassword/:token" element={<ResetPassword />} /> {/* Reset password page with token param */}
            <Route path="product/:id" element={<Product />} /> {/* Product details page with dynamic product ID */}
            <Route path="Cart" element={<Cart />} /> {/* Cart page */}
            <Route path="Checkout" element={<Checkout />} /> {/* Checkout page */}
            <Route path="Orders" element={<Orders />} /> {/* Orders page */}
            <Route path="MobileLogin" element={<MobileLogin />} /> {/* Mobile login page */}
            <Route path="ProductCartCount" element={<ProductCartCount />} /> {/* Product cart count page */}
            <Route path="Profile" element={<Profile />} /> {/* Profile page */}
            {/* Optional: 404 route for handling unknown paths */}
            <Route path="*" element={<h1>404 - Page Not Found</h1>} /> {/* Fallback route for unmatched paths */}
          </Route>
        </Routes>

        {/* ✅ Footer that appears on all pages */}
        <Footer />

        {/* ✅ ToastContainer for global toast notifications */}
        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </BrowserRouter>
  );
}

// ✅ Render the app into the DOM
const root = ReactDOM.createRoot(document.getElementById("Appdemo")); // Finding the root element with ID "Appdemo"
root.render(
  <React.StrictMode> {/* StrictMode for identifying potential problems in the app */}
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}> {/* Wrapping the app with Google OAuth provider for Google login */}
      <AppRoutes /> {/* Rendering the AppRoutes component which contains the routing logic */}
    </GoogleOAuthProvider>
  </React.StrictMode>
);

// ✅ Report web vitals (optional, for performance analysis)
reportWebVitals();
