import UserModel from "../models/user.model.js"

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
res.status(201).json({success:true,message:"User Created Successfully...",user:newUser})
    } catch(error)
    {
        console.log("Signup Error",error)
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
}