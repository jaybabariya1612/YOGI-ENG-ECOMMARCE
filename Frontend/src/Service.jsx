import { useState } from "react";
import { toast, ToastContainer } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Styles for toast notifications

const Service = () => {
  // State for form fields to store input values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    gender: "",
    city: "",
    state: "",
    address: "",
    inquiry: "",
  });

  // Handle input field changes and update the state accordingly
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically update the state
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh on form submit

    try {
      // Sending the form data to the backend API
      const response = await fetch("http://localhost:5000/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sending JSON data
        },
        body: JSON.stringify(formData), // Convert the form data to JSON
      });

      // Handle successful submission
      if (response.ok) {
        toast.success("Inquiry submitted successfully!"); // Show success toast
        // Reset form data after submission
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          mobile: "",
          gender: "",
          city: "",
          state: "",
          address: "",
          inquiry: "",
        });
      } else {
        toast.error("❌ Failed to submit inquiry. Please try again."); // Error on failure
      }
    } catch (err) {
      console.error("❌ Error:", err); // Log the error to the console
      toast.error("❌ Error submitting inquiry. Please check your connection."); // Show error toast
    }
  };

  return (
    <>
      {/* Title of the form */}
      <h1 className="Service_title">Service Inquiry Form</h1>
      {/* Brief description or tagline */}
      <p className="text-center p-2">
        "Your satisfaction is our priority! Let us know how we can better serve
        you." 😊
      </p>

      {/* The form for service inquiry */}
      <div className="Service_form">
        <form onSubmit={handleSubmit}> {/* Form submission triggers handleSubmit */}
          
          {/* First Name & Last Name Input Fields */}
          <div className="first_last_name d-flex">
            <div className="service_first_name">
              <input
                type="text"
                name="firstName" // Identifies the field
                value={formData.firstName} // Binds input value to state
                onChange={handleChange} // Updates state on change
                placeholder="Enter Your First Name" // Placeholder text
                required // Marks the field as required
              />
            </div>
            <div className="service_last_name">
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Your Last Name"
                required
              />
            </div>
          </div>

          {/* Email & Mobile Input Fields */}
          <div className="email_mobile d-flex">
            <div className="service_email">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Your Email"
                required
              />
            </div>
            <div className="service_mobile">
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="Enter Your Mobile No"
                pattern="[6-9]{1}[0-9]{9}" // Validates mobile number format
                maxLength="10" // Restrict to 10 characters
                required
              />
            </div>
          </div>

          {/* Gender Selection (Radio Buttons) */}
          <div className="gender">
            <div className="form_group_radio d-flex">
              <label className="gender_label">Gender:</label>
              <div className="male_female d-flex">
                <div className="gender_option">
                  <input
                    type="radio"
                    id="male"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"} // Check if this value is selected
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="male">Male</label>
                </div>
                <div className="gender_option">
                  <input
                    type="radio"
                    id="female"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="female">Female</label>
                </div>
              </div>
            </div>
          </div>

          {/* City & State Input Fields */}
          <div className="city_state d-flex">
            <div className="city">
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter Your City"
                required
              />
            </div>
            <div className="state">
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter Your State"
                required
              />
            </div>
          </div>

          {/* Address Input (Text Area) */}
          <div className="service_Address">
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter Your Address"
              rows="3"
              required
            />
          </div>

          {/* Inquiry Input (Text Area) */}
          <div className="service_inqiry">
            <textarea
              name="inquiry"
              value={formData.inquiry}
              onChange={handleChange}
              placeholder="Describe Your Inquiry Here"
              rows="3"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        closeOnClick
        pauseOnHover
        draggable
      />
    </>
  );
};

export default Service;
