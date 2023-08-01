const verifyJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ 'status': 'failure', 'message': 'No token provided' });
    }

    jsonwebtoken.verify(token, 'your_secret_key', (err, decoded) => {
        if (err) {
            return res.status(403).json({ 'status': 'failure', 'message': 'Invalid token' });
        }

        req.user = decoded;
        next();
    });
};

export { verifyJWT };