import mongoose from "mongoose";

const userObj = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    OTP:{type:String,default:''},
    OTPExpiredAt:{type:Number,default:0},
    Accountverification:{type:Boolean,default:false},
    OTPReset:{type:String,default:''},
    OTPResetAt:{type:Number,default:0}
})
const userModel = mongoose.models.user || mongoose.model('user',userObj);
export default userModel;