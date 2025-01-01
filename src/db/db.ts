import exp from "constants";
import mongoose from "mongoose";

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
})

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    }
})

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    price: Number,
    imgUrl: String,
    creatorId: ObjectId,
})

const purchaseSchema = new Schema({
    courseId: ObjectId,
    userId: ObjectId,
    status: { 
        type: String,
        enum: ['purchased', 'pending'],  
        default: 'pending'
    },
    purchaseDate: {
        type: Date,
        default: Date.now 
    },
})

export const UserModel = mongoose.model('user', userSchema)
export const AdminModel = mongoose.model('admin', adminSchema)
export const CourseModel = mongoose.model('course', courseSchema)
export const PurchaseModel = mongoose.model('purchase', purchaseSchema)