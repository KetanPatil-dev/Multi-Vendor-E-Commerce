import CoupounModel from "../models/coupoun.model.js"

export const GetCoupon=async(req ,res)=>{
    try {
        const coupoun= await CoupounModel.findOne({userId:req.user._id,isActive:true})
        res.json(coupoun||null)
        
    } catch (error) {
        console.log("Error in getCoupoun Controller",error)
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
}