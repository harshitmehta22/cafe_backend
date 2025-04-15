const Employee = require('../models/employeeModel')
const path = require('path');


const addEmployee = async (req, res) => {
    const { name, address, phone, position, salary, joiningDate, idProof, photo } = req.body;
    if (!name || !address || !phone || !position || !salary || !joiningDate || idProof || photo) {
        return res.status(400).json({ message: 'All fields are required.' });
    }
    try {
        const idProofPath = path.join(__dirname, 'uploads', `${Date.now()}-idproof.png`);
        const photoPath = path.join(__dirname, 'uploads', `${Date.now()}-photo.png`);
        const newEmployee = new Employee({
            name,
            address,
            phone,
            position,
            salary,
            joiningDate,
            idProof: idProofPath,  // Store file path
            photo: photoPath,      // Store file path
        });
        const savedEmployee = await newEmployee.save();
        res.status(201).json({
            message: 'Employee added successfully!',
            employee: savedEmployee,
        });
    } catch (error) {
        console.error('Error adding employee:', error.message);
        res.status(500).json({ message: 'Server error. Unable to add employee.' });
    }
};

const getAllEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found.' });
        }
        res.status(200).json({
            message: 'Employees fetched successfully!',
            employees: employees,
        });
    } catch (error) {
        console.error('Error fetching employees:', error.message);
        res.status(500).json({ message: 'Server error. Unable to fetch employees.' });
    }
};

const updateEmployee = async (req, res) => {
    const { id } = req.params;
    const { name, address, phone, position, salary, joiningDate, idProof, photo } = req.body;

    if (!id) {
        return res.status(400).json({ message: 'Employee ID is required.' });
    }

    try {
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found.' });
        }
        const updatedIdProofPath = idProof
            ? path.join(__dirname, 'uploads', `${Date.now()}-idproof.png`)
            : employee.idProof;

        const updatedPhotoPath = photo
            ? path.join(__dirname, 'uploads', `${Date.now()}-photo.png`)
            : employee.photo;
        employee.name = name || employee.name;
        employee.address = address || employee.address;
        employee.phone = phone || employee.phone;
        employee.position = position || employee.position;
        employee.salary = salary || employee.salary;
        employee.joiningDate = joiningDate || employee.joiningDate;
        employee.idProof = updatedIdProofPath;
        employee.photo = updatedPhotoPath;

        const updatedEmployee = await employee.save();

        res.status(200).json({
            message: 'Employee updated successfully!',
            employee: updatedEmployee,
        });
    } catch (error) {
        console.error('Error updating employee:', error.message);
        res.status(500).json({ message: 'Server error. Unable to update employee.' });
    }
};




module.exports = { addEmployee, getAllEmployees,updateEmployee };
