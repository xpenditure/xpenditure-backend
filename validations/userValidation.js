const { check, validationResult } = require('express-validator');

const registerUserValidationRules = () => {
  return [
    check('firstName')
      .trim()
      .toLowerCase()
      .escape()
      .not()
      .isEmpty()
      .withMessage('first name field is required')
      .isLength({ min: 2 })
      .withMessage('first name minimum of 2 chars')
      .bail(),
    check('lastName')
      .trim()
      .toLowerCase()
      .escape()
      .not()
      .isEmpty()
      .withMessage('last name field is required')
      .isLength({ min: 2 })
      .withMessage('last name minimum of 2 chars')
      .bail(),
    check('email')
      .trim()
      .toLowerCase()
      .normalizeEmail()
      .isEmail()
      .withMessage('email is invalid'),
    check('password')
      .trim()
      .not()
      .isEmpty()
      .withMessage('password field is required')
      .isLength({ min: 5 })
      .withMessage('password must be at least 5 chars long'),
  ];
};

const updateUserValidationRules = () => {
  return [
    check('firstName').not().isEmpty(),
    check('lastName').not().isEmpty(),
    check('email').normalizeEmail().isEmail().withMessage('email is invalid'),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
    message: 'Invalid input',
  });
};

module.exports = {
  registerUserValidationRules,
  updateUserValidationRules,
  validate,
};
