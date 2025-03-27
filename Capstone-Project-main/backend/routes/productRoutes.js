const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// route POST /api/products
// Create a new product
// access Private/Admin
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// route PUT/api/products/:id
// update an existing product
// access private/admin
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    // Find product by ID
    const product = await Product.findById(req.params.id);

    if(product) {
      // update the product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;
    console.log("error here")
    // Save the update to database

    const updatedProduct = await product.save();
    res.json(updatedProduct);
    } else {
      res.status(404).json({message: "Product not found"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})

// Route DELETE/api/products/:id
// Delete a product by ID
// access Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    // Find product by ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove product from DB
      await product.deleteOne();
      res.json({ message: "Removed Product"});
    } else {
      res.status(404).json({ message: "Product not found"});
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
})
// GET/api/products
// Get all products
// access Public

router.get('/', async (req, res) => {
  try {
    const { collection } = req.query;

    let query = {};

    if (collection && collection.toLowerCase() !== 'all') {
      query.collections = collection;
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// route GET/api/products/new-arrivals
// Retrieve latest 8 products - Creation Date
// access Public
router.get('/new-arrivals', async (req, res) => {
  try {
    // Fetch 8 latest products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// route GET/api/products/:id
// Get a single product by ID
// access Public 

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product Not Found'})
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});



module.exports = router;