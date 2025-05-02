import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css"; // Optional: custom styles

const Profile = () => {
  const navigate = useNavigate(); // Navigation hook to redirect users
  const [user, setUser] = useState({ name: "", email: "" }); // State to store user info

  useEffect(() => {
    // Get user data from localStorage
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    // If name or email is not found, show a warning and redirect to login
    if (!name || !email) {
      toast.warning("⚠️ You are not logged in!");
      navigate("/login"); // Redirect to login page
    } else {
      // If user data exists, set it in the state
      setUser({ name, email });
    }
  }, [navigate]); // The effect runs when the component mounts or when navigate changes

  const handleLogout = () => {
    // Clear all localStorage data and show a success message
    localStorage.clear();
    toast.success("✅ Logged out successfully.");

    // Redirect to login page after 1.5 seconds
    setTimeout(() => navigate("/login"), 1500);
  };

  return (
    <div className="container" style={{ paddingTop: "100px" }}>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" /> {/* Toast container for notifications */}
      <div className="card shadow-lg p-4 rounded profile_card">
        <h2 className="text-center mb-4">👤 Profile Information</h2>
        <div className="d-flex align-items-center mb-4">
          {/* Profile image */}
          <img
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Profile"
            className="rounded-circle me-4"
            style={{ width: "100px", height: "100px", objectFit: "cover" }}
          />
          <div>
            {/* Display user's name and email */}
            <h4 className="mb-1">{user.name}</h4>
            <p className="text-muted mb-0">{user.email}</p>
          </div>
        </div>
        <hr />
        <div className="text-center mt-4">
          {/* Buttons for navigation */}
          <button className="btn btn-outline-primary me-3" onClick={() => navigate("/")}>
            🏠 Go to Dashboard
          </button>
          <button className="btn btn-danger" onClick={handleLogout}>
            🔓 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
