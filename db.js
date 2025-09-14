const mongoose = require('mongoose');
const {Schema} = mongoose;
const {ObjectId} = Schema;

const userSchema = new Schema({
    userName : String,
    email : String, 
    password : String
})

const adminSchema = new Schema({
    adminName : String,
    email : String, 
    password : String
})

const courseSchema = new Schema({
    courseName : String, 
    instructor : String, 
    price : Number, 
    detail : String, 
    review : Number,
    learners : Number
})

const purchaseSchema = new Schema({
    userId : ObjectId, 
    courseId : ObjectId
})

const user = mongoose.model('user', userSchema);
const admin = mongoose.model('user', adminSchema);
const course = mongoose.model('user', courseSchema);
const purchase = mongoose.model('user', purchaseSchema);


module.exports = {
    user, admin, course, purchase
}