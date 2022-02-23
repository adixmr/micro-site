const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        let token = req.headers['authorization']?.split(' ')[1]
        let user = jwt.verify(token, process.env.JWT_SECRET);
        req.body.username = user.username
        req.body.id = user.id
        
        next()
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}