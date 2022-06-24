const express = require('express');
const router = express.Router();

const {
  registerValidationRules,
  validate,
} = require('../validations/userValidation');

const { registerUser, loginUser } = require('../controllers/userController');

router.route('/login').post(loginUser);
router
  .route('/register')
  .post(registerValidationRules(), validate, registerUser);

module.exports = router;
