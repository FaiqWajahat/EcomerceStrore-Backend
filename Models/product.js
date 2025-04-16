const mongoose= require( "mongoose")

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    sku: { type: String, unique: true, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    material: { type: String },
    gender: { type: String, required:true},
    images: [
        {
          url: { type: String, required: true },
          altText: { type: String },
        }
      ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

module.exports=Product;
