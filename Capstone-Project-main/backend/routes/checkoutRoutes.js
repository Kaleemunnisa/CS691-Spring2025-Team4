const express = require('express');
const Checkout = require('../models/Checkout');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { product } = require('../middleware/authMiddleware');

const router = express.Router();

// route POST /api/checkout
// Create a new checkout session
// access Private
router.post("/", protect, async (req, res) => {
  const {checkoutItems, shippingAddress, paymentMethod, totalPrice} = req.body;

  if(!checkoutItems || checkoutItems.length === 0 ) {
    return res.status(400).json({ messgae: 'no items in checkout' });
  }

  try {
    // Create a new checkout session
    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems: checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: 'Pending',
      isPaid: false,
    });

    console.log(`Checkout created for user: ${req.user._id}`);
    res.status(201).json(newCheckout);
  } catch (error) {
    console.error('Error Creating checkout session', error);
    res.status(500).json({ message: 'Server Error'});
  }
});

// route PUT /api/checkout/:id/pay
// Update checkout to mark as paid after successful payment
// access Private
router.put('/:id/pay', protect, async (req, res) => {
  const {} = req.body;
})