const Product = require('../models/productModel'); // Path to your product model

const addProduct = async (req, res) => {
    const {
        name,
        brand,
        price,
        category,
        color,
        size,
        material
    } = req.body;
    // Multer adds image file to req.file
    if (!name || !brand || !price || !category || !color || !size || !material || !req.file) {
        return res.status(400).json({ message: "All fields and an image are required." });
    }

    try {
        const newProduct = new Product({
            name,
            brand,
            price,
            category,
            color,
            size: Array.isArray(size) ? size : [size], // Ensure size is an array
            material,
            image: req.file.filename // Or req.file.path if using path directly
        });

        const savedProduct = await newProduct.save();

        res.status(201).json({
            message: "Shoe product added successfully!",
            product: savedProduct
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ message: "Server error while adding product." });
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
