const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/authMiddleware');
const {
    createPayroll,
    getAllPayroll,
    updatePayrollStatus,
    getMyPayroll
} = require('../controllers/payrollController');

router.use(auth);

router.use(authorize('admin')); // Following routes are admin-only
router.get('/all', getAllPayroll);
router.post('/', createPayroll);
router.put('/:id/status', updatePayrollStatus);

module.exports = router;
