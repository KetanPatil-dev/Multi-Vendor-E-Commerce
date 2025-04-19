import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import ProductModel from "../models/product.model.js";

export const GetAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});

    if (!products) {
      return res
        .status(404)
        .json({ success: false, message: "Products not Found" });
    }
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const GetFeaturedProducts = async (req, res) => {
  try {
    let featuredProducts = await redis.get("featured_products");
    if (!featuredProducts) {
      return res.status(404).json({ message: "No Featured Products" });
    }
    featuredProducts = await ProductModel.find({ isFeatured: true }).lean();
    await redis.set("featured_products", JSON.parse(featuredProducts));
    return res.status(201).json(featuredProducts);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const CreateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category } = req.body;
    let cloudinaryResponse = null;
    if (image) {
      await cloudinary.uploader.upload(image, { folder: "products" });
    }
    const product = await ProductModel.create({
      name,
      description,
      price,
      image,
      image: cloudinaryResponse?.secure_url
        ? cloudinaryResponse.secure_url
        : "",
      category,
    });
    res.status(201).json(product);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const findProduct = await ProductModel.findById(id);
    if (!findProduct) {
      return res.status(404).json({ message: "Product not Found" });
    }
    if (findProduct.image) {
      const publicId = findProduct.image.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.log("Error deleting Image from Cloudinary");
      }
    }
    const deleteProduct = await ProductModel.findByIdAndDelete(id);
    return res
      .status(200)
      .json({
        message: "Product Deleted Successfullt",
        deleteProduct: deleteProduct,
      });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const RecommendProducts = async (req, res) => {
  try {
    const products = await ProductModel.aggregate([
      { $sample: { size: 3 } },
      {
        $project: {
          name: 1,
          description: 1,
          price: 1,
          image: 1,
        },
      },
    ]);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const GetProductsByCategory =async(req,res)=>{
    try {
        const {category}=req.body
        const products= await ProductModel.find({category})
        res.json(products)
    } catch (error) {
        return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
        
    }

}

export const toggleFeatureProduct=async(req ,res)=>{
    try {
        const product= await ProductModel.findById(req.params.id)
        if(product)
        {
            product.isFeatured=!product.isFeatured;
            const updatedProduct= await product.save()
            await updateFeaturedProduct()
         return res.json(updatedProduct)
        }
        else{
            return res.status(404).json({message:"Product not found"})
        }
        
    } catch (error) {
        return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
          
    }
}

async function updateFeaturedProduct() {
    try {
        const featuredProducts=await ProductModel.find({isFeatured:true}).lean()
        await redis.set("featured_product",JSON.stringify(featuredProducts))
    } catch (error) {
        console.log("ERROR",error)
        
    }
}