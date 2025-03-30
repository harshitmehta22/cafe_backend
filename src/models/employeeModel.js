const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: String, required: true },
        position: { type: String, required: true },
        salary: { type: Number, required: true },
        joiningDate: { type: Date, required: true },
        idProof: { type: String, required: true }, // Path to file stored on the server
        photo: { type: String, required: true },    // Path to file stored on the server
    },
    { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
