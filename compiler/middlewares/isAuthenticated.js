const jwt = require ("jsonwebtoken");

const isAuthenticated = (req,res,next) =>{
    const authHeader= req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({message: "Unauthorized access"});
    }

    const token= authHeader.split(' ')[1];

    try {
        const decoded= jwt.verify(token, process.env.SECRET_KEY);
        req.user= decoded;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};
module.exports = isAuthenticated;