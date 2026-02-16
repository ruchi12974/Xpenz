import jwt from "jsonwebtoken";

const authenticationMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided access denied" });
    }   
    const token = authHeader.split(" ")[1];
    const jwtSecret = process.env.JWT_SECRET; 
    try {
        const decoded = jwt.verify(token, jwtSecret); 
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token access denied " });
    }   
}

export default authenticationMiddleware;