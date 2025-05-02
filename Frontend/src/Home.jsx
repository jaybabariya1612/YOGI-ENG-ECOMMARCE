import { useEffect, useState } from "react"; // Importing React hooks for state management and side effects
import { Link } from "react-router-dom"; // Importing Link component for navigation within the app
import "./Style.css"; // Importing the main CSS for styling
import "./Media.css"; // Importing additional CSS for media queries (responsive design)

const Home = () => {
  // Defining state variables:
  // - products: to hold the list of fetched products
  // - loading: to track the loading state of the product data
  // - error: to hold any error message if fetching products fails
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch product data from the API when the component mounts
  useEffect(() => {
    // Function to fetch products from the backend API
    const fetchProducts = async () => {
      try {
        // Fetching products from the API endpoint
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json(); // Parsing the JSON response

        // Check if the API call is successful
        if (data.success) {
          setProducts(data.products); // Update state with fetched products
        } else {
          console.error("Failed to load products:", data.message); // Log error if the response is unsuccessful
          setError(data.message || "Failed to load products"); // Update error state
        }
      } catch (err) {
        // Catching any errors during the fetch request
        console.error("Error fetching products:", err);
        setError(
          "Error fetching products, please check your internet connection."
        ); // Setting error state for network issues
      } finally {
        // Set loading to false once the data fetching is done (either success or failure)
        setLoading(false);
      }
    };

    // Calling the fetchProducts function to load data
    fetchProducts();
  }, []); // Empty dependency array means the effect will run only once, when the component mounts

  return (
    <>
      {/* Carousel Section */}
      <div className="section_carousel">
        <h2>Powering Industry</h2> {/* Heading for carousel section */}
        <h1>with Precision</h1> {/* Subheading for the carousel */}
        <p>High-Performance Induction Motors for Every Need!</p>{" "}
        {/* Description of products */}
        <Link className="Shop_now" to="/Shop">
          SHOP NOW
        </Link>{" "}
        {/* Link to the Shop page */}
      </div>

      {/* Tools and Accessories Section */}
      <div className="main_Tools_acc">
        <div className="tool_acc_one">
          <p>Tools & Accessories</p> {/* Label for tools and accessories */}
          <span>Save time </span> <br />
          <span> and money</span>
          <br />
          <Link className="Shop_now" to="/Shop">
            SHOP NOW
          </Link>{" "}
          {/* Link to the Shop page */}
        </div>
        <div className="tool_acc_two_three_main">
          <div className="tool_acc_two">
            {/* Individual product display within tools and accessories */}
            <div className="tool_acc_two_sub_one">
              <h2>A.C. BRAKE MOTOR</h2>
              <div>
                <div className="tool_acc_two_sub_one_left">
                  <ul>
                    <li>
                      <b>RANGE:</b> 0.5 HP to 10 HP
                    </li>
                    <li>
                      <b>PHASE:</b> THREE PHASE
                    </li>
                  </ul>
                  <p>
                    Being a leader in the industry, we are engaged in offering a
                    qualitative range of <b>AC Brake Motor</b> to our customers.
                  </p>
                  <h2>₹ 4,000/PIECE</h2>
                  <p>Price may vary as per quality and size.</p>
                </div>
                <div className="tool_acc_two_sub_one_right">
                  <img src="images/download copy.png" alt="" />{" "}
                  {/* Product image */}
                </div>
              </div>
            </div>
            <div className="tool_acc_two_sub_two">
              <h2>THREE PHASE VIBRATORY MOTOR</h2>
              <div>
                <div class="tool_acc_two_sub_two_left">
                  <ul>
                    <li>
                      <b>NO OF POLES:</b> 2
                    </li>
                    <li>
                      <b>PHASE:</b> THREE PHASE
                    </li>
                  </ul>
                  <p>
                    We are engaged in offering an optimum quality range of
                    <b>Vibratory Motor.</b>
                  </p>
                  <h2>₹ 4,000/PIECE</h2>
                  <p>Price may vary as per quality and size.</p>
                </div>
                <div className="tool_acc_two_sub_two_right">
                  <img src="images/download (2) copy.png" alt="" />{" "}
                  {/* Product image */}
                </div>
              </div>
            </div>
          </div>
          <div className="tool_acc_three">
            <div className="tool_acc_three_top">
              <h2>BENCH GRINDER</h2>
              <ul>
                <li>
                  <b>NO OF POLES:</b> 2
                </li>
                <li>
                  <b>PHASE:</b> THREE PHASE
                </li>
              </ul>
              <p>
                The "YOGI" double ended motorized bench grinders are sturdy,
                efficient & robust in construction, designed for accurate &
                general purpose of hand-dry grinding work in industries tool
                rooms, foundries, electroplating workshops & engineering shops.
              </p>
              <div className="tool_acc_three_top_none">
                <h2>₹ 4,000/PIECE</h2>
                <p>Price may vary as per quality and size.</p>
              </div>
            </div>
            <div className="tool_acc_three_bottom">
              <img src="images/download (3) copy 1.png" alt="" />{" "}
              {/* Product image */}
              <h2>₹ 4,000/PIECE</h2>
              <p>Price may vary as per quality and size.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Products Section */}
      <section className="our_product_section">
        <div className="our_products">
          <h1>Our Products</h1> {/* Heading for our products section */}
        </div>
        <div className="our_product_part">
          {/* Links to specific product categories */}
          <h3>
            <a href="#">MOTORS</a>
          </h3>
          <h3>
            <a href="#">FLOUR MILL</a>
          </h3>
        </div>

        <div className="yogis_all_products">
          {/* Conditional rendering based on loading and error state */}
          {loading ? (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                fontSize: "1.2rem",
              }}
            >
              🕐 Loading products...
            </div>
          ) : error ? (
            // If there's an error, display the error message
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                fontSize: "1.2rem",
                color: "red",
              }}
            >
              {error}
            </div>
          ) : products.length > 0 ? (
            // If products are fetched successfully, display them
            products.map((product) => (
              <div className="yogis_product m-auto" key={product.product_id}>
                <div className="yogis_product_top">
                  <img
                    src={`/images/${product.image}`}
                    alt={product.product_name}
                  />{" "}
                  {/* Product image */}
                </div>
                <div className="yogis_product_bottom">
                  <h1>{product.product_name}</h1> {/* Product name */}
                  <p>
                    <b>PRICE:</b> ₹{product.price.toFixed(2)}
                  </p>{" "}
                  {/* Product price */}
                  <div className="rating">
                    {/* Displaying product rating */}
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-regular fa-star">(4)</i>
                  </div>
                  {/* Link to the product details page */}
                  <Link
                    to={`/product/${product.product_id}`}
                    className="yogis_product_bottom_button"
                  >
                    GET DETAILS
                  </Link>
                </div>
              </div>
            ))
          ) : (
            // If no products are found, show a message
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                fontSize: "1.2rem",
              }}
            >
              🕐 No products found...
            </div>
          )}
        </div>
      </section>

      {/* About Us Section */}
      <div className="about_section">
        <div className="about_section_left">
          <img src="images/about us.jpg" alt="About Us" />{" "}
          {/* Image for About Us */}
        </div>
        <div className="about_section_right">
          <h6>ABOUT US</h6>
          <h1>Favourite Online Tools Shop</h1>
          <p>
            {/* Brief description about the company */}
            Founded in 2014, Yogi Engineering manufactures a wide range of
            motors and tools, ensuring the highest quality standards.
          </p>
          <a href="">
            <Link to="/Contact">CONTACT US</Link>
          </a>{" "}
          {/* Link to Contact Us page */}
        </div>
      </div>
    </>
  );
};

export default Home;
