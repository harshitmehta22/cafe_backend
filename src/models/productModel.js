const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true },
    available: { type: Boolean, default: true }, // Automatically set to true if stock > 0
    color: { type: String, required: true },
    size: [{ type: String, required: true }], // 👈 Accepts array of sizes
    material: { type: String, required: true },
    image: { type: String, required: true }
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
