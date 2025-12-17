const router = require('express').Router();
const Exercise = require('../models/Exercise');
const Medicine = require('../models/Medicine');
const Activity = require('../models/Activity');
const Report = require('../models/Report');
const Alert = require('../models/Alert');

// --- Exercises ---
router.post('/exercises', async (req, res) => {
    try {
        const newExercise = new Exercise(req.body);
        const savedExercise = await newExercise.save();
        res.status(201).json(savedExercise);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/exercises', async (req, res) => {
    try {
        const exercises = await Exercise.find();
        res.status(200).json(exercises);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/exercises/:id', async (req, res) => {
    try {
        await Exercise.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: 'Exercise deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/exercises/:id', async (req, res) => {
    try {
        const updated = await Exercise.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Medicines ---
router.post('/medicines', async (req, res) => {
    try {
        const newMedicine = new Medicine(req.body);
        const savedMedicine = await newMedicine.save();
        res.status(201).json(savedMedicine);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/medicines', async (req, res) => {
    try {
        const medicines = await Medicine.find();
        res.status(200).json(medicines);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/medicines/:id', async (req, res) => {
    try {
        await Medicine.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: 'Medicine deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/medicines/:id', async (req, res) => {
    try {
        const updated = await Medicine.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Activities ---
router.post('/activities', async (req, res) => {
    try {
        const newActivity = new Activity(req.body);
        const savedActivity = await newActivity.save();
        res.status(201).json(savedActivity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/activities', async (req, res) => {
    try {
        const activities = await Activity.find();
        res.status(200).json(activities);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/activities/:id', async (req, res) => {
    try {
        await Activity.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: 'Activity deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/activities/:id', async (req, res) => {
    try {
        const updated = await Activity.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Reports ---
router.post('/reports', async (req, res) => {
    try {
        const newReport = new Report(req.body);
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.status(200).json(reports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/reports/:id', async (req, res) => {
    try {
        const updated = await Report.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Alerts ---
router.get('/alerts', async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 });
        res.status(200).json(alerts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put('/alerts/:id', async (req, res) => {
    try {
        const updated = await Alert.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
