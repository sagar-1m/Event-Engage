import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import mongoose from "mongoose";

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // // Set token in cookies
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development",
    //   maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
    //   sameSite: "strict",
    //   path: "/",
    // });

    res.json({
      success: true,

      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isGuest: user.isGuest,
        token: token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Guest login
// @route   POST /api/auth/guest
// @access  Public
export const guestLogin = async (req, res) => {
  try {
    // Generate random guest credentials
    const guestEmail = `guest_${Date.now()}@temp.com`;
    const guestPassword = Math.random().toString(36).slice(-8);
    const guestName = `Guest_${Math.random().toString(36).slice(2, 7)}`;

    // Create guest user
    const user = await User.create({
      name: guestName,
      email: guestEmail,
      password: guestPassword,
      isGuest: true,
      guestExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    });

    // Generate token
    const token = generateToken(user._id);

    // // Set token in cookies
    // const cookie = cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV !== "development",
    // });

    res.status(201).json({
      success: true,

      message: "Guest login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isGuest: user.isGuest,
        guestExpiresAt: user.guestExpiresAt,
        token: token,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Check guest session
// @route   GET /api/auth/guest/check
// @access  Private
export const checkGuestSession = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.isGuest && user.guestExpiresAt < new Date()) {
      // Guest session expired
      await User.findByIdAndDelete(user._id);
      return res.status(401).json({
        success: false,
        message: "Guest session expired",
      });
    }

    res.json({
      success: true,
      data: {
        isValid: true,
        expiresAt: user.guestExpiresAt,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

// @desc    Logout guest
// @route   POST /api/auth/logout/guest
// @access  Private
export const logoutGuest = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

// @desc    Logout all sessions
// @route   POST /api/auth/logout/all
// @access  Private
export const logoutAllSessions = async (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};
