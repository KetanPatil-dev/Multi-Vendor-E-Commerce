import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        min:0,
        required:true
    },
    image:{
        type:String,
        requuired:[true,"Image is Mandatory"]
    },
    category:{
        type:String,
        required:true
    },
    isFeatured:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

const ProductModel= mongoose.model("Product",productSchema)
export default ProductModel