const userRepository = require('../repositories/userRepository');

async function attachSessionUser(req, res, next) {
    try {
        let token = req.cookies?.pulsex_session;
        let userId = req.cookies?.pulsex_user_id;

        if (!token && req.headers.authorization) {
            const parts = req.headers.authorization.split(' ');
            if (parts.length === 2 && parts[0] === 'Bearer') {
                token = parts[1];
            }
        }

        if (userId) {
            const profile = await userRepository.getProfile(userId);
            if (profile) {
                req.user = profile;
                req.currentUser = profile;
                res.locals.user = profile;
                res.locals.currentUser = profile;
                return next();
            }
        }

        // Fallback demo session if logged in cookie flag exists
        if (req.cookies?.pulsex_logged_in === 'true') {
            const defaultUser = {
                id: req.cookies?.pulsex_user_id || 'usr-pat-01',
                email: req.cookies?.pulsex_user_email || 'patient@pulsex.health',
                full_name: req.cookies?.pulsex_user_name || 'Alex Johnson',
                phone: '+1 555 0192',
                role: req.cookies?.pulsex_user_role || 'patient',
                blood_group: 'O+',
                age: 28,
                gender: 'Male',
                date_of_birth: '1998-05-14',
                address: '45 Broad Street, New York, NY',
                emergency_contact: '+1 800 555 0199',
                avatar_url: '/images/default-avatar.png'
            };
            req.user = defaultUser;
            req.currentUser = defaultUser;
            res.locals.user = defaultUser;
            res.locals.currentUser = defaultUser;
            return next();
        }

        req.user = null;
        req.currentUser = null;
        res.locals.user = null;
        res.locals.currentUser = null;
        next();
    } catch (err) {
        req.user = null;
        req.currentUser = null;
        res.locals.user = null;
        res.locals.currentUser = null;
        next();
    }
}

function requireAuth(req, res, next) {
    attachSessionUser(req, res, () => {
        if (!req.user) {
            if (req.xhr || req.headers.accept?.includes('json')) {
                return res.status(401).json({ success: false, error: 'Authentication required. Please log in.' });
            }
            return res.redirect('/login');
        }
        next();
    });
}

function redirectIfLoggedIn(req, res, next) {
    attachSessionUser(req, res, () => {
        if (req.user) {
            const role = req.user.role || 'patient';
            return res.redirect(`/dashboard/${role}`);
        }
        next();
    });
}

module.exports = {
    attachSessionUser,
    requireAuth,
    redirectIfLoggedIn
};
