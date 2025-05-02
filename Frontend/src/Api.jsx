import axios from 'axios';

// Get all products from the backend
export const getProducts = async () => {
  try {
    const response = await axios.get('/api/products');
    return response.data.products; // Return the product data directly
  } catch (error) {
    console.error("Error fetching products:", error);
    throw new Error("Error fetching products: " + error.message); // Include error message for more context
  }
};

// Add product to the cart
export const addToCart = async (userId, productId, quantity) => {
  try {
    const response = await axios.post('/api/add-to-cart', { userId, productId, quantity });
    return response.data.message; // Return the success message after adding to the cart
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Error adding to cart: " + error.message); // Include error message for more context
  }
};

// Get cart for a specific user
export const getCart = async (userId) => {
  try {
    const response = await axios.get(`/api/orders/${userId}`);
    return response.data.orders; // Ensure to return the 'orders' property if needed
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw new Error("Error fetching cart: " + error.message); // Include error message for more context
  }
};

// Remove item from the cart
export const removeFromCart = async (itemId) => {
  try {
    const response = await axios.delete('/api/remove-item', { data: { itemId } });
    return response.data.message; // Return the success message after removing the item
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw new Error("Error removing item from cart: " + error.message); // Include error message for more context
  }
};

// Place an order
export const placeOrder = async (userId, customerName, customerEmail, customerMobile, shippingAddress, orderItems) => {
  try {
    const response = await axios.post('/api/place-order', {
      user_id: userId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_mobile: customerMobile,
      shipping_address: shippingAddress,
      orderItems
    });
    return response.data.message; // Return the success message after placing the order
  } catch (error) {
    console.error("Error placing order:", error);
    throw new Error("Error placing order: " + error.message); // Include error message for more context
  }
};

// Get product stock for a specific product
export const getProductStock = async (productId) => {
  try {
    const response = await axios.get(`/api/product-stock/${productId}`);
    return response.data.stock; // Return the product stock value
  } catch (error) {
    console.error("Error fetching product stock:", error);
    throw new Error("Error fetching product stock: " + error.message); // Include error message for more context
  }
};
