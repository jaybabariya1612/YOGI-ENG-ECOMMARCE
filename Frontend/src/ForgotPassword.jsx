import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css"; // optional: shared styling

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enhanced email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      toast.warn("⚠️ Please enter your email.");
      return;
    }

    if (!emailRegex.test(email)) {
      toast.warn("⚠️ Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/forgot-password", {
        email,
      });

      if (response.data.success) {
        toast.success("📧 Reset link sent to your email!");
        setEmail(""); // Clear the email field
        // Optionally, redirect the user to the login page after 3 seconds
        setTimeout(() => {
          window.location.href = "/login"; 
        }, 3000);
      } else {
        toast.error(`❌ ${response.data.message || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("❌ Error sending reset link:", error);
      toast.error("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot_password_container">
      <h2 className="text-center mb-4">🔑 Forgot Password</h2>
      
      <p className="text-center mb-4">
        Please enter your registered email address. We will send a reset link to your email.
      </p>

      <form onSubmit={handleSubmit} className="reset_form">
        <div className="form_group mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
          />
        </div>
        <button
          type="submit"
          className="btn btn-orange w-100"
          disabled={loading}
        >
          {loading ? "Sending..." : "📨 Send Reset Link"}
        </button>
      </form>

      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ForgotPassword;
