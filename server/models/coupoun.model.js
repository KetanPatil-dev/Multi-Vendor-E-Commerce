import mongoose from "mongoose";

const coupounSchema= new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true
    },
    discountPercentage:{
        type:Number,
        required:true,
        min:0,
        max:100,
        
    },
    expirationDate:{
        type:Date,
        required:true
    },
    isActive:{
        type:Boolean,
        default:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

const CoupounModel= mongoose.model("Coupon",coupounSchema)
export default CoupounModel