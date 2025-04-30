const jwt = require('jsonwebtoken')

class AuthCheck {
    authCheck(req, res, next) {
        const authHeader = req.headers['authorization']

        const token = authHeader.split(' ')[1]

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid token' })
            }
            req.user = user;
            next()
        })
    }
}

module.exports = new AuthCheck()