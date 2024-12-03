const jwt = require('jsonwebtoken')
const { HttpCodesEnum } = require('../enum/httpCodes');

const verifyToken = (req, res, next) => {

    const token = req.cookies.access_token;
    if (!token) {
        return res.status(HttpCodesEnum.FORBBIDEN).send('Login first');
    }

    jwt.verify(token, process.env.JWT, (err, user) => {
        if (err) {
            return res.status(HttpCodesEnum.FORBBIDEN).send('Token not valid');
        }

        req.user = user;

        next();
    })

}

const verifyUser = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            return res.status(HttpCodesEnum.FORBBIDEN).send('Not authorized');
        }
    })
}

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, next, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            return res.status(HttpCodesEnum.FORBBIDEN).send('Not authorized');
        }
    })
}

module.exports = {
    verifyAdmin,
    verifyUser
}