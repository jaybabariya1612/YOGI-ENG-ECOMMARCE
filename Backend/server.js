require("dotenv").config(); // Load .env variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./db");
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const router = express.Router();
const authRoutes = require("./routes/auth");
const jwt = require("jsonwebtoken");
const path = require("path");
const twilio = require("twilio");

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
const PORT = 5000;

// ============ Email Configuration ============
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Transporter error:", error);
  } else {
    console.log("✅ Transporter is ready to send emails.");
  }
});

const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.response}`);
  } catch (error) {
    console.error(`❌ Error sending email: ${error}`);
  }
};

// ============ Serve React Build ============
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  });
}

// ============ Order Confirmation Email ============
const sendOrderEmail = async (customerEmail, customerName, orderDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: "🛒 Order Confirmation",
    html: `
      <h3>Hi ${customerName},</h3>
      <p>Thank you for your order! Here are your order details:</p>
      <ul>
        ${orderDetails
          .map(
            (item) =>
              `<li>${item.product_name} - Qty: ${item.order_quantity}, Price: ₹${item.order_price}</li>`
          )
          .join("")}
      </ul>
      <p>We will notify you once your order is shipped. 🎉</p>
    `,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${customerEmail}`);
};

// ============ CORS Configuration ============
app.use(cors());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());

// ============ Twilio Setup ============
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;

const client = twilio(accountSid, authToken);

// ============ WhatsApp Message Function ============
const sendWhatsAppMessage = async (mobile, customerName, orderDetails) => {
  const message = `
Hi ${customerName}, 🛒
Thank you for your order! Here’s your order summary:
${orderDetails
  .map(
    (item) =>
      `👉 ${item.product_name} - Qty: ${item.order_quantity}, Price: ₹${item.order_price}`
  )
  .join("\n")}
🎉 We will notify you when your order is on its way!
  `;

  try {
    const response = await client.messages.create({
      from: twilioNumber,
      to: `whatsapp:${mobile}`,
      body: message,
    });

    console.log(`✅ WhatsApp message sent to ${mobile}: ${response.sid}`);
    return { success: true, message: "✅ WhatsApp message sent successfully!" };
  } catch (error) {
    console.error(`❌ Error sending WhatsApp message: ${error.message}`);
    return { success: false, message: "❌ Failed to send WhatsApp message." };
  }
};

// ============ API Endpoint ============
app.post("/api/send-whatsapp", async (req, res) => {
  const { mobile, customerName, orderDetails } = req.body;

  if (!mobile || !customerName || !orderDetails || orderDetails.length === 0) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Missing required fields. Please provide all order details.",
    });
  }

  const result = await sendWhatsAppMessage(mobile, customerName, orderDetails);
  res.status(result.success ? 200 : 500).json(result);
});

// ✅ Contact Form Submission Endpoint
app.post("/api/contact", async (req, res) => {
  const { firstName, lastName, email, message } = req.body;
  console.log("Received Contact Data:", req.body);

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("firstName", sql.NVarChar, firstName)
      .input("lastName", sql.NVarChar, lastName)
      .input("email", sql.NVarChar, email)
      .input("message", sql.NVarChar, message)
      .query(
        "INSERT INTO contacts (first_name, last_name, email, message) VALUES (@firstName, @lastName, @email, @message)"
      );

    res.status(200).send("✅ Message sent successfully!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
    res.status(500).send("❌ Failed to send message. Try again later.");
  }
});

/* ------------------------
✅ Service Inquiry API
------------------------ */
app.post("/api/service", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    mobile,
    gender,
    city,
    state,
    address,
    inquiry,
  } = req.body;

  try {
    const pool = await connectDB();
    await pool
      .request()
      .input("firstName", sql.NVarChar, firstName)
      .input("lastName", sql.NVarChar, lastName)
      .input("email", sql.NVarChar, email)
      .input("mobile", sql.NVarChar, mobile)
      .input("gender", sql.NVarChar, gender)
      .input("city", sql.NVarChar, city)
      .input("state", sql.NVarChar, state)
      .input("address", sql.NVarChar, address)
      .input("inquiry", sql.NVarChar, inquiry).query(`
        INSERT INTO service_inquiries 
        (first_name, last_name, email, mobile, gender, city, state, address, inquiry) 
        VALUES (@firstName, @lastName, @email, @mobile, @gender, @city, @state, @address, @inquiry)
      `);

    res.status(200).send("✅ Inquiry submitted successfully!");
  } catch (err) {
    console.error("❌ Error submitting inquiry:", err);
    res.status(500).send("❌ Failed to submit inquiry. Please try again.");
  }
});

/* ------------------------
✅ User Registration API
------------------------ */
app.post("/api/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // ✅ Input Validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "⚠️ All fields are required.",
    });
  }

  try {
    const pool = await connectDB();

    // ✅ Check if user already exists
    const checkUserQuery = "SELECT email FROM users WHERE email = @email";
    const existing = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(checkUserQuery);

    if (existing.recordset.length > 0) {
      return res.status(400).json({
        success: false,
        message: "⚠️ User already exists. Please login.",
      });
    }

    // ✅ Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate a username
    const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;

    // ✅ Insert new user
    await pool
      .request()
      .input("username", sql.NVarChar, username)
      .input("firstName", sql.NVarChar, firstName)
      .input("lastName", sql.NVarChar, lastName)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword).query(`
        INSERT INTO users 
        (username, first_name, last_name, email, password, created_at) 
        VALUES (@username, @firstName, @lastName, @email, @password, GETDATE())
      `);

    // ✅ Send welcome email
    const subject = "Welcome to Our Platform!";
    const text = `Hi ${firstName},\n\nThank you for registering! You can now log in to your account.\n\nBest Regards,\nYOGI ENGENEERING`;

    await sendEmail(email, subject, text);

    res.status(201).json({
      success: true,
      message: "✅ Registration successful. Please login.",
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({
      success: false,
      message: "❌ Internal server error.",
    });
  }
});

/* ------------------------
✅ User Login API
------------------------ */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const pool = await connectDB();

    // ✅ Check if user exists and is not a Google user
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM users WHERE email = @email AND google_id IS NULL");

    const user = result.recordset[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "⚠️ No Account Found. Please create an account to continue.",
      });
    }

    // ✅ Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "❌ Invalid password.",
      });
    }

    // ✅ Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
      },
      "your-secret-key", // ⚠️ Use process.env.JWT_SECRET
      { expiresIn: "1h" }
    );

    // ✅ Send login alert email
    const subject = "Successful Login Alert";
    const text = `Hi ${user.first_name},\n\nYou have successfully logged into your account. If this wasn't you, please change your password immediately.\n\nBest Regards,\nYOGI ENGENEERING`;

    await sendEmail(email, subject, text);

    // ✅ Respond with token and user info
    res.status(200).json({
      success: true,
      message: "✅ Login successful!",
      token,
      userId: user.id,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({
      success: false,
      message: "❌ Server error: " + err.message,
    });
  }
});

/* ------------------------
✅ Logout API (Blacklist JWT)
------------------------ */
app.post("/api/logout", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "❌ No token provided. Please log in.",
    });
  }

  try {
    const pool = await connectDB();

    // ✅ Verify and decode token
    let decoded;
    try {
      decoded = jwt.verify(token, "your-secret-key"); // 🔁 Use process.env.JWT_SECRET
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "❌ Invalid or expired token.",
      });
    }

    const { email, name } = decoded;

    // ✅ Blacklist the token
    await pool
      .request()
      .input("token", sql.NVarChar, token)
      .query(`INSERT INTO token_blacklist (token) VALUES (@token)`);

    // ✅ Send logout notification
    const subject = "Logout Alert!";
    const text = `Hi ${name},\n\nYou have successfully logged out. If this wasn't you, please change your password immediately.\n\nBest Regards,\nYOGI ENGENEERING`;
    await sendEmail(email, subject, text);

    res.status(200).json({
      success: true,
      message: "✅ Successfully logged out! An email has been sent.",
    });
  } catch (err) {
    console.error("❌ Logout error:", err.message);
    res.status(500).json({
      success: false,
      message: "❌ Server error: " + err.message,
    });
  }
});

/* ------------------------
✅ Forgot Password API
------------------------ */
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query("SELECT * FROM users WHERE email = @email");

    const user = result.recordset[0];
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "❌ User not found with this email.",
      });
    }

    // ✅ Generate reset token + expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = new Date(Date.now() + 3600000);

    await pool
      .request()
      .input("email", sql.NVarChar, email)
      .input("resetToken", sql.NVarChar, resetToken)
      .input("resetTokenExpire", sql.DateTime, resetTokenExpire).query(`
        UPDATE users 
        SET reset_token = @resetToken, reset_token_expire = @resetTokenExpire 
        WHERE email = @email
      `);

    // ✅ Send email with reset link
    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
    const mailOptions = {
      from: "Sender Gamil ID",
      to: email,
      subject: "🔐 Password Reset Request",
      html: `
        <p>Hello ${user.first_name},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link is valid for 1 hour.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "✅ Password reset link sent to your email!",
    });
  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({
      success: false,
      message: "❌ Error sending reset link. Please try again.",
    });
  }
});

/* ------------------------
✅ Reset Password API
------------------------ */
app.post("/api/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const pool = await connectDB();

    // ✅ Verify token and expiration
    const result = await pool.request().input("resetToken", sql.NVarChar, token)
      .query(`
        SELECT * FROM users 
        WHERE reset_token = @resetToken AND reset_token_expire > GETDATE()
      `);

    const user = result.recordset[0];
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "❌ Invalid or expired token.",
      });
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Update password and clear token
    await pool
      .request()
      .input("email", sql.NVarChar, user.email)
      .input("password", sql.NVarChar, hashedPassword).query(`
        UPDATE users 
        SET password = @password, reset_token = NULL, reset_token_expire = NULL 
        WHERE email = @email
      `);

    res.status(200).json({
      success: true,
      message: "✅ Password successfully reset. Please login.",
    });
  } catch (err) {
    console.error("❌ Reset Password Error:", err);
    res.status(500).json({
      success: false,
      message: "❌ Error resetting password. Please try again.",
    });
  }
});

// ✅ Verify password reset token (valid and not expired)
app.get("/api/verify-token/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const pool = await connectDB();

    // 🔍 Check if token exists and is not expired
    const result = await pool
      .request()
      .input("token", sql.NVarChar, token)
      .query(
        "SELECT * FROM users WHERE reset_token = @token AND reset_token_expire > GETDATE()"
      );

    if (result.recordset.length === 0) {
      // ❌ Token is invalid or expired
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token." });
    }

    // ✅ Token is valid
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ Google Login / Signup Handler
app.post("/api/google-login", async (req, res) => {
  const { name, email, googleId } = req.body;

  // 🚫 Validate input
  if (!name || !email || !googleId) {
    return res.status(400).json({
      success: false,
      message: "⚠️ All fields are required for Google login.",
    });
  }

  try {
    const pool = await connectDB();

    // 🔍 Check if user already exists with Google ID or Email
    const checkUserQuery = `
      SELECT user_id, first_name, last_name, email, google_id 
      FROM users 
      WHERE google_id = @googleId OR email = @email
    `;

    const checkResult = await pool
      .request()
      .input("googleId", sql.NVarChar, googleId)
      .input("email", sql.NVarChar, email)
      .query(checkUserQuery);

    let userId, firstName, lastName;
    let isNewUser = false;

    if (checkResult.recordset.length > 0) {
      // 👤 Existing user found
      const user = checkResult.recordset[0];
      userId = user.user_id;
      firstName = user.first_name;
      lastName = user.last_name;

      // 🛠️ Link Google ID if not already linked
      if (!user.google_id) {
        const updateGoogleIdQuery = `
          UPDATE users SET google_id = @googleId WHERE email = @email
        `;
        await pool
          .request()
          .input("googleId", sql.NVarChar, googleId)
          .input("email", sql.NVarChar, email)
          .query(updateGoogleIdQuery);
      }
    } else {
      // ➕ Register new user
      const nameParts = name.trim().split(" ");
      firstName = nameParts[0] || "";
      lastName = nameParts.slice(1).join(" ") || "";

      const insertGoogleUserQuery = `
        INSERT INTO users (first_name, last_name, email, google_id, password, created_at)
        OUTPUT INSERTED.user_id
        VALUES (@firstName, @lastName, @email, @googleId, @password, GETDATE())
      `;

      const userResult = await pool
        .request()
        .input("firstName", sql.NVarChar, firstName)
        .input("lastName", sql.NVarChar, lastName)
        .input("email", sql.NVarChar, email)
        .input("googleId", sql.NVarChar, googleId)
        .input("password", sql.NVarChar, "GOOGLE_USER") // default password for Google users
        .query(insertGoogleUserQuery);

      userId = userResult.recordset[0].user_id;
      isNewUser = true;
    }

    // 🔐 Generate JWT token
    const token = jwt.sign({ userId, name, email }, SECRET_KEY, {
      expiresIn: "7d",
    });

    // 📧 Send login notification email
    const loginType = isNewUser ? "registered and logged in" : "logged in";
    const emailSubject = `🔐 Login Alert: You've just ${loginType} on our website`;
    const emailText = `Hello ${firstName},\n\nYou have successfully ${loginType} using Google on our website.\n\nIf this wasn't you, please reset your password immediately.\n\nThank you,\nYOGI ENGINEERING`;

    await sendEmail(email, emailSubject, emailText);

    // ✅ Respond with token and user info
    res.status(200).json({
      success: true,
      token,
      userId,
      name,
      email,
      message: "✅ Google login successful!",
    });
  } catch (error) {
    console.error("❌ Error in Google login:", error);
    res.status(500).json({
      success: false,
      message: "❌ Internal server error during Google login.",
    });
  }
});

// ✅ Add Product to Cart
app.post("/api/add-to-cart", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  // 🧮 Parse and validate input
  const parsedUserId = parseInt(userId);
  const parsedProductId = parseInt(productId);
  const parsedQuantity = parseInt(quantity);

  if (
    isNaN(parsedUserId) ||
    isNaN(parsedProductId) ||
    isNaN(parsedQuantity) ||
    parsedQuantity <= 0
  ) {
    return res.status(400).json({
      success: false,
      message:
        "⚠️ Invalid input. userId, productId, and quantity must be positive integers.",
    });
  }

  try {
    const pool = await connectDB();

    // 🔍 Check product stock
    const stockResult = await pool
      .request()
      .input("productId", sql.Int, parsedProductId)
      .query(`SELECT stock FROM products WHERE product_id = @productId`);

    if (stockResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "❌ Product not found.",
      });
    }

    const availableStock = stockResult.recordset[0].stock;

    if (availableStock < parsedQuantity) {
      return res.status(400).json({
        success: false,
        message: "⚠️ Insufficient stock.",
      });
    }

    // 🔄 Check if product is already in cart
    const checkCartResult = await pool
      .request()
      .input("userId", sql.Int, parsedUserId)
      .input("productId", sql.Int, parsedProductId)
      .query(
        `SELECT * FROM cart WHERE user_id = @userId AND product_id = @productId`
      );

    if (checkCartResult.recordset.length > 0) {
      // 🔁 Update quantity in cart
      await pool
        .request()
        .input("userId", sql.Int, parsedUserId)
        .input("productId", sql.Int, parsedProductId)
        .input("quantity", sql.Int, parsedQuantity).query(`
          UPDATE cart
          SET cart_quantity = cart_quantity + @quantity
          WHERE user_id = @userId AND product_id = @productId
        `);
    } else {
      // ➕ Insert new cart item
      await pool
        .request()
        .input("userId", sql.Int, parsedUserId)
        .input("productId", sql.Int, parsedProductId)
        .input("quantity", sql.Int, parsedQuantity).query(`
          INSERT INTO cart (user_id, product_id, cart_quantity, added_at)
          VALUES (@userId, @productId, @quantity, GETDATE())
        `);
    }

    res.status(201).json({
      success: true,
      message: "✅ Product added to cart!",
    });
  } catch (error) {
    console.error("❌ Error adding to cart:", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Server error. Could not add to cart.",
    });
  }
});

// ✅ Fetch Cart Items by User ID
app.get("/api/cart/:userId", async (req, res) => {
  const parsedUserId = parseInt(req.params.userId);

  // 🚫 Validate user ID
  if (isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Invalid user ID format.",
    });
  }

  try {
    const pool = await connectDB();

    // 🔍 Fetch cart items and related product info
    const result = await pool.request().input("userId", sql.Int, parsedUserId)
      .query(`
        SELECT c.cart_id, c.cart_quantity, p.product_name, p.price, p.image
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = @userId
      `);

    res.status(200).json({
      success: true,
      cartItems: result.recordset,
      message: result.recordset.length === 0 ? "🛒 Cart is empty." : undefined,
    });
  } catch (error) {
    console.error("❌ Error fetching cart:", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Server error fetching cart.",
    });
  }
});

// ❌ Remove item from cart
app.delete("/api/remove-item", async (req, res) => {
  const { itemId, userId } = req.body;

  const parsedItemId = parseInt(itemId);
  const parsedUserId = parseInt(userId);

  // ✅ Validate input
  if (isNaN(parsedItemId) || isNaN(parsedUserId)) {
    return res.status(400).json({
      success: false,
      message: "⚠️ Invalid input. itemId and userId must be numbers.",
    });
  }

  try {
    const pool = await connectDB();

    // ✅ Check if item exists in the user's cart
    const itemExists = await pool
      .request()
      .input("itemId", sql.Int, parsedItemId)
      .input("userId", sql.Int, parsedUserId)
      .query(
        `SELECT * FROM cart WHERE cart_id = @itemId AND user_id = @userId`
      );

    if (itemExists.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        message: "⚠️ Item not found in the user's cart.",
      });
    }

    // ✅ Delete the item
    await pool
      .request()
      .input("itemId", sql.Int, parsedItemId)
      .input("userId", sql.Int, parsedUserId)
      .query(`DELETE FROM cart WHERE cart_id = @itemId AND user_id = @userId`);

    // ⚠️ These actions below are unusual. Ensure this logic is really needed.

    // 🔄 Reset cart quantity to 1 for all remaining items of the user
    await pool
      .request()
      .input("userId", sql.Int, parsedUserId)
      .query(`UPDATE cart SET cart_quantity = 1 WHERE user_id = @userId`);

    // 🔄 Change userId to 1 in cart (potentially dangerous unless required for business logic)
    await pool
      .request()
      .input("userId", sql.Int, 1)
      .query(`UPDATE cart SET user_id = 1 WHERE user_id = @userId`);

    res.status(200).json({
      success: true,
      message:
        "✅ Item removed from cart, quantity reset, and userId reset (if required).",
    });
  } catch (error) {
    console.error("❌ Error removing item:", error.message);
    res.status(500).json({
      success: false,
      message: "❌ Server error while removing item.",
    });
  }
});

// 🔄 Update cart item quantity
app.put("/api/update-cart-item", async (req, res) => {
  const { userId, cartId, newQuantity } = req.body;

  // ✅ Validate input
  if (!userId || !cartId || !newQuantity) {
    return res
      .status(400)
      .json({ success: false, message: "Missing parameters" });
  }

  if (newQuantity < 1 || newQuantity > 10) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be between 1 and 10.",
    });
  }

  try {
    const pool = await connectDB();

    // ✅ Update quantity of specific cart item
    const result = await pool
      .request()
      .input("userId", sql.Int, parseInt(userId))
      .input("cartId", sql.Int, parseInt(cartId))
      .input("newQuantity", sql.Int, parseInt(newQuantity)).query(`
        UPDATE cart
        SET cart_quantity = @newQuantity
        WHERE user_id = @userId AND cart_id = @cartId;
      `);

    if (result.rowsAffected[0] === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart." });
    }

    res
      .status(200)
      .json({ success: true, message: "✅ Cart item updated successfully." });
  } catch (error) {
    console.error("❌ Error updating cart item:", error.message);
    res
      .status(500)
      .json({ success: false, message: "❌ Error updating cart item." });
  }
});

// 🛒 Place an order
app.post("/api/place-order", async (req, res) => {
  const {
    user_id,
    customer_name,
    customer_mobile,
    customer_email,
    shipping_address,
  } = req.body;

  try {
    const pool = await connectDB(); // ✅ Connect to database

    // ✅ Retrieve user's cart items
    const cartItemsResult = await pool
      .request()
      .input("user_id", sql.Int, user_id).query(`
        SELECT c.cart_id, c.product_id, c.cart_quantity, p.price 
        FROM cart c
        JOIN products p ON c.product_id = p.product_id
        WHERE c.user_id = @user_id
      `);

    const cartItems = cartItemsResult.recordset;

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "⚠️ Cart is empty." });
    }

    // ✅ Calculate total order amount
    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.price * item.cart_quantity,
      0
    );

    // ✅ Insert new order
    const orderResult = await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .input("customer_name", sql.NVarChar, customer_name)
      .input("customer_mobile", sql.VarChar, customer_mobile)
      .input("customer_email", sql.VarChar, customer_email)
      .input("shipping_address", sql.NVarChar, shipping_address)
      .input("order_date", sql.DateTime, new Date())
      .input("total_amount", sql.Decimal(10, 2), totalAmount).query(`
        INSERT INTO orders (user_id, customer_name, customer_mobile, customer_email, shipping_address, order_date, total_amount)
        OUTPUT INSERTED.order_id
        VALUES (@user_id, @customer_name, @customer_mobile, @customer_email, @shipping_address, @order_date, @total_amount)
      `);

    const order_id = orderResult.recordset[0].order_id;

    // ✅ Insert order items
    const orderItemsPromises = cartItems.map((item) =>
      pool
        .request()
        .input("order_id", sql.Int, order_id)
        .input("product_id", sql.Int, item.product_id)
        .input("order_quantity", sql.Int, item.cart_quantity)
        .input("order_price", sql.Decimal(10, 2), item.price)
        .input("total", sql.Decimal(10, 2), item.price * item.cart_quantity)
        .query(`
          INSERT INTO order_items (order_id, product_id, order_quantity, order_price, total)
          VALUES (@order_id, @product_id, @order_quantity, @order_price, @total)
        `)
    );

    await Promise.all(orderItemsPromises); // ✅ Wait for all inserts to complete

    // ✅ Clear cart after successful order
    await pool
      .request()
      .input("user_id", sql.Int, user_id)
      .query("DELETE FROM cart WHERE user_id = @user_id");

    res.status(200).json({ message: "✅ Order placed successfully!" });
  } catch (err) {
    console.error("❌ Error placing order:", err.message);
    res.status(500).json({
      message: "❌ Something went wrong while placing the order.",
    });
  }
});


// -------------------------------
// ✅ Get User Orders
// -------------------------------
app.get("/api/orders/:userId", async (req, res) => {
  const userId = req.params.userId;

  // Validate if userId is provided
  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "⚠️ Invalid user ID" });
  }

  try {
    const pool = await connectDB();

    // Fetch orders for the given user
    const result = await pool.request().input("userId", sql.Int, userId).query(`
        SELECT 
          o.order_id, o.customer_name, o.customer_email, o.shipping_address, 
          o.order_date, o.order_status,
          oi.product_id, oi.order_quantity, oi.order_price, 
          p.product_name, p.image
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.product_id
        WHERE o.user_id = @userId
        ORDER BY o.order_date DESC
      `);

    // If no orders found, return an empty array
    if (result.recordset.length === 0) {
      return res
        .status(200)
        .json({ success: true, orders: [], message: "📜 No orders found." });
    }

    // Group orders by order_id for better structure
    const groupedOrders = result.recordset.reduce((acc, item) => {
      const orderId = item.order_id;
      if (!acc[orderId]) {
        acc[orderId] = {
          order_id: orderId,
          order_date: item.order_date,
          customer_name: item.customer_name,
          customer_email: item.customer_email,
          shipping_address: item.shipping_address,
          order_status: item.order_status,
          items: [],
        };
      }
      acc[orderId].items.push({
        product_id: item.product_id,
        order_quantity: item.order_quantity,
        order_price: item.order_price,
        product_name: item.product_name,
        image: item.image,
      });
      return acc;
    }, {});

    // Send back the grouped orders
    res.status(200).json({
      success: true,
      orders: Object.values(groupedOrders),
    });
  } catch (error) {
    console.error("❌ Error fetching orders:", error);
    res
      .status(500)
      .json({ success: false, message: "❌ Error fetching orders." });
  }
});

// -------------------------------
// ✅ Cancel Order
// -------------------------------
app.patch("/api/orders/cancel/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { userId } = req.body;

  // Validate orderId and userId
  if (!orderId || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "⚠️ Missing order ID or user ID" });
  }

  try {
    const pool = await connectDB();

    // Update the order status to 'Cancelled'
    const result = await pool
      .request()
      .input("orderId", sql.Int, orderId)
      .input("userId", sql.Int, userId).query(`
        UPDATE orders 
        SET order_status = 'Cancelled'
        WHERE order_id = @orderId AND user_id = @userId
      `);

    if (result.rowsAffected[0] > 0) {
      res
        .status(200)
        .json({ success: true, message: "✅ Order cancelled successfully." });
    } else {
      res
        .status(404)
        .json({
          success: false,
          message: "⚠️ Order not found or already cancelled.",
        });
    }
  } catch (error) {
    console.error("❌ Error cancelling order:", error);
    res
      .status(500)
      .json({ success: false, message: "❌ Error cancelling order." });
  }
});

// -------------------------------
// ✅ Get Product Stock
// -------------------------------
app.get("/api/product-stock/:productId", async (req, res) => {
  const { productId } = req.params;

  // Validate productId
  if (!productId || isNaN(parseInt(productId))) {
    return res
      .status(400)
      .json({ success: false, message: "⚠️ Invalid product ID." });
  }

  try {
    const pool = await connectDB();

    // Fetch product stock for the given product ID
    const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .query("SELECT stock FROM products WHERE product_id = @productId");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "⚠️ Product not found." });
    }

    res.status(200).json({ success: true, stock: result.recordset[0].stock });
  } catch (error) {
    console.error("❌ Error fetching stock:", error.message);
    res
      .status(500)
      .json({ success: false, message: "❌ Error fetching product stock." });
  }
});

// -------------------------------
// ✅ Update Cart Item Quantity
// -------------------------------
app.put("/update-quantity", async (req, res) => {
  const { itemId, type } = req.body;

  try {
    // Query to get current cart item quantity
    const item = await db.query(
      "SELECT cart_quantity FROM cart WHERE cart_id = @itemId",
      { replacements: { itemId }, type: db.QueryTypes.SELECT }
    );

    // If item not found, return error
    if (!item.length) {
      return res.json({ success: false, message: "⚠️ Item not found" });
    }

    // Adjust the quantity based on type (increment/decrement)
    let newQty = item[0].cart_quantity;
    if (type === "increment") newQty += 1;
    else if (type === "decrement" && newQty > 1) newQty -= 1;

    // Update the cart item with the new quantity
    await db.query(
      "UPDATE cart SET cart_quantity = @newQty WHERE cart_id = @itemId",
      { replacements: { newQty, itemId }, type: db.QueryTypes.UPDATE }
    );

    res.json({ success: true, updatedItem: { cart_quantity: newQty } });
  } catch (err) {
    console.error("❌ Error updating quantity:", err);
    res.status(500).json({ success: false, message: "❌ Server error" });
  }
});

// -------------------------------
// ✅ Serve Static Images
// -------------------------------
app.use("/images", express.static(path.join(__dirname, "public/images")));

// -------------------------------
// ✅ Get All Products
// -------------------------------
app.get("/api/products", async (req, res) => {
  try {
    const pool = await connectDB();
    const result = await pool.request().query("SELECT * FROM products");

    res.json({ success: true, products: result.recordset });
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res
      .status(500)
      .json({ success: false, message: "❌ Error fetching products" });
  }
});

// -------------------------------
// ✅ Get Product by ID
// -------------------------------
app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  const productId = parseInt(id, 10); // Ensure ID is an integer

  if (isNaN(productId)) {
    return res
      .status(400)
      .json({ success: false, message: "⚠️ Invalid product ID" });
  }

  try {
    const pool = await connectDB();
    const result = await pool
      .request()
      .input("productId", sql.Int, productId)
      .query("SELECT * FROM products WHERE product_id = @productId");

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "⚠️ Product not found" });
    }

    res.json({ success: true, product: result.recordset[0] });
  } catch (err) {
    console.error("❌ Error fetching product:", err.message);
    res
      .status(500)
      .json({ success: false, message: "❌ Error fetching product" });
  }
});

// -------------------------------
// ✅ Start Server
// -------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Optional if using as router module
module.exports = router;
