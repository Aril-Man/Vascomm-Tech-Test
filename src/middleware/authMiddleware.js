import jwt from 'jsonwebtoken'

const verifyJwt = async (req, res, next) => {

    const token = req.headers.authorization || req.headers.authorization != undefined ? req.headers.authorization : undefined

    if (token === undefined) {
        return res.jsond(401, false, 'Invalid token');
    }
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.jsond(401, false, 'Invalid token');
        } else {
            req.body.user_role = decoded.role
            req.body.user_status = decoded.status
            next();
        }
    })


}

export {
    verifyJwt
}