import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';
import userModel from '../models/usermodel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req,res)=>{
    const {name,email,password}=req.body;

    if(!name||!email||!password){
        return res.json({success:false,message :'Missing Details'})
    }
    try { 
        const existingUser = await userModel.findOne({email});
        if(existingUser){
            return res.json({success:false ,message:'User already exists'});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({name,email,password:hashedPassword});
        await user.save();
        
        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        });
        const mailOptions={
            from:process.env.SENDER_EMAIL,
            to:email,
            subject:"Welcome to sample website" ,
            text:` verify your email ID: ${email}`
        }
        await transporter.sendMail(mailOptions);
        return res.json({success:true});

    } catch (error) {
        res.json({success:false,message : error.message})
    }
}
export const login=async(req,res)=>{
    const{email,password}=req.body;
    if(!email||!password){
        return res.json({success:false,message:"Email and Password required"});
    }
    try {
        const user= await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"Invalid Email"});
        }
        const isMatch  = await bcrypt.compare(password,user.password);
        if(!isMatch){
             return res.json({success:false,message:"Incorrect passwrod ! Try again"});
        }
        const token =jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token, {
            httpOnly:true,
            secure:process.env.NODE_ENV==='production',
            sameSite:process.env.NODE_ENV==='production'?'none':'strict',
            maxAge:7*24*60*60*1000
        });
        return res.json({success:true});
    } catch (error) {
        return res.json({success:false,message:error.message})
    }

}

export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({
      success: true,
      message: "Successfully logged out",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const sendVerifyOtp = async (req,res)=>{
    try {
        const {userId}= req.body;
        const user = await userModel.findById(userId);
        if(user.Accountverification){
            return res.json({success:false,message:"Account already verified"})
        }
       const otp= String(Math.floor(100000+Math.random()*900000));
       user.OTP =otp;
       user.OTPExpiredAt = Date.now()+24*60*60*1000;
       await user.save();

       const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject:"Account verification OTP",
        text:`verification OTP for your account Email: ${otp}`
       }
       await transporter.sendMail(mailOptions);
       return res.json({success:true,message:"Verification email sent on email"});
    } catch (error) {
        res.json({success:false , message:error.message});
    }
}
export const verfiyEmail=async(req,res)=>{
    const {userId,otp}= req.body;
    if(!userId||!otp){
        return res.json({success:false,message:"Missing details"});
    }
    try {
        const user =await userModel.findById(userId);
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        if(user.OTP===''||user.OTP!== otp){
            return res.json({success:false,message:"Invalid OTP"});
        }
        if(user.OTPExpiredAt<Date.now()){
             return res.json({success:false,message:"OTP expired"});
        }
        user.Accountverification=true;
        user.OTP='';
        user.OTPExpiredAt=0;
        await user.save();
         return res.json({success:true,message:"Email verified successfull"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}
export const isAuthenticated= async(req,res)=>{
    try {
        return res.json({success:true});
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}
export const sendResetOtp = async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:false,message:"Email required"});
    }
    try {
        const user =await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
       const otp= String(Math.floor(100000+Math.random()*900000));
       user.OTPReset =otp;
       user.OTPResetAt = Date.now()+15*60*1000;
       await user.save();

       const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject:"Password Reset otp",
        text:`OTP for password reset : ${otp}`
       }
       await transporter.sendMail(mailOptions);
        return res.json({success:true,message:"password reset otp sent successfully to user email"});
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}

export const resetPassword = async(req,res)=>{
    const{email,otp,newPassword}=req.body;
    if(!email||!otp||!newPassword){
        return res.json({success:false,message:"missing Details!"});
    }
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        if(user.OTPReset ===""||user.OTPReset!==otp){
            return res.json({success:false,message:"invalid OTP"});
        }
        if(user.OTPResetAt<Date.now()){
            return res.json({success:false,message:"OTP expired"});
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);
        user.password=hashedPassword;
        user.OTPReset='';
        user.OTPResetAt=0;
        await user.save();
        return res.json({success:true,message:'Password changed successfully'})
    } catch (error) {
        return res.json({success:false,message:error.message});
    }
}