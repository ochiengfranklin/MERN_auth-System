import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Login not Authorized!' });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (tokenDecode.id) {
            //  store user id here (GET requests do NOT use req.body)
            req.userId = tokenDecode.id;
        } else {
            return res.json({ success: false, message: 'Not Authorized. Please login again' });
        }

        //  middleware continues here(sendVerifyOtp next)
        next();

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default userAuth;
