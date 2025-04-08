const express = require("express");
const {
  loginValidation,
  signupValidation,
  orderVerification,
} = require("../Middlewares/middlewares");
const { login, signup, order, myOrders,orderDetails } = require("../Controllers/controllers");
const router = express.Router();

router.post("/signup", signupValidation, signup);

router.post("/login", loginValidation, login);

router.post("/order", orderVerification,order);

router.post('/myOrders',myOrders);

router.post("/orderDetails",orderDetails);

module.exports = router;
