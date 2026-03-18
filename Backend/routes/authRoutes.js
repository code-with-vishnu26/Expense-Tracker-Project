const router = require('express').Router();
const { register, login, getUserProfile, updateProfile, forgotPassword, resetPassword } = require('../controllers/auth');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const User = require('../models/userModel');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.put('/auth/reset-password/:token', resetPassword);
router.get('/auth/profile', protect, getUserProfile);
router.put('/auth/profile', protect, updateProfile);

// Avatar upload
router.post('/auth/avatar', protect, upload.single('avatar'), async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.avatar = `/uploads/avatars/${req.file.filename}`;
        await user.save({ validateBeforeSave: false });
        res.json({ avatar: user.avatar });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed' });
    }
});

module.exports = router;
