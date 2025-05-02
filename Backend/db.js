// Import the required SQL library
const sql = require("mssql");

// Configuration for the database connection
const config = {
  user: "yogi_eng", // Database username
  password: "jay@1612", // Database password
  server: "JAYBABARIYA", // SQL Server address
  database: "yogi_eng", // Database name
  options: {
    encrypt: false, // Encryption setting for the connection
    trustServerCertificate: true, // Trust the server certificate (bypassing certificate validation)
  },
};

let pool; // Variable to store the database connection pool

// Function to establish a connection to the database
async function connectDB() {
  try {
    // Check if the pool is not already connected
    if (!pool || !pool.connected) {
      pool = await sql.connect(config); // Establish connection to the database
      console.log("✅ Connected to SQL Server successfully!"); // Log successful connection
    }
    return pool; // Return the connection pool
  } catch (err) {
    console.error("❌ Database connection failed:", err.message); // Log any connection errors
    throw err; // Throw the error to be handled by the caller
  }
}

// Export the connectDB function to be used elsewhere in the application
module.exports = connectDB;
