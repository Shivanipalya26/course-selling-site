import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_USER_PASSWORD } from "../config/config";
import { Response, NextFunction } from "express";

export async function userMiddleware(req: any, res: Response, next: NextFunction) : Promise<void> {
    if(JWT_USER_PASSWORD == null || !JWT_USER_PASSWORD) {
        throw Error("No user jwt password")
    }

    const token = req.headers.token as string

    if(!token || token == null) {
        throw Error("No token available")
    }
    const decodedToken = jwt.verify(token, JWT_USER_PASSWORD)

    if(decodedToken) {
        req.userId = (decodedToken as JwtPayload).id
        next()
    } else {
        res.status(403).json({
            msg: "You are not signed in!!"
        })
    }

}