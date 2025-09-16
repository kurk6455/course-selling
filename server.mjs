import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { userModel, adminModel, courseModel, purchaseModel } from './db.mjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const { JWT_SECRET, mongodbClusterString } = process.env;
import bcrypt from 'bcrypt';
import { userAuth, adminAuth, zodAuth } from './auth.mjs';

const app = express();
try {
    await mongoose.connect(mongodbClusterString);
    console.log("database connection successfull");
} catch (e) {
    console.log(e)
}


app.use(cors());
app.use(express.json());


app.post('/userSignup', zodAuth, async (req, res) => {
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

app.post('/userLogin', zodAuth, async (req, res) => {
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

app.get('/courses', async (req, res) => {
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

app.post('/purchase', userAuth, async (req, res) => {
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

app.get('/purchasedCourse', userAuth, async (req, res) => {
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

app.delete('/purchasedCourse', userAuth, async (req, res) => {
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


app.post('/adminSignup', zodAuth, async (req, res) => {
    //If validated retrive
    const { adminName, email, password } = req.body;
    console.log(adminName + " " + email + " " + password);

    //Store only hashed password in db
    const hashPassword = await bcrypt.hash(password, 5);

    //DB call
    try {
        const admin = await adminModel.create({
            adminName, email, password: hashPassword
        })

        res.json({
            message: "admin : Signup successfull"
        });

    } catch (e) {
        return res.status(403).json({
            message: "admin : Email alread exist login"
        });
    }
})

app.post('/adminLogin', zodAuth, async (req, res) => {
    //If validate retrive
    const { email, password } = req.body;
    console.log(email + " " + password);

    //DB call
    try {
        const admin = await adminModel.findOne({
            email
        })

        //compare b/w the plain password and hashed
        const decodedPassword = await bcrypt.compare(password, admin.password);
        if (!decodedPassword) {
            return res.status(403).json({
                message: "admin : Invalid password"
            });
        }


        //Generate token - should be inside it's own try-catch
        const token = jwt.sign(admin._id.toString(), JWT_SECRET);

        res.json({
            token: `bearer admin ${token}`,
            message: "admin : login successful"
        })

    } catch (e) {
        return res.status(403).json({
            message: "admin : Invalid email"
        })
    }
})

app.post('/course', async (req, res) => {
    const { courseName, instructor, price, detail } = req.body;
    console.log(courseName, detail);

    try {
        const course = await courseModel.create({
            courseName, instructor, price, detail
        })

        res.json({
            message: "course creation successfull",
            course
        })
    } catch (e) {
        return res.status(500).json({
            message: "DB error while creating"
        })
    }
})

app.put('/course', async (req, res) => {
    const { courseId, courseName, instructor, price, detail } = req.body;

    try {
        console.log("inside try block");
        const course = await courseModel.findByIdAndUpdate(courseId, {
            courseName, instructor, price, detail
        }, { new: true })
        console.log("updation finish");

        res.json({
            message: "course updation successfull",
            course
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "DB error while updating"
        })
    }
})

app.delete('/course', async (req, res) => {
    console.log(req.body.courseId);
    try {
        const course = await courseModel.findByIdAndDelete(req.body.courseId);

        console.log("after deletion is completed" + course)

        res.json({
            message: "course delete successful"
        })
    } catch (e) {
        res.status(500).json({
            message: "DB error while deleting"
        })
    }
})

app.listen(3000, () => {
    console.log("server running on port 3000");
})