const router = require('express').Router();
const Message = require('../models/Message');

// Get messages for a conversation or user? 
// Ideally get all messages involving a user to filter on client, or per conversation.
// For simplicity matching AppContext, we'll get all messages for the current user (sender or receiver).
router.get('/:userId', async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { senderId: req.params.userId },
                { receiverId: req.params.userId },
                { receiverId: { $regex: /^GROUP_/ } }
            ]
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Send message
router.post('/', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
