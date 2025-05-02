// Importing necessary React hooks, components, and libraries
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom"; // Navigation hooks for route handling
import { GoogleLogin } from "@react-oauth/google"; // Google login component
import { jwtDecode } from "jwt-decode"; // JWT decode utility for Google login response
import { toast, ToastContainer } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Importing Toast CSS for styling

const Login = () => {
  // State to manage form input values, authentication status, and user info
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const navigate = useNavigate(); // Hook for navigation programmatically

  // useEffect hook to check if user is already logged in by checking localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    // If token and user info exist in localStorage, set authenticated state
    if (token && name) {
      setIsAuthenticated(true);
      setUserInfo({ name, email });
    }
  }, []);

  // Handle input change in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (email and password login)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    try {
      // Making a POST request to the login API
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      // If login is successful, set authentication state and store user data in localStorage
      if (data.success) {
        toast.success("✅ Login successful!"); // Show success notification
        localStorage.setItem("token", data.token); // Save token
        localStorage.setItem("userId", data.userId); // Save user ID
        localStorage.setItem("name", data.name); // Save name
        localStorage.setItem("email", data.email); // Save email
        setIsAuthenticated(true); // Set user as authenticated
        setUserInfo({ name: data.name, email: data.email }); // Set user info
      } else {
        toast.error(`❌ ${data.message}`); // Show error notification if login fails
      }
    } catch (err) {
      console.error("❌ Error:", err);
      toast.error("❌ Login failed. Please check your connection."); // Show error if there's a network issue
    }
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = async (response) => {
    try {
      // Decode the JWT token received from Google login
      const decoded = jwtDecode(response.credential);

      // Send Google login details to the backend for verification and account creation/login
      const googleResponse = await fetch(
        "http://localhost:5000/api/google-login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: decoded.name,
            email: decoded.email,
            googleId: decoded.sub,
          }),
        }
      );

      const result = await googleResponse.json();

      // If Google login is successful, save data in localStorage and set user state
      if (result.success) {
        toast.success("✅ Google login successful!"); // Success notification
        localStorage.setItem("token", result.token); // Save token
        localStorage.setItem("userId", result.userId); // Save user ID
        localStorage.setItem("name", result.name); // Save name
        localStorage.setItem("email", result.email); // Save email
        setIsAuthenticated(true); // Set user as authenticated
        setUserInfo({ name: result.name, email: result.email }); // Set user info
      } else {
        toast.error(`❌ ${result.message}`); // Show error message if Google login fails
      }
    } catch (error) {
      console.error("❌ Google login error:", error);
      toast.error("❌ Failed to login with Google."); // Show error if there's an issue with Google login
    }
  };

  // Handle Google login failure
  const handleGoogleLoginFailure = () => {
    toast.error("❌ Google login failed. Please try again."); // Show error notification if Google login fails
  };

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.clear(); // Clear user data from localStorage
    setIsAuthenticated(false); // Set authenticated state to false
    setUserInfo({ name: "", email: "" }); // Reset user info
    toast.success("✅ Successfully logged out!"); // Show success notification
    navigate("/login"); // Redirect to login page
  };

  // If the user is already authenticated, show the welcome page with user info
  if (isAuthenticated) {
    return (
      <div className="after_login_container" style={{ paddingTop: "100px" }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <h2 className="text-center mt-4 ">🎉 Welcome, {userInfo.name}!</h2>
        <p className="text-center">You are successfully logged in with:</p>
        <div className="user_details_box text-center">
          <p>
            <strong>👤 Name:</strong> {userInfo.name}
          </p>
          <p>
            <strong>📧 Email:</strong> {userInfo.email || "Not Provided"}
          </p>
        </div>
        <div className="action_buttons text-center mt-4">
          <Link to="/profile" className="btn btn-info mx-2">
            👤 View Profile
          </Link>
          <Link to="/orders" className="btn btn-success mx-2">
            📦 View Orders
          </Link>
          <button onClick={handleLogout} className="btn btn-danger mx-2">
            🚪 Logout
          </button>
        </div>
      </div>
    );
  }

  // If the user is not authenticated, show the login form
  return (
    <div className="login_wrapper">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="login_card">
        <div className="login_info_panel">
          <h2 className="app_name">YOGI ENGINEERING</h2>
          <p className="app_tagline">Secure. Fast. Reliable.</p>
          <img
            src="images/login-illustration.svg.svg"
            alt="Login Illustration"
            className="login_illustration"
          />
        </div>

        <div className="login_form_container">
          <div className="login_form">
            <h1 className="login_title">Welcome Back!</h1>
            <form onSubmit={handleSubmit}>
              <div className="form_group">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Your Email"
                  required
                />
              </div>
              <div className="form_group">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter Your Password"
                  required
                />
              </div>

              <h4 className="or_text">Or</h4>

              <div className="google_login">
                <GoogleLogin
                  onSuccess={handleGoogleLoginSuccess}
                  onError={handleGoogleLoginFailure}
                />
              </div>

              <div className="form_extra d-flex">
                <div className="remember_me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember Me</label>
                </div>
                <Link to="/ForgotPassword" className="forgot_password">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="login_btn">
                Login
              </button>

              <p className="register_text">
                Don't have an account?{" "}
                <Link to="/signup" className="register_link">
                  Register Now
                </Link>
              </p>

              <p className="register_text">
                Prefer mobile login?{" "}
                <Link to="/MobileLogin" className="register_link">
                  Login with Mobile OTP
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
