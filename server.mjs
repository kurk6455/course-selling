import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import { JsonWebTokenError as jwt } from 'jsonwebtoken';
const {JWT_SECRET} = process.env;

const app = express();
try{
    mongoose.connect(process.env.mongodbClusterString);
    console.log("database connection successfull");
}catch(e){
    console.log(e)
}


app.use(cors());
app.use(express.json());


app.post('/userSignup', (req, res) => {
    console.log(req.body);
    const {userName, email, password} = req.body;
    console.log(userName);

    //check if the email exists

    res.json({
        message : "Signup successful"
    })
})

app.post('/userLogin', (req, res) => {
    const {email, password} = req.body;
    console.log(email +" "+password)

    res.json({
        message : "LOgin successful"
    })
})

app.post('/purchase', (req, res) => {
    const {id} = req.body;

    res.json({
        message : `purchase course : ${id}`
    })
})

app.get('/courses', (req, res) => {
    res.json({
        message : "All courses"
    })
})

app.post('/purchasedCourses', (req, res) => {
    res.json({
        message : "At purchased course endpoint"
    })
})


app.post('/adminSignup', (req, res) => {
    console.log(req.body);
    const {userName, email, password} = req.body;
    console.log(userName);

    res.json({
        message : "Signup successful"
    })
})

app.post('/adminLogin', (req, res) => {
    const {email, password} = req.body;
    console.log(email +" "+password)

    res.json({
        message : "LOgin successful"
    })
})

app.post('/course', (req, res) => {
    res.json({
        message : "creating course"
    })
})

app.put('/course', (req, res) => {
    res.json({
        message : "updating course"
    })
})

app.delete('/course', (req, res) => {
    res.json({
        message : "deleting course"
    })
})

app.listen(3000, ()=>{
    console.log("server running on port 3000");
})