import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  coverUrl: String,

  files: [
    {
      url: String,
      name: String,
      isLink: Boolean,
    },
  ],

  buttonText: { type: String, default: "Buy Now" },

  pricingType: { type: String, default: "fixed" },
  price: Number,
  discountedPrice: Number,

  published: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Book", bookSchema);
