
const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  
  createdAt: { type: Date, default: Date.now }, 

  email:{type:String,required:true},

  checkoutItems: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      color: { type: String, required: true },
      size: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 }, 
      image: { type: String, required: true },
    },
  ],

  shippingAddress: {
    firstName:{type:String,required:true},
    lastName:String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    postalCode:Number,
    phone:{type:Number,required:true}
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;