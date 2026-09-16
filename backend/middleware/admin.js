module.exports = function (req, res, next) {
    const isAdminAccount = req.user?.isAdmin === true || req.user?.role === "admin";
    if (!isAdminAccount) {
        return res.status(403).json({ message: "Access denied. Admin only." });
    }
    next();
};
