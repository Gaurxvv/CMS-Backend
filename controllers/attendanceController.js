const Attendance = require('../models/Attendance');

const checkIn = async (req, res) => {
    try {
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });

        // Check if already checked in
        let attendance = await Attendance.findOne({ userId: req.user.id, date });

        if (attendance) {
            return res.status(400).json({ message: 'Already checked in for today' });
        }

        attendance = new Attendance({
            userId: req.user.id,
            date,
            checkIn: time,
            status: 'Present'
        });

        await attendance.save();
        res.status(201).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const checkOut = async (req, res) => {
    try {
        const date = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });

        const attendance = await Attendance.findOne({ userId: req.user.id, date });

        if (!attendance) {
            return res.status(400).json({ message: 'Must check in first' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'Already checked out for today' });
        }

        attendance.checkOut = time;
        await attendance.save();
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAttendanceStatus = async (req, res) => {
    try {
        const date = new Date().toISOString().split('T')[0];
        const attendance = await Attendance.findOne({ userId: req.user.id, date });
        res.json(attendance || { message: 'Not checked in' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAttendanceHistory = async (req, res) => {
    try {
        const { month, year } = req.query;
        let query = { userId: req.user.id };

        if (month && year) {
            const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
            const endDate = `${year}-${month.toString().padStart(2, '0')}-31`; // Simplified for query
            query.date = { $gte: startDate, $lte: endDate };
        }

        const history = await Attendance.find(query).sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.find().populate('userId', 'name email').sort({ date: -1 });
        res.json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    checkIn,
    checkOut,
    getAttendanceStatus,
    getAttendanceHistory,
    getAllAttendance
};
