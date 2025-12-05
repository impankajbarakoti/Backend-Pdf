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


// import express from "express";
// import cors from "cors";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import bookRoutes from "./routes/books.js";
// import paymentRoutes from "./routes/payment.js";
// dotenv.config();
// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // ROUTES
// app.use("/api/books", bookRoutes);
// app.use("/api/payments", paymentRoutes);
// // MONGO CONNECT
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log("DB Error:", err));

// // SERVER
// app.listen(process.env.PORT || 5000, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );




import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

import bookRoutes from "./routes/books.js";
import paymentRoutes from "./routes/payment.js";

dotenv.config();

const app = express();

// 🔥 GLOBAL CORS FIX — ALLOW EVERYTHING (BEST FOR API BACKENDS)
app.use(
  cors({
    origin: "*", // allows all frontend domains
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/payments", paymentRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB Error:", err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
