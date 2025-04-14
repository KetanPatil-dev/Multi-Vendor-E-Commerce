import { redis } from "../lib/redis.js"
import UserModel from "../models/user.model.js"
import jwt from "jsonwebtoken"

const generateTokens=(userId)=>{
    const accessToken=jwt.sign({userId},process.env.ACCESS_TOKEN,{expiresIn:"15m"})

    const refreshToken= jwt.sign({userId},process.env.REFRESH_TOKEN,{expiresIn:"7d"})
    return {accessToken,refreshToken}
}

const storeRefreshToken=async(userId,refreshToken)=>{
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60 )
}
const setCookies=(res,refreshToken,accessToken)=>{

    res.cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        sameSite:"strict" , //preventd CSRF attacks
        maxAge:15*60*1000
    })
    res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        sameSite:"strict",
        secure:false,
        maxAge:7*24*60*60*1000
    })

}

export const Signup=async(req ,res)=>{
    const {name,email,password}=req.body
    try{
     
        const userExists= await UserModel.findOne({email})

        if(userExists)
        {
            return res.status(400).json({success:false,message:"User Already Exists"})
        }
const newUser= new UserModel({name,email,password})

await newUser.save()
const {password:_,...userData}=newUser.toObject()
const {accessToken,refreshToken}= generateTokens(newUser._id)
await storeRefreshToken(newUser._id,refreshToken)
setCookies(res,refreshToken,accessToken)
res.status(201).json({success:true,message:"User Created Successfully...",userData
    
})
    } catch(error)
    {
        console.log("Signup Error",error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}