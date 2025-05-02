import React, { useState } from "react"; // Import React hooks
import { useNavigate, Link } from "react-router-dom"; // Import hooks for navigation
import { toast, ToastContainer } from "react-toastify"; // Import toast for notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS for styling

const SignUp = () => {
  // State for form data (user details)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State to toggle visibility of passwords
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate(); // Hook for navigation after successful registration

  // Handle input changes for form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("❌ Passwords do not match."); // Show error if passwords don't match
      return;
    }

    try {
      // Make a POST request to the backend API for registration
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), // Send the form data as JSON
      });

      const data = await response.json();
      if (response.ok && data.success) {
        toast.success("✅ Registration successful!"); // Show success message
        setTimeout(() => navigate("/login"), 2000); // Redirect to login page after 2 seconds
      } else {
        toast.error(`❌ ${data.message}`); // Show error message if registration fails
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Registration failed. Try again later."); // Handle network or other errors
    }
  };

  return (
    <div className="login_wrapper">
      {/* Toast container for notifications */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />

      <div className="login_card">
        {/* Left Panel: Illustration and app information */}
        <div className="login_info_panel">
          <h2 className="app_name">YOGI ENGINEERING</h2>
          <p className="app_tagline">Welcome to your new journey!</p>
          <img
            src="images/signup-illustration.svg.svg"
            alt="Signup Illustration"
            className="login_illustration"
          />
        </div>

        {/* Right Panel: Registration form */}
        <div className="login_form_container">
          <form className="login_form" onSubmit={handleSubmit}>
            <h2 className="signup_title">Create Your Account</h2>

            {/* First Name input */}
            <div className="form_group">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Last Name input */}
            <div className="form_group">
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email input */}
            <div className="form_group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password input with toggle visibility */}
            <div className="form_group" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {showPassword ? "🙈" : "👁️"} {/* Toggle password visibility */}
              </span>
            </div>

            {/* Confirm Password input with toggle visibility */}
            <div className="form_group" style={{ position: "relative" }}>
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <span
                onClick={() => setShowConfirm(!showConfirm)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
              >
                {showConfirm ? "🙈" : "👁️"} {/* Toggle confirm password visibility */}
              </span>
            </div>

            {/* Terms & Conditions agreement */}
            <div className="form_extra d-flex">
              <div className="remember_me">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <a href="#" className="register_link">
                    Terms & Conditions
                  </a>
                </label>
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="login_btn">
              Sign Up
            </button>

            {/* Login link for users who already have an account */}
            <p className="register_text">
              Already have an account?{" "}
              <Link to="/login" className="register_link">
                Login Here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
