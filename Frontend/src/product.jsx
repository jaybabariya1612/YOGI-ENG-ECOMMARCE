import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css";

// Component to manage the product quantity count in the cart
const ProductCartCount = ({ count, setCount }) => {
  // Increment the count value, ensuring it's <= 10
  const incrementCount = () => count < 10 && setCount(count + 1);

  // Decrement the count value, ensuring it's >= 1
  const decrementCount = () => count > 1 && setCount(count - 1);

  // Handle manual input change for the quantity
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 10) setCount(value); // Ensure value is between 1 and 10
  };

  // Handle blur event to correct invalid input values
  const handleBlur = () => {
    if (count < 1 || isNaN(count)) setCount(1); // Default to 1 if invalid
    else if (count > 10) setCount(10); // Ensure max count is 10
  };

  return (
    <div className="d-flex align-items-center gap-2 mt-3">
      <button className="btn btn-outline-secondary px-3" onClick={decrementCount}>
        <i className="bi bi-dash-lg"></i>
      </button>
      <input
        type="number"
        className="form-control text-center"
        value={count}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min="1"
        max="10"
        style={{ width: "70px" }}
      />
      <button className="btn btn-outline-secondary px-3" onClick={incrementCount}>
        <i className="bi bi-plus-lg"></i>
      </button>
    </div>
  );
};

const Product = () => {
  const { id } = useParams(); // Get the product ID from the URL params
  const [product, setProduct] = useState(null); // Store the product data
  const [count, setCount] = useState(1); // Store the quantity count of the product
  const [loading, setLoading] = useState(true); // Loading state while fetching the product
  const [error, setError] = useState(null); // Error state if fetching fails
  const navigate = useNavigate(); // Hook for navigation

  // Fetch the product details when the component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product); // Set product data if successful
        } else {
          setError("Product not found.");
        }
      } catch (err) {
        setError("Failed to fetch product.");
      } finally {
        setLoading(false); // Stop loading once fetch is completed
      }
    };
    fetchProduct();
  }, [id]); // Run the effect again if the product ID changes

  // Handle adding the product to the cart
  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId"); // Get the user ID from localStorage
    
    // Check if user is logged in
    if (!userId || isNaN(userId)) {
      toast.error("⚠️ Please log in to add products to the cart.");
      return;
    }

    try {
      // Send request to the server to add product to the cart
      const res = await fetch("http://localhost:5000/api/add-to-cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId), // Send the user ID
          productId: product.product_id, // Send the product ID
          quantity: count, // Send the selected quantity
        }),
      });

      const data = await res.json();
      data.success
        ? toast.success("✅ Product added to cart!") // Success message
        : toast.error(`❌ ${data.message || "Unable to add to cart"}`); // Error message
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error. Please try again later.");
    }
  };

  // Handle loading or error states
  if (loading) return <div className="p-5 text-center">🕐 Loading product...</div>;
  if (error) return <div className="p-5 text-danger text-center">{error}</div>;

  return (
    <>
      <div className="container py-4">
        {/* Breadcrumb navigation */}
        <div className="return_home">
          <Link to="/Shop" className="back_to_Shop">Shop / </Link>
          <span className="product_in_home">{product.product_name}</span>
        </div>

        {/* Product details section */}
        <div className="row g-4">
          <div className="col-md-5 mt-5 text-center">
            <img
              src={`/images/${product.image}`}
              alt={product.product_name}
              className="img-fluid rounded shadow-sm"
              style={{ maxHeight: "350px", objectFit: "contain" }}
            />
            <h3 className="mt-3 fw-semibold">{product.product_name}</h3>
          </div>

          <div className="col-md-7">
            <h5 className="mb-2 text-primary">Overview</h5>
            <p>{product.overview}</p>

            <h5 className="mt-4 text-primary">Key Features</h5>
            <ul className="ps-3">
              {product.key_features.split("\\n").map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <h5 className="mt-4 text-primary">Technical Specifications</h5>
            <div className="bg-light p-3 rounded">
              <pre className="product-specs">{product.technical_specs}</pre>
            </div>

            {/* In stock availability */}
            <div className="mt-3">
              <span className="badge text-black fs-6">
                ✅ In Stock: {product.stock}
              </span>
            </div>

            {/* Price of the product */}
            <div className="mt-3">
              <h4 className="text-success fw-bold">₹{product.price}</h4>
            </div>

            {/* Quantity selector */}
            <ProductCartCount count={count} setCount={setCount} />

            {/* Add to cart button */}
            <div className="mt-4">
              <button
                className="btn btn-lg btn-success w-100"
                onClick={handleAddToCart}
                disabled={product.stock <= 0} // Disable button if product is out of stock
              >
                {product.stock > 0 ? "Add to Cart" : "❌ Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </>
  );
};

export default Product;
