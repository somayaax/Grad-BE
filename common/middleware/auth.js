const jwt = require("jsonwebtoken")
const userModel = require("../../DB/models/user")
const auth = (data) => {
    return async (req, res, next) => {
        try {
            const headerToken = req.headers['authorization']
            // console.log(headerToken);
            if (!headerToken || headerToken == null || headerToken == undefined || !headerToken.startsWith('Bearer')) {
                res.status(400).json({ message: "invalid token" })
            } else {
                const token = headerToken.split(" ")[1]
                // console.log(token);
                const decoded = jwt.verify(token, process.env.SECRET_KEY)
                const user = await userModel.findById(decoded.id)
                // console.log(user);
                if (user) {
                    if (data.includes(user.role)) {
                        req.user = user
                        // console.log(req.user);
                        next()
                    } else {
                        res.status(401).json({ message: "unauthorized access" })
                    }
                } else {
                    res.status(400).json({ message: "invalid token data" })
                }
            }
        } catch (err) {
            res.status(500).json({ message: 'server error', err })
        }
    }
}
module.exports = auth