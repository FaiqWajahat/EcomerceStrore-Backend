const joi = require("joi");
const dotenv = require("dotenv");
const stripe = require("stripe")(process.env.Stripe_Secret_key);

dotenv.config();

const signupValidation = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().min(3).max(30).required()
      .messages({
        'string.empty':'Name cannot be empty',
        'string.min': 'Name should have at least {#limit} characters',
        'string.max': 'Name should not exceed {#limit} characters'
      }),
    email: joi.string().email().min(6).max(50).required()
      .messages({
        'string.email': 'Please enter a valid email address',
        'string.empty': 'Email cannot be empty'
      }),
    password: joi.string()
      .min(8)
      .max(30)
      .required()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'))
      .messages({
        'string.empty': 'Password cannot be empty',
        'string.min': 'Password must be at least {#limit} characters long',
        'string.pattern.base': 'Password must contain at least: 1 uppercase, 1 lowercase, 1 number, and 1 special character',
      }),
    role: joi.string().trim()
  }).options({ abortEarly: false });

  const { error } = schema.validate(req.body);
  if (error) {
    const errors = error.details.map(err => ({
      field: err.context.key,
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      message: "invalid name email password ",
      errors
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
    return res
      .status(400)
      .json({ message: "Invalid checkout items", success: false });
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
