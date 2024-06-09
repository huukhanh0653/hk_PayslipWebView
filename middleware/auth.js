function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({message: 'Unauthorized'});
}

function isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.Admin === true) {
        return next();
    } else
        return res.status(403).json({message: 'Forbidden'});
}

module.exports = {isAuthenticated, isAdmin}