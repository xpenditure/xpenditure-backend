const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { ioMessage } = require('../utils/ioMessage');

// User register
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  // check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({
      status: 'failed',
      message: 'Email already registered',
    });
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  if (user) {
    res.status(201).json({
      status: 'successful',
      token: generateToken(user._id),
      message: 'user registered successfully',
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// User login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(200).json({
      status: 'successful',
      token: generateToken(user._id),
      message: 'user registered successfully',
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  User.findById(req.user._id)
    .select('-password')
    .exec((err, user) => {
      if (err) {
        res.status(400);
        throw new Error('User not found');
      }

      res.status(200).json({
        status: 'successful',
        payload: user,
        message: 'retrieved user data successfully',
      });
    });
});

// Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  const user = await User.findById(req.user._id);

  if (user) {
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;

    const updatedUser = await user.save();
    res.status(200).json({
      status: 'successful',
      payload: updatedUser,
      message: 'Profile updated successfully',
    });
  } else {
    res.json(400);
    throw new Error('User not found');
  }
});

// We check user profile with socket after
// theme switch. We use the (_) to different
// from the regular ajax request
const _fetchUserProfile = (io, socket) => {
  const userId = socket.decoded_token.id;
  User.findById(userId)
    .select('-password')
    .exec((err, user) => {
      if (err) {
        res.status(400);
        throw new Error('User not found');
      }

      io.sockets.emit('fetchUserProfile', user);
    });
};

const setUserColor = async (io, socket, color) => {
  const userId = socket.decoded_token.id;
  const user = await User.findById(userId);

  const newColor = {
    color: color || user.color,
  };

  User.findByIdAndUpdate(userId, newColor, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    _fetchUserProfile(io, socket);
  });
};

const setUserBackground = async (io, socket, color) => {
  const userId = socket.decoded_token.id;
  const user = await User.findById(userId);

  const newColor = {
    background: color || user.background,
  };

  User.findByIdAndUpdate(userId, newColor, (err, _) => {
    if (err) {
      console.log(err);
      return;
    }

    _fetchUserProfile(io, socket);
  });
};

const uploadAvatar = async (io, socket, url) => {
  const userId = socket.decoded_token.id;
  const user = await User.findById(userId);

  const newAvatar = {
    avatar: url || user.avatar,
  };

  User.findByIdAndUpdate(user, newAvatar, (err, _) => {
    if (err) {
      consoe.log(err);
      ioMessage(socket, 'Error occured', 'failed');

      return;
    }

    ioMessage(socket, 'Profile image uploaded', 'ok');

    _fetchUserProfile(io, socket);
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  setUserColor,
  setUserBackground,
  uploadAvatar,
  _fetchUserProfile,
};
