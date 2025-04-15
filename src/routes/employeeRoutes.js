const express = require('express');
const { addEmployee, getAllEmployees, updateEmployee } = require('../controllers/employeeController');
const multer = require('multer');
const path = require('path');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post('/employee', upload.fields([{ name: 'idProof' }, { name: 'photo' }]), addEmployee);
router.put('/employees/:id', updateEmployee);
router.get('/allemployee', getAllEmployees)

module.exports = router;
