const express = require('express');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new product
router.post('/', protect, admin, async (req, res) => {
  try {
    const {
      name, description, price, discountPrice, countInStock, category, brand, sizes,
      colors, collections, material, gender, images, isFeatured, isPublished,
      tags, dimensions, weight, sku,
    } = req.body;

    const product = new Product({
      name, description, price, discountPrice, countInStock, category, brand, sizes,
      colors, collections, material, gender, images, isFeatured, isPublished,
      tags, dimensions, weight, sku, user: req.user._id
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json("Server Error");
  }
});

// Update a product
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const {
      name, description, price, discountPrice, countInStock, category, brand, sizes,
      colors, collections, material, gender, images, isFeatured, isPublished,
      tags, dimensions, weight, sku,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
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

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// Delete a product
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Removed Product" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// GET all products with filters
router.get('/', async (req, res) => {
  try {
    const {
      collection, size, color, gender, minPrice, maxPrice,
      sortBy, search, category, material, brand, limit
    } = req.query;

    const query = {};

    if (collection && collection.toLowerCase() !== 'all') {
      query.collections = collection;
    }

    if (category) query.category = category;
    if (size) query.sizes = size;
    if (color) query.colors = color;
    if (gender) query.gender = gender;
    if (brand) query.brand = brand;
    if (material) query.material = material;

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let productsQuery = Product.find(query);

    if (sortBy) {
      const sortOption = {};
      if (sortBy === 'priceLowToHigh') sortOption.price = 1;
      if (sortBy === 'priceHighToLow') sortOption.price = -1;
      if (sortBy === 'newest') sortOption.createdAt = -1;
      productsQuery = productsQuery.sort(sortOption);
    }

    if (limit) {
      productsQuery = productsQuery.limit(Number(limit));
    }

    const products = await productsQuery;
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// New Arrivals
router.get('/new-arrivals', async (req, res) => {
  try {
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Best Sellers
router.get('/best-seller', async (req, res) => {
  try {
    const bestSellers = await Product.find({ isFeatured: true }).limit(8);
    res.json(bestSellers);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product Not Found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
