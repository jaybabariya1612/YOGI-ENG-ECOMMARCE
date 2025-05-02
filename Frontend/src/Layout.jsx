// Importing necessary hooks and components from React Router and CSS files
import { Outlet, Link, useLocation } from "react-router-dom"; // Outlet to render child components, Link for navigation, useLocation to track the current path
import "./Style.css"; // Importing custom styles for the layout
import "./Media.css"; // Importing media query styles

const Layout = () => {
  // Using useLocation hook to track the current location (path) of the app for active link highlighting
  const location = useLocation(); 

  return (
    <>
      {/* <!-- navbar start --> */}
      <nav className="navbar navbar-expand-lg position-fixed w-100 z-3 nav_bar" id="navbar">
        {/* Container for the navbar content */}
        <div className="container-fluid">
          {/* Logo with a link to the Home page */}
          <a className="navbar-brand ps-0 ps-sm-5 brand_logo" href="#">
            <Link to="/Home">
              {/* Logo image */}
              <img src="images/Yogi Engineering Logo (1) 1.svg" alt="" />
            </Link>
          </a>

          {/* Navbar toggle button for mobile view */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar collapse for mobile and tablet screens */}
          <div
            className="collapse navbar-collapse text-center pe-0 pe-sm-5 bg-white"
            id="navbarNav"
          >
            {/* Navbar items (links) */}
            <ul className="navbar-nav ms-auto nav_item">
              {/* Home link */}
              <li className="nav-item">
                <Link
                  to="/home"
                  className={`nav-link fs-4 ${location.pathname === "/home" ? "active" : ""}`} // Dynamically adding 'active' class based on the current route
                >
                  Home
                </Link>
              </li>

              {/* Shop link */}
              <li className="nav-item">
                <Link
                  to="/Shop"
                  className={`nav-link fs-4 ${location.pathname === "/Shop" ? "active" : ""}`}
                >
                  Shop
                </Link>
              </li>

              {/* About Us link */}
              <li className="nav-item">
                <Link
                  to="/About"
                  className={`nav-link fs-4 ${location.pathname === "/About" ? "active" : ""}`}
                >
                  About Us
                </Link>
              </li>

              {/* Contact Us link */}
              <li className="nav-item">
                <Link
                  to="/Contact"
                  className={`nav-link fs-4 ${location.pathname === "/Contact" ? "active" : ""}`}
                >
                  Contact Us
                </Link>
              </li>

              {/* Service link */}
              <li className="nav-item">
                <Link
                  to="/Service"
                  className={`nav-link fs-4 ${location.pathname === "/Service" ? "active" : ""}`}
                >
                  Service
                </Link>
              </li>

              {/* Cart link */}
              <li className="nav-item">
                <Link
                  to="/Cart"
                  className={`nav-link fs-4 ${location.pathname === "/Cart" ? "active" : ""}`}
                >
                  Cart
                </Link>
              </li>

              {/* Login link */}
              <li className="nav-item">
                <Link
                  to="/Login"
                  className={`nav-link fs-4 ${location.pathname === "/Login" ? "active" : ""}`}
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {/* <!-- navbar end --> */}

      {/* Rendering the child components here, this will be replaced with the content of the current route */}
      <Outlet />
    </>
  );
};

export default Layout;
