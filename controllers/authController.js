
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { findUserByEmail, addUser, findUserById } = require("../models/userModel");


const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};


exports.registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

 
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }


    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const user = addUser(email, hashedPassword);

  
    const token = generateToken(user.id);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while registering",
      error: error.message,
    });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }


    const user = findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }


    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      expiresIn: process.env.JWT_EXPIRE,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while logging in",
      error: error.message,
    });
  }
};


exports.getProfile = (req, res) => {
  const user = findUserById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found (maybe server restarted and memory was cleared)",
    });
  }

  res.status(200).json({
    success: true,
    message: "Token is valid, here is your profile",
    user: {
      id: user.id,
      email: user.email,
    },
  });
};
