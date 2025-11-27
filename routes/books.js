import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

// CREATE BOOK
router.post("/", async (req, res) => {
  try {
    const {
      title,
      description,
      coverUrl,
      files,
      buttonText,
      pricing,
      published,
    } = req.body;

    const newBook = await Book.create({
      title,
      description,
      coverUrl, // CLOUDINARY URL
      files, // [{ name, url }]
      buttonText,
      pricingType: pricing.type,
      price: pricing.price,
      discountedPrice: pricing.discountedPrice,
      published,
    });

    res.status(201).json(newBook);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

// GET published books
router.get("/published", async (req, res) => {
  try {
    const books = await Book.find({ published: true }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE BOOK
router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
