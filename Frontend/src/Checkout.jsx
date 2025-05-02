import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css";

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate(); // For navigating to orders page after success
  const [cartItems] = useState(state.cartItems || []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Mobile validation regex for Indian numbers
  const isValidMobile = (mobile) => /^[6-9]\d{9}$/.test(mobile);

  // Handle order placement
  const handleOrderPlace = async () => {
    const user_id = localStorage.getItem("userId");

    // Check if user is logged in
    if (!user_id) {
      toast.error("❌ User not logged in.");
      return;
    }

    // Check if all fields are filled
    if (!name || !email || !mobile || !address) {
      toast.error("❌ Please fill in all fields!");
      return;
    }

    // Validate mobile number
    if (!isValidMobile(mobile)) {
      toast.error("⚠️ Invalid mobile number. Please enter a valid Indian number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/place-order", {
        user_id: parseInt(user_id),
        customer_name: name,
        customer_email: email,
        customer_mobile: mobile,
        shipping_address: address,
      });

      if (response.data.message === "✅ Order placed successfully!") {
        toast.success("✅ Order placed successfully!");
        setTimeout(() => {
          // Clear the form or reset state if needed
          setName("");
          setEmail("");
          setMobile("");
          setAddress("");
          // Navigate to the orders page
          navigate("/orders");
        }, 3000);
      } else {
        toast.error(response.data.message || "❌ Failed to place order.");
      }
    } catch (error) {
      console.error("Place Order Error:", error);
      toast.error("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container checkout_container py-5">
      <h3 className="text-center mb-4">🛍️ Checkout</h3>
      <div className="row">
        {/* Order Summary Section */}
        <div className="col-md-6">
          <h4 className="mb-3">📦 Order Summary</h4>
          <div className="card p-4 shadow-sm">
            <h5 className="mb-3">🛒 Items</h5>
            {cartItems.map((item) => (
              <div key={item.cart_id} className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={`/images/${item.image}`}
                  alt={item.product_name}
                  style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  className="rounded"
                />
                <div>
                  <h6>{item.product_name}</h6>
                  <p>₹{item.price} x {item.cart_quantity} = ₹{item.price * item.cart_quantity}</p>
                </div>
              </div>
            ))}
            <div className="d-flex justify-content-between mt-3">
              <h5>Total</h5>
              <h5>
                ₹{cartItems.reduce((acc, item) => acc + item.price * item.cart_quantity, 0).toLocaleString()}
              </h5>
            </div>
          </div>
        </div>

        {/* Shipping Details Section */}
        <div className="col-md-6">
          <h4 className="mb-3">📝 Shipping Details</h4>
          <div className="card p-4 shadow-sm">
            <div className="mb-3">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="mobile">Mobile</label>
              <input
                type="text"
                id="mobile"
                className="form-control"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address">Shipping Address</label>
              <textarea
                id="address"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={handleOrderPlace}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order 🛒"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
