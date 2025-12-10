const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
        return res.status(401).json({ message: "No token provided" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "default");

        // Load user WITHOUT password
        const user = await User.findById(decoded.id).select("-password");

        if (!user)
            return res.status(401).json({ message: "User not found" });

        req.user = user;   // ⭐ This fixes your “undefined req.user”
        next();

    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid token" });
    }
};
