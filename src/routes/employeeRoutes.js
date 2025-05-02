const express = require('express');
const { addEmployee, getAllEmployees, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/employee', upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'idProof', maxCount: 1 }
]), addEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/deleteemployee/:employeeId', deleteEmployee)
router.get('/allemployee', getAllEmployees)

module.exports = router;
