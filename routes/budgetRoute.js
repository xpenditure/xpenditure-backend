const express = require('express');
const {
  createBudget,
  fetchBudgets,
} = require('../controllers/budgetController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createBudget).get(protect, fetchBudgets);

module.exports = router;
