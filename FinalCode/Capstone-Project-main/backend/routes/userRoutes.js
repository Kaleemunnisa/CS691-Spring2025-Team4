const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/register', async (req, res) => {
  const {name, email, password } = req.body;

  try{
    
    let user = await User.findOne({ email });

    if (user) return res.status(400).json({message: "User already Exists"});

    user = new User ({name, email, password});
    await user.save();

    // JWT Token
    const payload = {user: {id: user._id, role: user.role }};

    // Sigin and return token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
      if(err) throw err;

      // Send the user token and response
      res.status(201).json({
        user:{
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
} catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
});

 // route POST /api/users/login
    // Authenticate user
    // access public

    router.post("/login", async (req, res) => {
      const { email, password } = req.body;

      try {
        // Find user by email
        let user = await User.findOne({ email });

        if(!user) return res.status(400).json({message: "Invalid credentials"});
        const isMatch = await user.matchPassword(password);

        if(!isMatch) return res.status(400).json({message: "Invalid Credentials"});

         // JWT Token
    const payload = {user: {id: user._id, role: user.role }};

    // Sigin and return token along with user data
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "40h" }, (err, token) => {
      if(err) throw err;

      // Send the user token and response
      res.json({
        user:{
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      });
    });
      } catch(error) {
        console.log(error);
        res.status(500).send("Server Error")
      }
    });

    // route Get /api/users/profile
    // description Get logged-in user profile (Protected Route)
    // access private

    router.get("/profile", protect, async (req, res) => {
      res.json(req.user);

    })

module.exports = router;