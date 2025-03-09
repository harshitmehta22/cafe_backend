const Product = require('../models/productModel'); // Path to your product model

const addProduct = async (req, res) => {
    const { color, brand, price, category, height, width } = req.body;

    // Validate request body
    if (!color || !brand || !price || !category
        || !height || !width
    ) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        // Create a new product
        const newProduct = new Product({
            color,
            brand,
            price,
            category,
            height,
            width
        });
        // Save to the database
        const savedProduct = await newProduct.save();
        // Respond with the saved product
        res.status(201).json({
            message: 'Product added successfully!',
            product: savedProduct,
        });
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({ message: 'Server error. Unable to add product.' });
    }
};
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProuct = await Product.findByIdAndDelete(id);
        if (!deletedProuct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product deleted successfully!' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Server error. Unable to delete product.' });
    }
}
const editProduct = async (req, res) => {
    const { productId } = req.params;
    const { color, brand, price, category, height, width } = req.body;
    if (!productId) {
        return res.status(400).json({ message: 'Product ID is required.' });
    }
    if (!color && !brand && !price && !category && !height && !width) {
        return res.status(400).json({ message: 'At least one field to update is required.' });
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { color, brand, price, category, height, width },
            { new: true }
        );
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({
            message: 'Product updated successfully!',
            product: updatedProduct,
        });
    } catch (error) {
        console.error('Error editing product:', error.message);
        res.status(500).json({ message: 'Server error. Unable to update product.' });
    }
};



module.exports = { addProduct, deleteProduct, editProduct };
