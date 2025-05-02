import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]); // State for cart items
  const [orders, setOrders] = useState([]); // State for orders
  const [showOrders, setShowOrders] = useState(false); // Flag to toggle between cart and orders view
  const navigate = useNavigate(); // Hook for navigation

  // Quantity Increment/Decrement Component
  const ProductCartCount = ({ item, setCartItems }) => {
    // Function to update cart item quantity on the server
    const updateCartItem = async (userId, cartId, newQuantity) => {
      try {
        const response = await fetch("http://localhost:5000/api/update-cart-item", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: parseInt(userId),
            cartId: parseInt(cartId),
            newQuantity: parseInt(newQuantity),
          }),
        });

        const data = await response.json();
        if (data.success) {
          toast.success("✅ Cart updated successfully.");
        } else {
          toast.error(data.message || "❌ Failed to update cart.");
        }
      } catch (error) {
        console.error("Error updating cart:", error);
        toast.error("❌ Failed to update cart.");
      }
    };

    // Increment quantity of the item
    const incrementCount = () => {
      if (item.cart_quantity < 10) {
        const newQuantity = item.cart_quantity + 1;
        updateQuantity(newQuantity);
      } else {
        toast.info("You can add a maximum of 10 items");
      }
    };

    // Decrement quantity of the item
    const decrementCount = () => {
      if (item.cart_quantity > 1) {
        const newQuantity = item.cart_quantity - 1;
        updateQuantity(newQuantity);
      } else {
        toast.info("Minimum quantity is 1");
      }
    };

    // Function to update quantity in state and on the server
    const updateQuantity = (newQuantity) => {
      setCartItems(prevItems =>
        prevItems.map(cartItem =>
          cartItem.cart_id === item.cart_id
            ? { ...cartItem, cart_quantity: newQuantity }
            : cartItem
        )
      );
      updateCartItem(localStorage.getItem("userId"), item.cart_id, newQuantity);
    };

    // Handle manual quantity input change
    const handleInputChange = (e) => {
      const value = parseInt(e.target.value);
      if (!isNaN(value) && value >= 1 && value <= 10) {
        updateQuantity(value);
      }
    };

    return (
      <div className="d-flex align-items-center gap-2 mt-2">
        {/* Decrement button */}
        <button className="btn btn-outline-dark px-3" onClick={decrementCount}>
          <i className="bi bi-dash-lg"></i>
        </button>
        
        {/* Quantity input field */}
        <input
          type="number"
          className="form-control text-center"
          value={item.cart_quantity}
          onChange={handleInputChange}
          min="1"
          max="10"
          style={{ width: "70px" }}
        />

        {/* Increment button */}
        <button className="btn btn-outline-dark px-3" onClick={incrementCount}>
          <i className="bi bi-plus-lg"></i>
        </button>
      </div>
    );
  };

  useEffect(() => {
    fetchCartData(); // Fetch the cart data when component mounts
    fetchOrders(); // Fetch the orders when component mounts

    // Listen to changes in localStorage and fetch cart data again
    const handleStorageChange = () => fetchCartData();
    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener when component unmounts
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Fetch cart data from the backend
  const fetchCartData = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.warning("⚠️ Please log in to view cart.");
      navigate("/Login"); // Redirect to Login if not logged in
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/cart/${userId}`);
      const data = await response.json();
      if (data.success) {
        setCartItems(data.cartItems); // Set cart items in state
      } else {
        setCartItems([]); // Set cart to empty if no items found
      }
    } catch (error) {
      toast.error("Error fetching cart data");
      console.error(error);
    }
  };

  // Fetch orders from the backend
  const fetchOrders = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:5000/api/orders/${userId}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders); // Set orders in state
      }
    } catch (error) {
      toast.error("Error fetching orders");
      console.error(error);
    }
  };

  // Remove an item from the cart
  const removeFromCart = async (cartId) => {
    try {
      const response = await fetch("http://localhost:5000/api/remove-item", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: cartId }),
      });

      const data = await response.json();
      if (data.success) {
        setCartItems(prevItems => prevItems.filter(item => item.cart_id !== cartId)); // Remove item from state
        toast.success("✅ Item removed from cart");
      } else {
        toast.error(data.message || "❌ Failed to remove item.");
      }
    } catch (error) {
      toast.error("❌ Failed to remove item.");
      console.error(error);
    }
  };

  // Handle proceeding to checkout
  const handleProceedToCheckout = () => {
    navigate("/Checkout", { state: { cartItems } }); // Pass cart items to checkout page
  };

  // Calculate the total price of the cart
  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.cart_quantity, 0);
  };

  return (
    <div className="container checkout_container py-5">
      {/* Display orders if showOrders is true */}
      {showOrders ? (
        <div className="orders_section">
          <h3 className="text-center mb-4 orders_title">📦 Your Orders</h3>
          {orders.length === 0 ? (
            <div className="text-center">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png"
                alt="No Orders"
                className="empty_orders_img"
              />
              <h5 className="my-3">You haven't placed any orders yet.</h5>
              <button className="btn btn-primary" onClick={() => setShowOrders(false)}>
                Back to Cart 🛒
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.order_id} className="card mb-4 shadow-sm p-3">
                <h5>🧾 Order ID: {order.order_id}</h5>
                <small className="text-muted">
                  {new Date(order.order_date).toLocaleDateString()}
                </small>
                <p className="mt-2">
                  <strong>👤 {order.customer_name}</strong> | 📧 {order.customer_email}
                </p>
                <p>🚚 {order.shipping_address}</p>
                <h6>🛒 Items:</h6>
                {order.items.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center gap-3 border rounded p-2 mb-2">
                    <img
                      src={`http://localhost:5000/images/${item.image}`}
                      alt={item.product_name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                      className="rounded"
                    />
                    <div>
                      <h6>{item.product_name}</h6>
                      <small>
                        ₹{item.order_price} x {item.order_quantity} ={" "}
                        <strong>₹{item.order_price * item.order_quantity}</strong>
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      ) : cartItems.length === 0 ? (
        // If cart is empty, show empty cart message
        <div className="text-center">
          <img
            src="/images/empty-cart.svg"
            alt="Empty Cart"
            className="empty_cart_img"
          />
          <h4 className="my-4">🛒 Your cart is empty</h4>
          <button className="btn btn-primary" onClick={() => navigate("/Orders")}>
            📦 View Orders
          </button>
          <button
            className="btn btn-outline-secondary ms-3"
            onClick={() => navigate("/Shop")}
          >
            Continue Shopping 🛍️
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-center mb-4">🛒 Your Cart</h3>
          {cartItems.map((item) => (
            <div key={item.cart_id} className="card mb-3 p-3 shadow-sm d-flex flex-row align-items-center">
              <img
                src={`/images/${item.image}`}
                alt={item.product_name}
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                className="rounded border me-3"
              />
              <div className="flex-grow-1">
                <h5>{item.product_name}</h5>
                <div className="d-flex align-items-center gap-3">
                  <span>Price: ₹{Number(item.price).toLocaleString()}</span>
                  <ProductCartCount item={item} setCartItems={setCartItems} />
                  <span>= <strong>₹{(item.price * item.cart_quantity).toLocaleString()}</strong></span>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => removeFromCart(item.cart_id)}
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}

          <div className="card p-4 shadow-sm mb-4">
            <h5 className="mb-3">🧾 Order Summary</h5>
            <p>Total Items: <strong>{cartItems.reduce((acc, item) => acc + item.cart_quantity, 0)}</strong></p>
            <p>Total Price: ₹<strong>{calculateTotal().toLocaleString()}</strong></p>
            <button className="btn btn-success w-100" onClick={handleProceedToCheckout}>
              Proceed to Checkout 🛍️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
