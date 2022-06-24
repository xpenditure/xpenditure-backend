const { body, validationResult } = require('express-validator');

const registerValidationRules = () => {
  return [
    body('firstName').not().isEmpty(),
    body('lastName').not().isEmpty(),
    body('email').normalizeEmail().isEmail(),
    body('password')
      .isLength({ min: 5 })
      .withMessage('password must be at least 5 chars long'),
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
  });
};

module.exports = {
  registerValidationRules,
  validate,
};
