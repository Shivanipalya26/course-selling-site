import { Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_ADMIN_PASSWORD } from "../config/config";

export async function adminMiddleware(req:any, res: Response, next: NextFunction):Promise<void> {
    if(JWT_ADMIN_PASSWORD == null || !JWT_ADMIN_PASSWORD) {
        throw Error ("No admin jwt password")
    }

    const token = req.headers.token as string

    if(token == null || !token) {
        throw Error ("No token available")
    }

    const decodedToken = await jwt.verify(token, JWT_ADMIN_PASSWORD)

    if(decodedToken) {
        req.adminId = (decodedToken as JwtPayload).id
        next()
    } else{
        res.status(403).json({
            msg: "You are not signed in!!"
        })
    }
}