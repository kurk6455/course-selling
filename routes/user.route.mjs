import express from 'express';
import { userModel, courseModel, purchaseModel } from '../db.mjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const { JWT_SECRET } = process.env;
import bcrypt from 'bcrypt';
import { userAuth , zodAuth } from '../auth.mjs';

const userRoute = express.Router();

userRoute.post('/signup', zodAuth, async (req, res) => {
    //If validated retrive
    const { userName, email, password } = req.body;
    console.log(userName + " " + email + " " + password);

    //Store only hashed password in db
    const hashPassword = await bcrypt.hash(password, 5);

    //DB call
    try {
        const user = await userModel.create({
            userName, email, password: hashPassword
        })

        res.json({
            message: "User : Signup successfull"
        });

    } catch (e) {
        return res.status(403).json({
            message: "User : Email alread exist login"
        });
    }
})

userRoute.post('/login', zodAuth, async (req, res) => {
    //If validate retrive
    const { email, password } = req.body;
    console.log(email + " " + password);

    //DB call
    try {
        const user = await userModel.findOne({
            email
        })

        //compare b/w the plain password and hashed
        const decodedPassword = await bcrypt.compare(password, user.password);
        if (!decodedPassword) {
            return res.status(403).json({
                message: "User : Invalid password"
            });
        }

        //Generate token - should be inside it's own try-catch
        const token = jwt.sign(user._id.toString(), JWT_SECRET);

        res.json({
            token: `bearer user ${token}`,
            message: "User : login successful"
        })

    } catch (e) {
        return res.status(403).json({
            message: "User : Invalid email"
        })
    }
})

userRoute.get('/courses', async (req, res) => {
    //DB call - without authentication
    try {
        const courses = await courseModel.find({});

        res.json({
            courses
        })
    } catch (e) {
        return res.status(500).json({
            message: "Unable to find courses"
        });
    }
})

userRoute.post('/purchase', userAuth, async (req, res) => {
    const { userId } = req.headers;
    const { courseId } = req.body;

    try {
        const purchase = purchaseModel.create({
            userId, courseId
        })

        res.json({
            message: `Purchase successful`
        })
    } catch (e) {
        res.status(500).json({
            message: "Unable to find the course"
        })
    }
})

userRoute.get('/purchasedCourse', userAuth, async (req, res) => {
    const { userId } = req.headers;
    // console.log(userId);

    try {
        const purchased = await purchaseModel.find({ userId });
        if (purchased.length == 0) {
            return res.status(200).json({
                courses: []
            });
        }
        // console.log(purchased);
        const courseIds = purchased.map(ele => ele.courseId);
        const courses = await courseModel.find({
            _id: {
                $in : courseIds
            }
        })

        // console.log(courses);
        res.json({
            courses
        })
    } catch (e) {
        return res.status(500).json({
            message: "unable to find the course that you purchased"
        })
    }
})

userRoute.delete('/purchasedCourse', userAuth, async (req, res) => {
    const { userId } = req.headers;
    const { courseId } = req.body;
    console.log(userId);

    try {
        const purchased = await purchaseModel.findOneAndDelete({ userId, courseId });

        res.json({
            message: "Course delete successfull"
        })
    } catch (e) {
        return res.status(500).json({
            message: "unable to delete course that you purchased"
        })
    }
})

export{
    userRoute
}