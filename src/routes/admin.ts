import { Router, Request, Response } from "express";
import { login, signUp } from "../zod/auth.schema";
import { AdminModel, CourseModel } from "../db/db";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_ADMIN_PASSWORD } from "../config/config";
import { adminMiddleware } from "../middleware/admin";

const adminRouter = Router() 

adminRouter.post('/signup', async (req: any, res: any) => {
    const parseDataWithSuccess = signUp.safeParse(req.body)

    if(!parseDataWithSuccess.success) {
        res.status(400).json({
            msg: "Incorrect format"
        })
    }

    try {
        const adminExists = await AdminModel.findOne({
            email: req.body.email,
        })

        if(adminExists) {
            res.status(401).json({
                msg: "This email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 8)
        
        const admin = await AdminModel.create({
            email: req.body.email,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        })
        console.log(admin)

        return res.status(200).json({
            msg: "Successfully Signed Up",
            admin: admin
        })
    } catch (error) {
        res.status(500).json({
            msg: "Internal Server Error"
        })
    }
})

adminRouter.post('/login', async (req: any, res: any) => {
    const parsedDataWithSuccess = login.safeParse(req.body)

    if(!parsedDataWithSuccess.success) {
        return res.status(403).json({
            msg: "Invalid login credentials",
            error: parsedDataWithSuccess.error
        })
    }

    try {
        const admin = await AdminModel.findOne({
            email: req.body.email
        })

        if(!admin) {
            return res.status(401).json({
                msg: "Admin do not exist, kindly Sign Up !!!"
            })
        }

        const validPassword = await bcrypt.compare(req.body.password, admin.password)

        if(validPassword) {
            const token = jwt.sign({
                id: admin._id,
            }, JWT_ADMIN_PASSWORD as string)

            res.json({
                msg: "Successfully Logged in!!",
                admin, 
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

adminRouter.post('/course', adminMiddleware, async (req: any, res: any) => {

    try {
        const course = await CourseModel.create({
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            creatorId: req.adminId,
        })
    
        res.json({
            msg: "Course created",
            courseId: course._id,
        })
        
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
        });
    }
})

adminRouter.put('/course', adminMiddleware, async (req: any, res: any) => {

    try {
        const course = await CourseModel.findOneAndUpdate({
            _id: req.body.courseId,
            creatorId: req.adminId,
        }, {
            title: req.body.title,
            description: req.body.description,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
        }, { new: true })
    
        res.json({
            msg: "Course Updated",
            // courseId: course._id
        })

    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
        });
    }
})

adminRouter.get('/course/bulk', adminMiddleware, async (req: any, res: any) => {
    try {
        const course = await CourseModel.find({
            creatorId: req.adminId
        })

        res.json({
            courses: course
        })

    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
        });
    }
})

adminRouter.delete('/course', adminMiddleware, async (req: any, res: any) => {
    try {
        const course = await CourseModel.findOneAndDelete({
            _id: req.body.courseId,
            creatorId: req.adminId,
        })

        if (!course) {
            return res.status(404).json({ message: 'Course not found or not authorized to delete.' });
        }
    
        res.status(200).json({
            message: 'Course deleted successfully.',
            course, 
        });
        
    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
        });
    }
})
export { adminRouter }