// import express, { Router } from "express";
// import Book from "../models/Book.js";

// const router = express.Router();

// // CREATE BOOK
// router.post("/", async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       coverUrl,
//       files,
//       buttonText,
//       pricing,
//       published,
//     } = req.body;

//     const newBook = await Book.create({
//       title,
//       description,
//       coverUrl, // CLOUDINARY URL
//       files, // [{ name, url }]
//       buttonText,
//       pricingType: pricing.type,
//       price: pricing.price,
//       discountedPrice: pricing.discountedPrice,
//       published,
//     });

//     res.status(201).json(newBook);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET published books
// router.get("/published", async (req, res) => {
//   try {
//     const books = await Book.find({ published: true }).sort({ createdAt: -1 });
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE BOOK
// router.delete("/:id", async (req, res) => {
//   try {
//     await Book.findByIdAndDelete(req.params.id);
//     res.json({ message: "Book deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// //fetch

// router.get("/fetch", async (req, res) => {
//   try {
//     const result =await Book.find({});
//     res.json({ message: "Fetch Book Sucessfully " ,result });
    
//   }
//   catch (err) {
//     res.status(500).json({ error: err.messsage });
//   }
// })

// router.get("/api/books/:id", (req, res) => {
//   const bookId = req.params.id;
//   // Fetch the book by its ID from the database (assuming MongoDB here)
//   Book.findById(bookId)
//     .then((book) => {
//       if (!book) {
//         return res.status(404).send({ message: "Book not found" });
//       }
//       res.json(book); // Send back the book details
//     })
//     .catch((err) => res.status(500).send({ message: "Server error" }));
// });


// export default router;



// import express from "express";
// import Book from "../models/Book.js";

// const router = express.Router();

// /* ---------------------- CREATE BOOK ---------------------- */
// router.post("/", async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       coverUrl,
//       files,
//       buttonText,
//       pricing,
//       published,
//     } = req.body;

//     console.log("file",files)

//     const newBook = await Book.create({
//        title,
//        description,
//        coverUrl, // CLOUDINARY URL
//        files, // [{ name, url }]
//       buttonText,
//        pricingType: pricing.type,
//        price: pricing.price,
//        discountedPrice: pricing.discountedPrice,
//        published,
//     });

//     res.status(201).json(newBook);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ---------------------- GET Published Books ---------------------- */
// router.get("/published", async (req, res) => {
//   try {
//     const books = await Book.find({ published: true }).sort({ createdAt: -1 });
//     res.json(books);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ---------------------- DELETE Book ---------------------- */
// router.delete("/:id", async (req, res) => {
//   try {
//     await Book.findByIdAndDelete(req.params.id);
//     res.json({ message: "Book deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ---------------------- FETCH ALL Books ---------------------- */
// router.get("/fetch", async (req, res) => {
//   try {
//     const result = await Book.find({});
//     res.json({ message: "Fetched Successfully", result });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// /* ---------------------- GET SINGLE BOOK by ID ---------------------- */
// // IMPORTANT: DO NOT add /api/books here!!!
// router.get("/:id", async (req, res) => {
//   try {
//     const book = await Book.findById(req.params.id);

//     if (!book) {
//       return res.status(404).json({ message: "Book not found" });
//     }

//     res.json(book);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;



import express from "express";
import Book from "../models/Book.js";

const router = express.Router();

/* ---------------------------------------------------------
   CREATE BOOK
--------------------------------------------------------- */
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

    // VALIDATION
    if (!title || !description) {
      return res.status(400).json({ error: "Title and Description required" });
    }

    // Ensure files is an array
    const normalizedFiles = Array.isArray(files) ? files : [];

    const newBook = await Book.create({
      title,
      description,
      coverUrl: coverUrl || "", // Cloudinary Image URL
      files: normalizedFiles, // [{ name, url }]
      buttonText: buttonText || "Buy Now",
      pricingType: pricing?.type || "fixed",
      price: pricing?.price || 0,
      discountedPrice: pricing?.discountedPrice || null,
      published: published === true,
    });

    res.status(201).json(newBook);
  } catch (err) {
    console.log("CREATE BOOK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   GET Published Books
--------------------------------------------------------- */
router.get("/published", async (req, res) => {
  try {
    const books = await Book.find({ published: true }).sort({
      createdAt: -1,
    });

    res.json(books);
  } catch (err) {
    console.log("FETCH PUBLISHED ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   DELETE Book
--------------------------------------------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.log("DELETE BOOK ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   FETCH ALL Books
--------------------------------------------------------- */
router.get("/fetch", async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });

    res.json({
      message: "Fetched Successfully",
      result: books,
    });
  } catch (err) {
    console.log("FETCH ALL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------------------------------------------------------
   GET Single Book by ID
--------------------------------------------------------- */
// ⚠ MUST ALWAYS BE LAST ROUTE (to prevent conflict)
router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    console.log("GET BY ID ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
