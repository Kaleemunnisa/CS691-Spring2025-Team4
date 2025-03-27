const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Helper function to get a cart by user Id or guest Id
const getCart = async (userId, guestId) => {
  if (userId) {
    return await Cart.findOne({ user: userId});
  } else if (guestId) {
    return await Cart.findOne({ guestId });
  }
  return null;
}

// route POST/api/cart
// Add a product to the cart for guest or logged user
// access public

router.post('/', async (req, res) => {
    const {productId, quantity, size, color, guestId, userId} = req.body;
    try {
      const product = await Product.findById(productId);
      if(!product) return res.status(404).json({ message: 'Product Not Found'});

      // Determine wheter user is logged in or guest
      const cart = await getCart(userId, guestId);
      
      // If cart exits
      if (cart) {
        const productIndex = cart.products.findIndex(
          (p) => 
            p.productId.toString() === productId && 
            p.size === size && 
            p.color === color
          );

          if (productIndex > -1) {
            //If product already exists, update the quantity
            cart.products[productIndex].quantity += Number(quantity);
          } else {
            // add new product
            cart.products.push({
              productId,
              name: product.name,
              image: product.images[0].url,
              price: product.price,
              size,
              color,
              quantity,
            });
          }

          // Recalculate the total Price
          cart.totalPrice = cart.products.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
          );
          await cart.save();
          return res.status(200).json(cart);
      } else {
        // Create a new cart for the guest or user
        const newCart = await Cart.create({
          user: userId ? userId : undefined,
          guestId: guestId ? guestId : "guest_" + new Date().getTime(),
          products: [
            {
              productId,
              name: product.name,
              image: product.images[0].url,
              price: product.price,
              size,
              color,
              quantity,
            },
          ],
          totalPrice: product.price * quantity,
        });
        return res.status(201).json(newCart);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({message: "Server Error"});
    }
});

// route PUT/api/cart
// Update product quantity in the cart for a guest or logged-in user
// access Public
router.put('/', async (req, res) => {
  const {productId, quantity, size, color, guestId, userId} = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if(!cart) return res.status(404).json({ message: "Cart not found"});

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId &&
      p.size === size &&
      p.color === color
    );

    if(productIndex > -1) {
      // update quantity
      if (quantity > 0) {
        cart.products[productIndex].quantity = quantity;
      } else {
        cart.products.splice(productIndex, 1); //Remove product if quantity is 0
      }

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
        return res.status(404).json({ message: "Product not found in cart"});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
});

// route DELETE /api/cart
// Remove a product from the cart
// access Public
router.delete('/', async (req, res) => {
  const {productId, size, color, guestId, userId} = req.body;
  try {
    let cart = await getCart(userId, guestId);

    if(!cart) return res.status(404).json({ message: 'Cart Not found'});

    const productIndex = cart.products.findIndex(
      (p) => 
        p.productId.toString() === productId &&
        p.size === size && 
        p.color === color
    );

    if(productIndex > -1) {
      cart.products.splice(productIndex, 1);

      cart.totalPrice = cart.products.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      await cart.save();
      return res.status(200).json(cart);
    } else {
      return res.status(404).json({ message: 'Product not found in cart'});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error"});
  }
});

// route GET /api/cart
// Get logged-in user's or guest user's cart
// access Public

router.get('/', async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);
    if(cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error"});
  }
});

// route /api/cart/merge       
// Merge guest cart into user cart on login
// access Private
router.post('/merge', protect, async (req, res) => {
      const { guestId } = req.body;

      try {
        // Find the guest cart and user cart
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: req.user._id });

        if (guestCart) {
          if (guestCart.products.length === 0) {
            return res.status(400).json({ message: "Guest cart is empty" });
          }

          if (userCart) {
            // Merge guest cart into user cart
            guestCart.products.forEach((guestItem) => {
                const productIndex = userCart.products.findIndex(
                  (item) => 
                    item.productId.toString() === guestItem.productId.toString() && 
                    item.size === guestItem.size && 
                    item.color === guestItem.color  
                  );
                  
                  if (productIndex > -1) {
                    // If the item exists in the user cart, update the quantity
                    userCart.products[productIndex].quantity += guestItem.quantity;
                  } else {
                    // Otherwise, add the guest item to the cart
                    userCart.products.push(guestItem);
                  }
            });
            
            userCart.totalPrice = userCart.products.reduce((acc, item) => acc + item.price * item.quantity,0
          );
          await userCart.save();

          // Remove the guest cart after merging
          try {
            await Cart.findOneAndDelete({ guestId });
          } catch (error) {
            console.error("Error deleting guest cart:", error);
          }
          res.status(200).json(userCart);
          } else {
            // If the user has no existing cart, assign the guest cart to the user
            guestCart.user = req.user._id;
            guestCart.guestId = undefined;
            await guestCart.save();
          }
        } else {
          if (userCart) {
            // Guest cart has already been merged, return user cart
            return res.status(200).json(userCart);
          }
          res.status(404).json({ message: "Guest Cart not Found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
      }
});
module.exports = router;
