const express = require('express');
const { addEmployee, getAllEmployee } = require('../controllers/employeeController');

const router = express.Router();

router.post('/employee', addEmployee);
router.get('/allemployee', getAllEmployee)

module.exports = router;
