const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String, // e.g., "March 2026"
        required: true
    },
    base: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number,
        default: 0
    },
    extraDays: {
        type: Number,
        default: 0
    },
    tax: {
        type: Number,
        default: 0
    },
    deductions: {
        type: Number,
        default: 0
    },
    netPay: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Paid', 'Pending'],
        default: 'Pending'
    },
    paymentDate: {
        type: Date
    }
}, { timestamps: true });

module.exports = mongoose.model('Payroll', payrollSchema);
