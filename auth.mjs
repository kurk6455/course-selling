import { JsonWebTokenError as jwt} from "jsonwebtoken";
import 'dotenv/config'
const {JWT_SECRET} = process.env;

function userAuth(req, res, next){
    const {email, password} = req.body;
    
    const response = jwt.verify()
}

function adminAuth(req, res, next){
    const {email, password} = req.body;
    
    const response = jwt.verify()
}

module.exports = {
    userAuth, adminAuth
}