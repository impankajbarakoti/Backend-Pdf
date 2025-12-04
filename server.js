// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import bookRoutes from "./routes/books.js";

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // ROUTE
// app.use("/api/books", bookRoutes);



// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// app.listen(process.env.PORT, () =>
//   console.log(`Server running on ${process.env.PORT}`)
// );


//

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bookRoutes from "./routes/books.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();
const app = express();

// Fetch frontend URLs from .env
const allowedOrigins = [
  process.env.FRONTEND_URL_ADMIN, // Admin frontend URL
  process.env.FRONTEND_URL_BOOKS, // Books frontend URL
];

// Enable CORS dynamically based on the environment
app.use(
  cors({
    origin: (origin, callback) => {
      // Check if the origin is in the allowedOrigins list
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true); // Allow the origin
      } else {
        callback(new Error("CORS not allowed"), false); // Reject the origin
      }
    },
    methods: "GET,POST",
    allowedHeaders: "Content-Type",
  })
);

app.use(express.json());
app.timeout = 120000;

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/payments", paymentRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));

// Start server
app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
