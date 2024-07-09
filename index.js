const express = require("express");
const app = express();
const mongoose = require("mongoose");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

mongoose
  .connect("mongodb://127.0.0.1:27017/RESTFUL-API")
  .then(() => {
    console.log("connection established");
  })
  .catch((err) => {
    console.log(err);
  });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
});

const Product = new mongoose.model("product", productSchema);

// //Read
app.get("/api/v1/products", async (req, res) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// insert
app.post("/api/v1/product/new", async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

// // update
app.put("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400).json({
      success: false,
      message: "No such Product ",
    });
  } else {
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  }
});

// delete
app.delete("/api/v1/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);
  if (!product) {
    res.status(400).json({
      success: false,
      message: "No such Product ",
    });
  } else {
    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: "Product is deleted",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is working");
});
