import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: 'Login not Authorized!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res
                .status(401)
                .json({ success: false, message: 'Not Authorized. Please login again' });
        }

        req.userId = decoded.id;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({ success: false, message: 'Invalid or expired token' });
    }
};

export default userAuth;
