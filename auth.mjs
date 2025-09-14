import jwt from "jsonwebtoken";
import 'dotenv/config'
const {JWT_SECRET} = process.env;

import * as z from 'zod';

function userAuth(req, res, next){
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