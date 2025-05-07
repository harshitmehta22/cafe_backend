const express = require('express');
const { addCategory, deleteCategory, updateCategory, getAllCategories } = require('../controllers/categoryController');
const { addProduct, deleteProduct, editProduct, getProducts, filterProducts, getFilteredProducts, getLatestProducts } = require('../controllers/productController');
const multer = require('multer');
const path = require("path");

// Multer upload middleware (handling photo and idProof upload)
const router = express.Router();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // create this folder if it doesn't exist
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/category', addCategory);
router.get('/getcategory', getAllCategories)
router.put('/editcategory/:categoryId', updateCategory)
router.delete('/delete-category/:id', deleteCategory)
router.get('/getproduct', getProducts);
router.post("/addproduct", upload.single("image"), addProduct);
router.put('/editproduct/:productId', upload.single('image'), editProduct)
router.delete('/delete-product/:productId', deleteProduct)
router.get('/products/filter', filterProducts);
router.get('/search-products', getFilteredProducts);
router.get('/latestproducts',getLatestProducts)

module.exports = router;
