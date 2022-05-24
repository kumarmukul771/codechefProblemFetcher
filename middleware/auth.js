const jwt = require('jsonwebtoken');

function auth(req, res, next){
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied no token provided');

    try{
        // If token is verified this returns payload
        const decoded = jwt.verify(token , config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
    
}

module.exports = auth;