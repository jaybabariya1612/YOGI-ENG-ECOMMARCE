import { useEffect, useState } from "react"; // Import React hooks
import { Link } from "react-router-dom"; // Import Link for navigation to product details page
import "./Style.css"; // Import custom styles
import "./Media.css"; // Import media query specific styles

const Shop = () => {
  // States for managing products, loading, and error
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect to fetch products from the API on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Make a GET request to fetch products
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        
        // Check if the response is successful
        if (data.success) {
          setProducts(data.products); // Store products in state
        } else {
          console.error("Failed to load products:", data.message);
          setError("Failed to load products"); // Set error message if the API response is not successful
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Error fetching products"); // Handle network errors
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchProducts(); // Call the fetchProducts function
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <>
      <section className="our_product_section">
        {/* Section title */}
        <div className="our_products">
          <h1>Our Products</h1>
        </div>

        {/* Category links */}
        <div className="our_product_part">
          <h3><a href="#">MOTORS</a></h3>
          <h3><a href="#">FLOUR MILL</a></h3>
        </div>

        {/* Display products or loading/error state */}
        <div className="yogis_all_products">
          {loading ? (
            // Display loading message while products are being fetched
            <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>
              🕐 Loading products...
            </div>
          ) : error ? (
            // Display error message if there's an issue with fetching products
            <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem", color: "red" }}>
              {error}
            </div>
          ) : products.length > 0 ? (
            // If products are available, display them
            products.map((product) => (
              <div className="yogis_product m-auto" key={product.product_id}>
                <div className="yogis_product_top">
                  {/* Display product image */}
                  <img src={`/images/${product.image}`} alt={product.product_name} />
                </div>
                <div className="yogis_product_bottom">
                  {/* Display product name and price */}
                  <h1>{product.product_name}</h1>
                  <p><b>PRICE:</b> ₹{product.price.toFixed(2)}</p>
                  {/* Display rating stars */}
                  <div className="rating">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-regular fa-star">(4)</i>
                  </div>
                  {/* Link to product details page */}
                  <Link to={`/product/${product.product_id}`} className="yogis_product_bottom_button">
                    GET DETAILS
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // If no products are found, display a message
            <div style={{ textAlign: "center", padding: "2rem", fontSize: "1.2rem" }}>
              🕐 No products found...
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Shop;
