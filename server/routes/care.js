const router = require('express').Router();
const Exercise = require('../models/Exercise');
const Medicine = require('../models/Medicine');

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

module.exports = router;
