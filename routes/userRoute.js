const express = require('express');
const router = express.Router();

const {
  registerUserValidationRules,
  validate,
  updateUserValidationRules,
} = require('../validations/userValidation');

const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/login').post(loginUser);
router
  .route('/register')
  .post(registerUserValidationRules(), validate, registerUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(updateUserValidationRules(), validate, protect, updateUserProfile);

module.exports = router;
