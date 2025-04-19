  import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"
  export const ProtectRoute=async(req ,res,next)=>{
    try{
        const accessToken=req.cookies.accessToken
        if(!accessToken)
        {
            return res.status(401).json({success:false,message:"Unauthorised"})
        }
        try {
            const decoded= jwt.verify(accessToken,process.env.ACCESS_TOKEN)
        const user=await UserModel.findById(decoded.userId)
        if(!user)
        {
            return res.status(404).json({success:false,message:"User not Found"})
        }
        req.user=user;
        next()
            
        } catch (error) {
            if(error.name=="TokenExpiredError")
            {
                return res.status(401).json({success:false,message:"Unauthorised"})
            }
            throw error
        }

    } catch(error)
    {
        console.log("Error",error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
  }

  export const AdminRoute=async(req ,res,next)=>{
    if(req.user && req.user.role==="admin")
        next()
    else{
        return res.status(401).json({success:false,message:"Access Denied - Admin Only"})
    }
  }