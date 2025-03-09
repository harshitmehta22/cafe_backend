const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    color: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        validate: {
            validator: (value) => value >= 0,
            message: 'Price must be a positive number',
        },
    },
    height: {
        type: Number, required: true
    },
    width: {
        type: Number, required: true
    },
    category: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
