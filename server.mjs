import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { userModel, adminModel, courseModel, purchaseModel } from './db.mjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
const { JWT_SECRET } = process.env;
import bcrypt, { compareSync } from 'bcrypt';
import {userAuth, adminAuth, zodAuth} from './auth.mjs';

const app = express();
try {
    await mongoose.connect(process.env.mongodbClusterString);
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
    try{
        const user = await userModel.findOne({
            email
        })

        //compare b/w the plain password and hashed
        const decodedPassword = await bcrypt.compare(password, user.password);
        if(!decodedPassword){
            return res.status(403).json({
                message : "User : Invalid password"
            });
        }

        //Generate token - should be inside it's own try-catch
        const token = jwt.sign(user._id.toString(), JWT_SECRET);

        res.json({
            token : `bearer user ${token}`,
            message : "User : login successful"
        })

    }catch(e){
        return res.status(403).json({
            message : "User : Invalid email"
        })
    }
})

app.post('/purchase', (req, res) => {
    const { id } = req.body;

    res.json({
        message: `purchase course : ${id}`
    })
})

app.get('/courses', (req, res) => {
    res.json({
        message: "All courses"
    })
})

app.post('/purchasedCourse', (req, res) => {
    res.json({
        message: "At purchased course endpoint"
    })
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
    try{
        const admin = await adminModel.findOne({
            email
        })

        //compare b/w the plain password and hashed
        const decodedPassword = await bcrypt.compare(password, admin.password);
        if(!decodedPassword){
            return res.status(403).json({
                message : "admin : Invalid password"
            });
        }


        //Generate token - should be inside it's own try-catch
        const token = jwt.sign(admin._id.toString(), JWT_SECRET);

        res.json({
            token : `bearer admin ${token}`,
            message : "admin : login successful"
        })

    }catch(e){
        return res.status(403).json({
            message : "admin : Invalid email"
        })
    }
})

app.post('/course', (req, res) => {
    res.json({
        message: "creating course"
    })
})

app.put('/course', (req, res) => {
    res.json({
        message: "updating course"
    })
})

app.delete('/course', (req, res) => {
    res.json({
        message: "deleting course"
    })
})

app.listen(3000, () => {
    console.log("server running on port 3000");
})