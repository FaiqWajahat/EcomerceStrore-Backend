const express = require("express");
const {
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
} = require("../Controllers/adminControllers");
const adminRouter = express.Router();

adminRouter.get("/", (req, res) => {
  res.send("hello admin");
});

// Get all Users

adminRouter.get("/getUsers", getUsers);

// delete a selected user

adminRouter.put("/deleteUser", deleteUser);

// get all orders

adminRouter.get("/getOrders", getAllOrders);

// update order status

adminRouter.put("/updateOrder", updateOrderStatus);

// get all products
adminRouter.get("/getProducts", getProducts);

// update order stock
adminRouter.put("/updateStock", updateStock);

// find and delete a product

adminRouter.put("/deleteProduct", removeProduct);

// add product

adminRouter.post("/addProduct", addProduct);

//get Recent Orders

adminRouter.get("/getRecentOrders",getRecentOrders)

// get revenue

adminRouter.get("/Revenue", getRevenue);
module.exports = adminRouter;
