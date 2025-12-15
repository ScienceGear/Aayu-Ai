const router = require('express').Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update user
router.put('/:id', async (req, res) => {
    try {
        console.log(`[DEBUG] Updating user ${req.params.id}`);
        console.log(`[DEBUG] Payload:`, JSON.stringify(req.body, null, 2));
        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: req.body },
            { new: true }
        );
        console.log('[DEBUG] User updated successfully:', updatedUser ? 'Yes' : 'No');
        res.status(200).json(updatedUser);
    } catch (err) {
        console.error('Update failed:', err);
        res.status(500).json({ message: err.message });
    }
});

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        await User.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Rate a caregiver
router.post('/:id/rate', async (req, res) => {
    try {
        const { elderId, elderName, rating, comment } = req.body;
        const user = await User.findOne({ id: req.params.id });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newFeedback = {
            elderId,
            elderName,
            rating,
            comment,
            date: new Date()
        };

        user.feedbacks.push(newFeedback);

        // Recalculate average rating
        const currentTotal = (user.rating || 0) * (user.ratingsCount || 0);
        const newTotal = currentTotal + rating;
        user.ratingsCount = (user.ratingsCount || 0) + 1;
        user.rating = newTotal / user.ratingsCount;

        await user.save();
        res.status(200).json({ message: 'Rating added', rating: user.rating });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
