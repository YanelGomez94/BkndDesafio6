import mongoose from "mongoose";

const userCollection ='Users'
const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required: true
    },
    last_name:{
        type:String,
        required: true
    },
    email: {
        type:String,
    },
    age: {
        type:Number,
        required: true
    },
    password:{
        type:String,
    }
})
const userModel= mongoose.model(userCollection,userSchema)
export default userModel;