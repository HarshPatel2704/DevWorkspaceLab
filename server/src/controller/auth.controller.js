import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

export const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required.",
      });
    }

    // Get user with password
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Compare Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Generate Token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// =============================
// Get Profile
// =============================
export const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Profile Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
