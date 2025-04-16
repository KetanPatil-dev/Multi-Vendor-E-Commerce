import ProductModel from "../models/product.model.js"

export const GetAllProducts=async(req ,res)=>{
 try {
    const products= await ProductModel.find({})

    if(!products)
    {
        return res.status(404).json({success:false,message:"Products not Found"})
    }
    return res.status(200).json({success:true,products})
    
 } catch (error) {
    console.log("Error",error)
    return res.status(500).json({success:false,message:"Internal Server Error"})
 }
}