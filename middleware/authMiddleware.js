const { supabase } = require('../config/supabase');

/**
 * Authentication Middleware: Validates Supabase JWT session token
 */
async function authenticateUser(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        let token = null;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required. Missing Bearer token.'
            });
        }

        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid or expired session token.'
            });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (err) {
        next(err);
    }
}

/**
 * Role Authorization Middleware
 * @param  {...string} roles - Allowed user roles ('patient', 'doctor', 'hospital', 'admin')
 */
function authorizeRoles(...roles) {
    return async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const userRole = req.user.user_metadata?.role || req.user.role || 'patient';
        if (!roles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                error: `Access denied. Requires one of roles: ${roles.join(', ')}`
            });
        }
        next();
    };
}

module.exports = {
    authenticateUser,
    authorizeRoles
};
