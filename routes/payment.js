// import express from "express";
// import Razorpay from "razorpay";
// import crypto from "crypto";
// import nodemailer from "nodemailer";
// import Book from "../models/Book.js";

// const router = express.Router();

// // // Razorpay instance
// // const razorpay = new Razorpay({
// //   key_id: process.env.RAZORPAY_KEY_ID,
// //   key_secret: process.env.RAZORPAY_KEY_SECRET,
// // });

// // Create order
// router.post("/create-order", async (req, res) => {
//   try {
//     const { amount } = req.body;

//     const options = {
//       amount: amount * 100, // ₹ to paise
//       currency: "INR",
//       receipt: "receipt_order_" + Date.now(),
//     };

//     const order = await razorpay.orders.create(options);

//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Verify payment + send email
// router.post("/verify", async (req, res) => {
//   try {
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       email,
//       bookId,
//     } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return res.status(400).json({ message: "Invalid signature" });
//     }

//     // Fetch book details (contains download file links)
//     const book = await Book.findById(bookId);

//     // Send Email with download link
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: "Book Store <no-reply@bookstore.com>",
//       to: email,
//       subject: "Thanks for purchasing your book!",
//       html: `
//         <h2>Payment Successful 🎉</h2>
//         <p>Thank you for buying <b>${book.title}</b></p>
//         <p>You can download your book below:</p>
//         ${book.files
//           .map((f) => `<a href="${f.url}" target="_blank">📕 ${f.name}</a><br>`)
//           .join("")}
//       `,
//     });

//     res.json({ message: "Payment verified & email sent" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;



import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import nodemailer from "nodemailer";
import Book from "../models/Book.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create order
router.post("/create-order", async (req, res) => {
  try {
    console.log("req rec");
    
    const { amount } = req.body;

    const options = {
      amount: parseInt(amount * 100), // convert to paise
      currency: "INR",
      receipt: "receipt_order_" + Date.now(),
      payment_capture: 1, // automatic capture
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// Verify payment + send email
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      email,
      bookId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // Fetch book details
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Send Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Book Store" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Thanks for purchasing your book!",
      html: `
        <h2>Payment Successful 🎉</h2>
        <p>Thank you for buying <b>${book.title}</b></p>
        <p>You can download your book below:</p>
        ${book.files
          .map((f) => `<a href="${f.url}" target="_blank">📕 ${f.name}</a><br>`)
          .join("")}
      `,
    });

    res.json({ message: "Payment verified & email sent" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
