const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/auth");              // FIXED
const admin = require("../middleware/admin");

const router = express.Router();

// Get all users
router.get("/users", auth, admin, async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "admin" } });
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Delete user
router.delete("/users/:id", auth, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (user.role === "admin") {
            return res.status(403).json({ message: "Cannot delete admin account" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
