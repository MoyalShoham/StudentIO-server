import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    console.log("auth middleware");

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send("missing token");
    }

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).send("invalid token");
        }
        req.body.user = user;
        next();
    });
}

export default authMiddleware;