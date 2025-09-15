import mongoose from 'mongoose';
const {Schema} = mongoose;
const {ObjectId} = Schema;

const userSchema = new Schema({
    userName : String,
    email : {type : String , unique : true}, 
    password : String
})

const adminSchema = new Schema({
    adminName : String,
    email : {type : String , unique : true}, 
    password : String
})  

const courseSchema = new Schema({
    courseName : String, 
    instructor : String, 
    price : Number, 
    detail : {
        summary : String,
        duration : String,
        practiseTest : Number,
        certificate : Boolean
    }
})

const purchaseSchema = new Schema({
    userId : ObjectId, 
    courseId : ObjectId
})

//By default model name changes to plural
const userModel = mongoose.model('users', userSchema);
const adminModel = mongoose.model('admins', adminSchema);
const courseModel = mongoose.model('courses', courseSchema);
const purchaseModel = mongoose.model('purchases', purchaseSchema);


export {
    userModel, adminModel, courseModel, purchaseModel
};