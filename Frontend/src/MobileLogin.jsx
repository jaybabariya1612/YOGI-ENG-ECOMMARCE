import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // For showing toast notifications
import { useNavigate } from "react-router-dom"; // For navigation after successful login
import "react-toastify/dist/ReactToastify.css"; // CSS for toast notifications

// MobileLogin Component
const MobileLogin = () => {
  const [mobile, setMobile] = useState(""); // State to store the mobile number
  const [otp, setOtp] = useState(""); // State to store the OTP entered by the user
  const [isOTPSent, setIsOTPSent] = useState(false); // Flag to indicate if OTP has been sent
  const navigate = useNavigate(); // Hook to navigate to another page after successful login

  // Function to handle OTP sending to the provided mobile number
  const handleSendOTP = async () => {
    // Validate the mobile number format (Indian mobile number)
    if (!/^(\+91)?[6-9]\d{9}$/.test(mobile)) {
      return toast.error("⚠️ Enter a valid Indian mobile number."); // Show error if invalid
    }

    try {
      // Send the mobile number to the backend to generate and send OTP
      const res = await fetch("http://localhost:5000/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile }), // Send mobile number in request body
      });

      const data = await res.json();

      // Handle the response from the backend
      if (data.success) {
        toast.success("📲 OTP sent successfully!"); // Show success notification
        setIsOTPSent(true); // Set OTP sent flag to true to display OTP input field
      } else {
        toast.error(`❌ ${data.message}`); // Show error message from backend if OTP send fails
      }
    } catch (err) {
      toast.error("❌ Failed to send OTP."); // Show general error if request fails
    }
  };

  // Function to verify the entered OTP
  const handleVerifyOTP = async () => {
    try {
      // Send the mobile number and OTP to the backend for verification
      const res = await fetch("http://localhost:5000/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: mobile, otp }), // Send both mobile and OTP for verification
      });

      const data = await res.json();

      // Handle the response from the backend
      if (data.success) {
        toast.success("✅ OTP verified. Logged in!"); // Show success notification on successful OTP verification
        // Store the user data and token in localStorage for authentication
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("name", data.name);
        localStorage.setItem("email", data.email);
        setTimeout(() => navigate("/"), 2000); // Redirect to the homepage after 2 seconds
      } else {
        toast.error(`❌ ${data.message}`); // Show error message if OTP verification fails
      }
    } catch (err) {
      toast.error("❌ OTP verification failed."); // Show error if verification fails
    }
  };

  return (
    <div className="login_wrapper">
      <ToastContainer position="top-right" autoClose={3000} /> {/* Toast container for notifications */}
      <div className="login_card">
        <div className="login_info_panel">
          <h2 className="app_name">YOGI ENGINEERING</h2>
          <p className="app_tagline">Secure. Fast. Reliable.</p>
          <img
            src="images/login-illustration.svg.svg" // Login illustration
            alt="Login Illustration"
            className="login_illustration"
          />
        </div>

        <div className="login_form_container">
          <div className="login_form">
            <h1 className="login_title">Login with Mobile</h1>
            
            {/* Mobile number input */}
            <div className="form_group">
              <input
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)} // Update mobile number state on change
                placeholder="Enter Indian Mobile Number"
              />
            </div>

            {/* OTP input visible after OTP is sent */}
            {isOTPSent && (
              <div className="form_group">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)} // Update OTP state on change
                  placeholder="Enter OTP"
                />
              </div>
            )}

            {/* Show button to send OTP or verify OTP based on isOTPSent state */}
            {!isOTPSent ? (
              <button onClick={handleSendOTP} className="login_btn mt-2">Send OTP</button>
            ) : (
              <button onClick={handleVerifyOTP} className="login_btn mt-2">Verify OTP</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileLogin;
