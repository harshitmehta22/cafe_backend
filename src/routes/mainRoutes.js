const express = require('express');
const { addCategory, deleteCategory, updateCategory, getAllCategories } = require('../controllers/categoryController');
const { addProduct, deleteProduct, editProduct } = require('../controllers/productController');

// Multer upload middleware (handling photo and idProof upload)
const router = express.Router();

router.post('/category', addCategory);
router.get('/getcategory', getAllCategories)
router.post('/addproduct', addProduct);
router.put('/editproduct/:productId', editProduct)
router.delete('/delete-category/:id', deleteCategory)
router.put('/editcategory/:categoryId', updateCategory)
router.delete('/delete-product/:id', deleteProduct)


module.exports = router;
