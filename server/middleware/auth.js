import { clerkClient, verifyToken } from '@clerk/express';
import User from '../models/User.js';

// Verify Clerk Token and attach user
export const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, please login'
            });
        }

        try {
            // Verify the Clerk session token
            const payload = await verifyToken(token, {
                secretKey: process.env.CLERK_SECRET_KEY
            });

            // Get or create user from our database
            let user = await User.findOne({ clerkId: payload.sub });

            if (!user) {
                // Fetch user details from Clerk
                const clerkUser = await clerkClient.users.getUser(payload.sub);

                const userEmail = clerkUser.emailAddresses[0]?.emailAddress;

                // Check if email matches ADMIN_EMAIL to assign admin role
                const isAdmin = userEmail === process.env.ADMIN_EMAIL;

                // Create new user in our database
                user = await User.create({
                    clerkId: payload.sub,
                    name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || userEmail?.split('@')[0] || 'User',
                    email: userEmail,
                    phone: clerkUser.phoneNumbers[0]?.phoneNumber || '',
                    role: isAdmin ? 'admin' : 'user',
                    profileImage: clerkUser.imageUrl || '',
                    cart: [],
                    favorites: []
                });
            }

            req.user = user;
            next();
        } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            return res.status(401).json({
                success: false,
                message: 'Not authorized, token failed'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication'
        });
    }
};

// Role-based access control
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role '${req.user.role}' is not authorized to access this route`
            });
        }
        next();
    }
};

// Optional authentication - continues even if no auth (for guest users)
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token) {
            try {
                // Verify the Clerk session token
                const payload = await verifyToken(token, {
                    secretKey: process.env.CLERK_SECRET_KEY
                });

                // Get user from database
                const user = await User.findOne({ clerkId: payload.sub });

                if (user) {
                    req.user = user;
                }
            } catch (verifyError) {
                // Continue without auth if token is invalid
                console.log('Optional auth: Invalid token, continuing as guest');
            }
        }

        // Continue regardless of authentication status
        next();
    } catch (error) {
        console.error('Optional auth error:', error);
        // Continue even on error
        next();
    }
};

// Aliases for better readability
export const requireAuth = protect;
export const requireAdmin = (req, res, next) => {
    protect(req, res, (err) => {
        if (err) return next(err);
        authorize('admin')(req, res, next);
    });
};

export default { protect, authorize, requireAuth, requireAdmin, optionalAuth };
