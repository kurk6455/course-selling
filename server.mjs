import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
try{
    await mongoose.connect(process.env.mongodbClusterString);
    console.log("database connection successfull");
}catch(e){
    console.log(e)
}


app.use(cors());
app.use(express.json());


app.post('/userSignup', (req, res) => {
    console.log(req.body);
    const {userName, signupEmail, signupPassword} = req.body;
    console.log(userName);

    res.json({
        message : "Signup successful"
    })
})

app.post('/userLogin', (req, res) => {
    const {loginEmail, loginPassword} = req.body;
    console.log(loginEmail +" "+loginPassword)

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
    const {userName, signupEmail, signupPassword} = req.body;
    console.log(userName);

    res.json({
        message : "Signup successful"
    })
})

app.post('/adminLogin', (req, res) => {
    const {loginEmail, loginPassword} = req.body;
    console.log(loginEmail +" "+loginPassword)

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