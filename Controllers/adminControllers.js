const  cloudinary  = require("../Lib/cloudinary");
const Order = require("../Models/order");
const Product = require("../Models/product");
const userSchema = require("../Models/user");
const env = require("dotenv");
env.config();
const Stripe=require('stripe');
const stripe=Stripe(process.env.Stripe_Secret_key)
// get users
const getUsers = async (req, res) => {
  try {
    const allUsers = await userSchema.find().select("-password");
    res.status(200).json({ allUsers });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// delete user

const deleteUser = async (req, res) => {
  const { email } = req.body;
  try {
    await userSchema.deleteOne({ email });

    res.status(200).json({ message: "User Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "failed to delete user" });
  }
};

// get all orders

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();

    res.status(200).json({ allOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to fetch orders", error });
  }
};

// update order status

const updateOrderStatus = async (req, res) => {
  const { id, status } = req.body;

  try {
    await Order.findOneAndUpdate(
      { _id: id },
      { $set: { status } },
      { new: true }
    );

    res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to update order status", error });
  }
};

// get all products

const getProducts = async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.status(200).json({ allProducts });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to get products" });
  }
};

// update produck stock

const updateStock = async (req, res) => {
  const { sku, stock } = req.body;
  if (!sku || stock === undefined) {
    return res
      .status(400)
      .json({ message: "Missing id or stock", success: false });
  }
  console.log(sku, stock);

  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { sku: sku },
      { stock: Number(stock) },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ message: "Product not found", success: false });
    }

    res.status(200).json({ message: "Successfully updated", success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to update order status",
      error,
      success: false,
    });
  }
};

// find product and delete

const removeProduct = async (req, res) => {
  const { sku } = req.body;

  if (!sku) {
    return res.status(400).json({ 
      success: false,
      message: "Product SKU is required" 
    });
  }

  try {
    // 1. Find the product first to get image URLs
    const product = await Product.findOne({ sku });
    
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    // 2. Delete images from Cloudinary if they exist
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map(image => {
        const publicId = image.url.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(publicId);
      });
      
      await Promise.all(deletePromises);
    }

    // 3. Delete the product from database
    const deletedProduct = await Product.findOneAndDelete({ sku });

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: {
        sku: deletedProduct.sku,
        name: deletedProduct.name
      }
    });

  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
// add Product

const addProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    gender,
    category,
    material,
    brand,
    sku,
    sizes,
    colors,
    Images,
  } = req.body;

  if (!name || !description || !price || !stock || !gender || 
    !category || !material || !brand || !sku || 
    !sizes || sizes.length === 0 ||
    !colors || colors.length === 0 ||
    !Images || Images.length < 2) {
  return res.status(400).json({
    success: false,
    message: "All fields are required including at least 2 images"
  });
}

const findSku = await Product.findOne({ sku }); 
if (findSku) {
  return res.status(409).json({ 
    message: "This SKU is already in use",
    success: false
  });
}

  try {
    let imageArray = [];

    // Upload images to Cloudinary
    for (const element of Images) {
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(element);
        imageArray.push(cloudinaryResponse.secure_url);
      } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        return res.status(500).json({ message: "Unable to upload images", success: false });
      }
    }

    // Format images array with alt text
    const images = imageArray.map((url, index) => ({
      url,
      alt: `${name} - image ${index + 1}`
    }));

    // Create new product
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      gender,
      category,
      material,
      brand,
      sku,
      sizes,
      colors,
      images
    });

    // Save product to database
    const savedProduct = await newProduct.save();
    
    if (!savedProduct) {
      return res.status(500).json({ message: "Unable to save the product", success: false });
    }

    return res.status(201).json({ 
      message: "Product added successfully", 
      success: true,
      product: savedProduct 
    });

  } catch (error) {
    console.error("Error in addProduct:", error);
    return res.status(500).json({ message: "Failed to add product", success: false });
  }
};

// get recent 5 orders
const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    if (recentOrders.length === 0) {
      return res.status(404).json({ message: "No recent orders found", success: false });
    }

    res.status(200).json({
      message: "Recent orders found successfully",
      success: true,
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch recent orders",
      success: false,
    });
  }
};

// get stripe revenue
const getRevenue = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({
      limit: 100, // adjust as needed
    });

    const totalRevenue = payments.data.reduce((acc, payment) => {
      return acc + (payment.amount_received / 100); // Stripe uses cents
    }, 0);

    res.json({ revenue: totalRevenue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch revenue" });
  }
};


module.exports = {
  getUsers,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
  getProducts,
  updateStock,
  removeProduct,
  addProduct,
 getRecentOrders,
 getRevenue
};

