const Book = require("../models/Book");
const multer = require("multer");
const path = require("path");

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Create book
const addBook = async (req, res) => {
  try {
    const { title, description, buttonText, pricing, files } = req.body;
    const coverUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newBook = new Book({
      title,
      description,
      buttonText,
      coverUrl,
      files: files ? JSON.parse(files) : [],
      pricing: pricing ? JSON.parse(pricing) : {},
    });

    await newBook.save();
    res.status(201).json({ success: true, book: newBook });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all books with pagination
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const total = await Book.countDocuments();
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      success: true,
      books,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Delete a book
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.json({ success: true, message: "Book deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { upload, addBook, getBooks, deleteBook };
