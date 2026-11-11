
const express = require("express");
const router = express.Router();

const { getAllCustomers ,getCustomerById,
  deleteCustomer} = require("../controllers/userController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/", protect, adminOnly, getAllCustomers);
router.get("/:id", protect, adminOnly, getCustomerById);
router.delete("/:id", protect, adminOnly, deleteCustomer);

module.exports = router;
