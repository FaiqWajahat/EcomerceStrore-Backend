const joi = require("joi");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.Stripe_Secret_key);

dotenv.config();

// Signup Validation Middleware
const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).required(),
    email: joi.string().email().min(6).required(),
    password: joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Invalid Name, Email, or Password",
      error: error.details?.[0]?.message || error.message,
    });
  }
  next();
};

// Login Validation Middleware
const loginValidation = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().min(6).required(),
    password: joi.string().min(4).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      message: "Invalid Email or Password",
      error: error.details?.[0]?.message || error.message,
    });
  }
  next();
};

// Order Verification Middleware
const orderVerification = (req, res, next) => {
  const { checkoutItems } = req.body; // Use lowercase 'checkoutItems'

  // Validate checkoutItems
  if (!Array.isArray(checkoutItems) || checkoutItems.length === 0) {
    return res.status(400).json({ message: "Invalid checkout items", success: false });
  }

  const line_items = checkoutItems.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
        images: item.image ? [item.image] : [], // Ensure images is an array
      },
      unit_amount: Math.round(item.price * 100), // Convert price to cents
    },
    quantity: item.quantity,
  }));

  req.body.line_items = line_items; // Attach to req.body for next middleware
  next();
};


module.exports = { signupValidation, loginValidation, orderVerification };
