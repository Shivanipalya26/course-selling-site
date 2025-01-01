import { Router, Request, Response } from "express";
import { CourseModel, PurchaseModel } from "../db/db";
import { userMiddleware } from "../middleware/user";

const courseRouter = Router()

courseRouter.get('/preview', async (req: any, res: any) => {

    try {
        const courses = await CourseModel.find({})

        if (!courses.length) {
            return res.status(404).json({
                msg: "No courses found",
            });
        }

        res.json({
            courses
        })

    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
        });
    }

})

courseRouter.post('/purchase', userMiddleware,  async (req: any, res: any) => {
    try {
        const purchases = await PurchaseModel.find({
            userId: req.userId,
            courseId: req.body.courseId
        })

        console.log(purchases)

        if (purchases.length > 0) {
            return res.status(400).json({
                msg: "You have already bought this course"
            });

        } else{
            const newPurchase = new PurchaseModel({
                userId: req.userId,
                courseId: req.body.courseId,
                status: 'purchased',
                purchaseDate: new Date()
            })
    
            await newPurchase.save()
    
            res.json({
                msg: "You have bought the course",
                purchases: newPurchase
            })
        }
        

    } catch (error) {
        res.status(500).json({
            msg: "Internal server error",
        });
    }
})

export { courseRouter }
