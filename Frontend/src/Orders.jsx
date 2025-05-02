import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Style.css"; // Assuming this file contains relevant styles

const Orders = () => {
  const [orders, setOrders] = useState([]); // To store orders fetched from the API
  const [loading, setLoading] = useState(true); // Loading state while fetching orders

  // Fetch orders when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      const userId = localStorage.getItem("userId"); // Get user ID from localStorage

      if (!userId) {
        toast.warning("⚠️ No user ID found. Please log in first.");
        setLoading(false);
        return;
      }

      try {
        // Fetch orders from the server based on user ID
        const response = await fetch(`http://localhost:5000/api/orders/${userId}`);
        const data = await response.json();

        // Log the response data for debugging
        console.log("API Response:", data);

        if (data.success && data.orders.length > 0) {
          setOrders(data.orders); // Store fetched orders in state
        } else {
          toast.info("📦 No orders found.");
          setOrders([]); // No orders found, set orders to empty array
        }
      } catch (error) {
        console.error("❌ Error fetching orders:", error);
        toast.error("❌ Failed to fetch orders. Try again later.");
      } finally {
        setLoading(false); // Set loading to false once the fetch operation is completed
      }
    };

    fetchOrders();
  }, []);

  // Function to handle order cancellation
  const cancelOrder = async (orderId) => {
    const userId = localStorage.getItem("userId"); // Get user ID from localStorage

    if (!userId) {
      toast.warning("⚠️ No user ID found. Please log in first.");
      return;
    }

    // Ask for confirmation before canceling the order
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/cancel/${orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }), // Pass user ID in the request body
        });

        const data = await response.json();

        if (data.success) {
          toast.success("✅ Order cancelled successfully.");
          
          // Update the orders state with the cancelled order status
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.order_id === orderId
                ? { ...order, order_status: "Cancelled" } // Mark the order as cancelled
                : order
            )
          );
        } else {
          toast.error("❌ Failed to cancel the order. Try again later.");
        }
      } catch (error) {
        console.error("❌ Error cancelling order:", error);
        toast.error("❌ Failed to cancel the order. Try again later.");
      }
    }
  };

  // If the orders are still loading, show a loading message
  if (loading) {
    return <h4 className="text-center my-5">⏳ Loading your orders...</h4>;
  }

  // If no orders are found, show a message and a button to continue shopping
  if (orders.length === 0) {
    return (
      <>
        <div className="orders_empty text-center my-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4436/4436481.png"
            alt="No Orders"
            className="empty_orders_img"
          />
          <h4 className="my-4">📦 You haven't placed any orders yet.</h4>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/")} // Redirect to home page to continue shopping
          >
            Continue Shopping 🛍️
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} theme="colored" closeOnClick pauseOnHover draggable />
      </>
    );
  }

  // Return the list of orders if available
  return (
    <div className="orders_container my-4 mt-0">
      <h3 className="text-center mb-4 orders_title">📦 Your Orders</h3>

      {orders.map((order) => (
        <div key={order.order_id} className="order_card shadow-sm p-3 mb-4 border rounded">
          <h5 className="order_header">
            🧾 Order ID: {order.order_id} - Placed on{" "}
            {new Date(order.order_date).toLocaleDateString() !== "Invalid Date"
              ? new Date(order.order_date).toLocaleDateString()
              : "Date not available"}
          </h5>
          <p>
            <b>👤 Name:</b> {order.customer_name || "Name not available"} | <b>📧 Email:</b> {order.customer_email || "Email not available"}
          </p>
          <p>
            <b>🚚 Shipping Address:</b> {order.shipping_address || "Address not available"}
          </p>

          {/* If the order is cancelled, display a message */}
          {order.order_status === "Cancelled" && (
            <p className="text-danger mt-2">
              <b>❌ This order has been cancelled</b>
            </p>
          )}

          <div className="order_items">
            <h6 className="my-3 ">🛒 Order Items:</h6>
            {order.items.length > 0 ? (
              order.items.map((item, index) => {
                const price = Number(item.order_price) || 0;
                const quantity = Number(item.order_quantity) || 1;
                const total = price * quantity;

                return (
                  <div key={index} className="order_item d-flex mb-2 p-2 border rounded">
                    <img
                      src={`/images/${item.image}`}
                      alt={item.product_name || "Default product name"}
                      className="order_item_img me-3"
                    />
                    <div className="order_item_details">
                      <h6 className="product_name">{item.product_name || "Product name not available"}</h6>
                      <p>
                        Price: ₹{price.toLocaleString()} x {quantity} ={" "}
                        <b className="total_price">₹{total.toLocaleString()}</b>
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No items found for this order</p>
            )}
          </div>

          <div className="order_summary p-2 mt-3 shadow-sm rounded">
            <p>
              <b>🛒 Total Items:</b>{" "}
              {order.items.reduce((acc, item) => acc + (Number(item.order_quantity) || 1), 0)}
            </p>
            <p>
              <b>💰 Total Amount:</b> ₹
              {order.items
                .reduce(
                  (acc, item) =>
                    acc + (Number(item.order_price) || 0) * (Number(item.order_quantity) || 1),
                  0
                )
                .toLocaleString()}
            </p>
          </div>

          {/* Show the cancel button if the order is not cancelled yet */}
          <div className="text-center mt-3">
            {order.order_status !== "Cancelled" && (
              <button className="btn btn-danger" onClick={() => cancelOrder(order.order_id)}>
                🛑 Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default Orders;
