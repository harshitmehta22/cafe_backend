const express = require('express');
const { addCategory, deleteCategory, updateCategory } = require('../controllers/categoryController');
const { addProduct, deleteProduct, editProduct } = require('../controllers/productController');

const router = express.Router();

router.post('/category', addCategory);
router.post('/addproduct', addProduct);
router.put('/editproduct/:productId', editProduct)
router.delete('/delete-category/:id', deleteCategory)
router.put('/editcategory/:categoryId', updateCategory)
router.delete('/delete-product/:id', deleteProduct)


module.exports = router;
