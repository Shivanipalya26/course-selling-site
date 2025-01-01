import { Router, Request, Response } from "express"
import { login, signUp } from "../zod/auth.schema"
import { CourseModel, PurchaseModel, UserModel } from "../db/db"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_USER_PASSWORD } from "../config/config"
import { userMiddleware } from "../middleware/user"

const userRouter = Router()

userRouter.post('/signup', async (req: any, res: any) => {
    const parsedDataWithSuccess = signUp.safeParse(req.body)
    console.log(parsedDataWithSuccess)

    if(!parsedDataWithSuccess.success) {
        return res.status(400).json({
            msg: "Incorrect format",
            // error: parsedDataWithSuccess.error
        })
    }

    try {
        const userExists = await UserModel.findOne({
            email: req.body.email
        })

        if(userExists) {
            return res.status(401).json({
                msg: "This email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 8)

        const user = await UserModel.create({
            email: req.body.email,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })
        console.log(user)

        return res.status(200).json({
            msg: "Successfully Signed Up",
            user: user
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Internal server error"
        })
    }
})

userRouter.post('/login', async (req: any, res: any) => {
    const parsedDataWithSuccess = login.safeParse(req.body)

    if(!parsedDataWithSuccess.success) {
        return res.status(403).json({
            msg: "Invalid login credentials",
            error: parsedDataWithSuccess.error
        })
    }

    try {
        const user = await UserModel.findOne({
            email: req.body.email
        })

        if(!user) {
            return res.status(401).json({
                msg: "User do not exist, kindly Sign Up !!!"
            })
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)

        if(validPassword) {
            const token = jwt.sign({
                id: user._id,
            }, JWT_USER_PASSWORD as string)

            res.json({
                msg: "Successfully Logged in!!",
                user, 
                token,
            })
        } else {
            return res.status(411).json({
                msg: "Invalid Password"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

userRouter.get('/purchases', userMiddleware, async (req: any, res: any) => {
    try {
        const purchases = await PurchaseModel.find({
            userId: req.userId
        })
        console.log(purchases)

        if(purchases.length === 0) {
            return res.json({
                purchases: [],
                courseData: [], 
            })
        }

        const purchaseCourseIds = purchases.map( purchase => purchase.courseId)

        const courseData = await CourseModel.find({
            _id: { $in : purchaseCourseIds }
        })

        res.json({
            purchases,
            courseData
        })
    } catch (error) {
        console.error('Error fetching purchases:', error);
        res.status(500).json({ message: 'Internal server error.' });  
    }  
})

export { userRouter }
