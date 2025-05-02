import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css"; // Optional: Your custom CSS

const ResetPassword = () => {
  const { token } = useParams(); // Retrieve the reset token from URL params
  const navigate = useNavigate(); // Hook to navigate to other pages

  const [newPassword, setNewPassword] = useState(""); // State for the new password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming the new password
  const [loading, setLoading] = useState(false); // State to track if the request is loading
  const [tokenValid, setTokenValid] = useState(true); // State to track if the token is valid

  useEffect(() => {
    // Function to verify if the reset token is valid
    const verifyToken = async () => {
      try {
        // API request to verify the token
        const res = await axios.get(`http://localhost:5000/api/verify-token/${token}`);
        
        // If token verification fails, display error and set tokenValid to false
        if (!res.data.success) {
          toast.error("❌ Invalid or expired token.");
          setTokenValid(false);
        }
      } catch (err) {
        // Handle errors (e.g., token expired or invalid)
        toast.error("❌ Invalid or expired token.");
        setTokenValid(false);
      }
    };

    verifyToken();
  }, [token]); // This effect runs when the component mounts or when the token changes

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Password validation
    if (newPassword.length < 6) {
      toast.warning("⚠️ Password must be at least 6 characters long.");
      return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      toast.warning("⚠️ Passwords do not match.");
      return;
    }

    try {
      setLoading(true); // Set loading to true while the request is in progress
      // API request to reset the password
      const res = await axios.post("http://localhost:5000/api/reset-password", {
        token,
        newPassword,
      });

      // If password reset is successful, show success message and navigate to login
      if (res.data.success) {
        toast.success("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        // If password reset fails, display an error message
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (error) {
      // Handle any errors during the password reset process
      console.error("❌ Error resetting password:", error);
      toast.error("❌ Something went wrong. Try again.");
    } finally {
      setLoading(false); // Set loading to false after the request completes
    }
  };

  return (
    <div className="reset_password_container">
      <h2 className="text-center my-4">🔐 Reset Your Password</h2>

      {tokenValid ? (
        // If the token is valid, show the password reset form
        <form onSubmit={handleSubmit} className="reset_form">
          <div className="form_group">
            <input
              type="password"
              className="form-control mb-3"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} // Update newPassword state
              required
            />
          </div>
          <div className="form_group">
            <input
              type="password"
              className="form-control mb-4"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Processing..." : "🔒 Reset Password"} {/* Button text changes based on loading */}
          </button>
        </form>
      ) : (
        // If the token is invalid, display an error message
        <p className="text-center text-danger mt-4">
          🚫 This password reset link is no longer valid.
        </p>
      )}

      {/* Toast Container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ResetPassword;
