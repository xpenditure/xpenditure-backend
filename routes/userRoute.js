const express = require('express');
const router = express.Router();

const {
  registerValidationRules,
  validate,
} = require('../validations/userValidation');

const {
  registerUser,
  loginUser,
  getUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/login').post(loginUser);
router
  .route('/register')
  .post(registerValidationRules(), validate, registerUser);

router.route('/profile').get(protect, getUserProfile);

module.exports = router;
