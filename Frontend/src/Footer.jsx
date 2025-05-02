import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css";
import "./Media.css";


const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Email validation (basic regex)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error message

    try {
      // Simulate email submission (replace with actual API call if needed)
      console.log("Email submitted:", email);
      // Simulate API response (you can replace this with your actual backend logic)
      setTimeout(() => {
        toast.success("Signed up successfully!");
        navigate("/signup", { state: { email } });
      }, 1000);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="footer-main d-flex justify-content-around flex-wrap">
        <div className="brand-logo d-flex justify-content-center align-items-center brand_logo flex-column">
          <img
            src="images/Yogi Engineering Logo (1) 1.svg"
            alt=""
            height="250px"
            width="250px"
          />
          <p>
            17, Rajmani Estate, Near 137 LBS, Rakhial, Bapunagar, Ahmedabad - 380024, Gujarat, India
          </p>
        </div>

        <div className="d-flex flex-column justify-content-center align-items-center Explore">
          <h3>Explore</h3>
          <Link to="/About" className="text-decoration-none">About Us</Link>
          <Link to="/Contact" className="text-decoration-none">Contact</Link>
          <Link to="/Shop" className="text-decoration-none">Shop</Link>
          <Link to="/Service" className="text-decoration-none">Service</Link>
        </div>

        <div className="footer-follow-us d-flex flex-column justify-content-center align-items-center social">
          <h3>Social</h3>
          <a href="mailto:jaybabariya01@gmail.com" className="text-decoration-none">Email</a>
          <a href="https://www.facebook.com/profile.php?id=100074902613733" className="text-decoration-none">Facebook</a>
          <a href="https://www.instagram.com/jaybabariya_01?igsh=MTBhcGo1cXdrYjR0bg==" className="text-decoration-none">Instagram</a>
          <a href="https://wa.me/9408271133?text=Hello%20I%20want%20to%20inquire%20about..." className="text-decoration-none">WhatsApp</a>
        </div>

        <div className="footer-sign-up d-flex flex-column justify-content-center align-items-center">
          <p className="text-center">
            Sign up with your email address to receive news and updates.
          </p>
          <div className="sign-up">
            <form className="d-flex" onSubmit={handleSubmit}>
              <input
                type="email"
                className="form-control w-100"
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn" disabled={loading}>
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </form>
            {error && <p className="text-danger mt-2">{error}</p>}
          </div>
        </div>

        <div className="hr"></div>
        <div className="yogis_rights">
          <p>@2013-2025 Yogi Engineering. All rights reserved</p>
        </div>
      </div>
    </>
  );
};

export default Footer;
