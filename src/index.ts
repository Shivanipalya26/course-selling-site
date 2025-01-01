import express from "express";
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

import { userRouter } from "./routes/user"
import { adminRouter } from "./routes/admin"
import { courseRouter } from "./routes/course"

const app = express()
app.use(express.json())

const port = process.env.PORT || 3000
const DB_URI: string = process.env.DB_URI as string


if (!DB_URI) {
    throw new Error("DB_URI is not defined in the environment variables");
}

app.use('/api/v1/user', userRouter)
app.use('/api/v1/admin', adminRouter)
app.use('/api/v1/course', courseRouter)

async function main(): Promise<void> {
    try {
        await mongoose.connect(DB_URI)
        console.log("Successfully connected with database")

        app.listen(port, () => {
            console.log(`Listening on port : ${port}`)
        })
    } catch (error) {
        console.log("Error connecting to database, ", error)
    }
}

main()