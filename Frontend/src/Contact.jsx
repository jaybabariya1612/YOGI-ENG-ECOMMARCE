import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side email validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("⚠️ Invalid email address.");
      return;
    }

    setLoading(true); // Set loading state to true during submission

    try {
      const response = await axios.post("http://localhost:5000/api/contact", formData);
      toast.success("Message sent successfully!");

      // Reset form data
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("❌ Error sending message:", error.response?.data || error);
      toast.error("❌ Failed to send message. Try again later.");
    } finally {
      setLoading(false); // Set loading state to false after submission attempt
    }
  };

  return (
    <>
      <h1 className="contact_title">Contact Us</h1>
      <div className="contact_form">
        <form onSubmit={handleSubmit}>
          <div className="full_name">
            <div className="first_name">
              <input
                type="text"
                name="firstName"
                placeholder="Enter Your First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="last_name">
              <input
                type="text"
                name="lastName"
                placeholder="Enter Your Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="Email">
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="message">
            <textarea
              name="message"
              placeholder="Enter Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
            ></textarea>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>

      {/* Toast Container for notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        pauseOnHover
        closeOnClick
        draggable
      />
    </>
  );
};

export default Contact;
