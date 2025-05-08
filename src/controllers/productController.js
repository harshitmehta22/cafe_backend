const Product = require('../models/productModel'); // Path to your product model

const addProduct = async (req, res) => {
    const {
        name,
        brand,
        price,
        category,
        stock,
        color,
        size,
        material
    } = req.body;

    const image = req.file;

    // Validate required fields
    if (!name || !brand || !price || !category || !color || !size || !material || !image || stock === undefined) {
        return res.status(400).json({ message: "All fields including stock and image are required." });
    }

    try {
        const stockNumber = parseInt(stock, 10);
        const available = stockNumber > 0; // Automatically determine availability

        const newProduct = new Product({
            name,
            brand,
            price,
            category,
            color,
            size: Array.isArray(size) ? size : [size],
            material,
            stock: stockNumber,
            available,
            image: image.filename
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
const getFilteredProducts = async (req, res) => {
    const { search } = req.query;

    try {
        const query = search
            ? {
                name: { $regex: search, $options: 'i' } // case-insensitive match
            }
            : {};

        const products = await Product.find(query);

        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        res.status(200).json({
            message: 'Products fetched successfully!',
            products,
        });
    } catch (error) {
        console.error('Error fetching products:', error.message);
        res.status(500).json({ message: 'Server error. Unable to fetch products.' });
    }
};
const getLatestProducts = async (req, res) => {
    try {
        const products = await Product.find()
            .sort({ createdAt: -1 }) // newest first
            .limit(10);

        res.status(200).json({
            message: "Top 10 latest products fetched successfully",
            products,
        });
    } catch (error) {
        console.error("Error fetching latest products:", error.message);
        res.status(500).json({ message: "Server error while fetching latest products." });
    }
};




module.exports = { addProduct, deleteProduct, editProduct, getProducts, filterProducts, getFilteredProducts, getLatestProducts };
