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
    const image = req.file;
    // Multer adds image file to req.file
    if (!name || !brand || !price || !category || !color || !size || !material || !image) {
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
    const { productId } = req.params;
    try {
        const deletedProuct = await Product.findByIdAndDelete(productId);
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
    const {
        name,
        brand,
        price,
        category,
        color,
        size,
        material
    } = req.body;

    const updateFields = {};

    if (name !== undefined) updateFields.name = name;
    if (brand !== undefined) updateFields.brand = brand;
    if (price !== undefined) updateFields.price = price;
    if (category !== undefined) updateFields.category = category;
    if (color !== undefined) updateFields.color = color;
    if (size !== undefined) updateFields.size = Array.isArray(size) ? size : [size];
    if (material !== undefined) updateFields.material = material;

    // Handle uploaded image
    if (req.file) {
        const imagePath = `/uploads/${req.file.filename}`;
        updateFields.image = imagePath;
    }

    if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: 'At least one field to update is required.' });
    }

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: updateFields },
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
const getProducts = async (req, res) => {
    try {
        const product = await Product.find();
        if (product.length === 0) {
            return res.status(404).json({ message: 'No product found.' });
        }
        res.status(200).json({
            message: 'Product fetched successfully!',
            product,
        });
    } catch (error) {
        console.error('Error fetching product:', error.message);
        res.status(500).json({ message: 'Server error. Unable to fetch product.' });
    }
};
const filterProducts = async (req, res) => {
    try {
        const { brand, color, size, minPrice, maxPrice } = req.query;

        const filter = {};

        if (brand) {
            filter.brand = brand;
        }

        if (color) {
            filter.color = color;
        }

        if (size) {
            // Match any of the sizes
            filter.size = size;
        }

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        const products = await Product.find(filter);

        res.status(200).json({
            message: "Filtered products fetched successfully",
            products,
        });
    } catch (error) {
        console.error("Error filtering products:", error.message);
        res.status(500).json({ message: "Server error while filtering products." });
    }
};




module.exports = { addProduct, deleteProduct, editProduct, getProducts, filterProducts };
