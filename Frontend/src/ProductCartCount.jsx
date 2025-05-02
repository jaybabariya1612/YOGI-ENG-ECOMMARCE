import React from "react";

// Component to manage the quantity of a product in the cart
const ProductCartCount = ({ productId, stock, count, onCountChange }) => {
  // Increase the count if it's less than the available stock
  const increase = () => {
    if (count < stock) {
      onCountChange(productId, count + 1); // Update count in parent component
    }
  };

  // Decrease the count, ensuring it doesn't go below 1
  const decrease = () => {
    if (count > 1) {
      onCountChange(productId, count - 1); // Update count in parent component
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      {/* Decrease quantity button */}
      <button onClick={decrease} className="px-3 py-1 bg-gray-200 rounded">
        -
      </button>

      {/* Display the current count */}
      <span>{count}</span>

      {/* Increase quantity button, disabled when count reaches stock limit */}
      <button
        onClick={increase}
        className="px-3 py-1 bg-gray-200 rounded"
        disabled={count >= stock}
      >
        +
      </button>
    </div>
  );
};

export default ProductCartCount;
