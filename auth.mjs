import jwt from "jsonwebtoken";
import 'dotenv/config'
const {JWT_SECRET} = process.env;

import * as z from 'zod';

function userAuth(req, res, next){
    const token = req.headers.token;

    //Find out the decoded token - user._Id
    try{
        console.log("inside try block");
        //DOUBT - even if the string contains extra words
        // i.e. bearer user adfasd, then also it's able to verify
        //Solved it directly access the token ignoring extra strings
        const decodedToken = jwt.verify(token, JWT_SECRET);

        req.headers.userId = decodedToken;
        next();
    }catch(e){
        return res.status(403).json({
            message : "Invalid credentials"
        });
    }
}

function adminAuth(req, res, next){

}

function zodAuth(req, res, next){
//Validate format of usrname, email, password through zod
    const validationSchema = z.object({
        userName: z.string().optional(),
        adminName: z.string().optional(),
        email: z.email(),
        password: z.string()
    })
    try {
        validationSchema.parse(req.body);
        next();
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(403).json({
                message : "zod validation error",
                errors : err.issues
            });
        }
    }
}


export {
    userAuth, adminAuth, zodAuth
}