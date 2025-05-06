import cloudinary from "../lib/cloudinary.js";
import { redis } from "../lib/redis.js";
import ProductModel from "../models/product.model.js";

export const GetAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({});

    if (!products || products.length === 0) {
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

    if (featuredProducts) {
      // Parse cached JSON string to object
      featuredProducts = JSON.parse(featuredProducts);
      return res.status(200).json({ success: true, featuredProducts });
    }

    // Cache miss: fetch from DB
    featuredProducts = await ProductModel.find({ isFeatured: true }).lean();

    if (!featuredProducts || featuredProducts.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Featured Products" });
    }

    // Cache the result as JSON string
    await redis.set("featured_products", JSON.stringify(featuredProducts));

    return res.status(200).json({ success: true, featuredProducts });
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
      cloudinaryResponse = await cloudinary.uploader.upload(image, {
        folder: "products",
      });
    }

    const product = await ProductModel.create({
      name,
      description,
      price,
      image: cloudinaryResponse?.secure_url || "",
      category,
    });

    res.status(201).json({ success: true, product });
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
      return res
        .status(404)
        .json({ success: false, message: "Product not Found" });
    }

    if (findProduct.image) {
      // Extract publicId from Cloudinary URL
      const urlParts = findProduct.image.split("/");
      const filename = urlParts[urlParts.length - 1]; // e.g. 'abc123.jpg'
      const publicId = filename.split(".")[0]; // 'abc123'

      try {
        await cloudinary.uploader.destroy(`products/${publicId}`);
        console.log("Image deleted from Cloudinary");
      } catch (error) {
        console.log("Error deleting Image from Cloudinary", error);
      }
    }

    const deleteProduct = await ProductModel.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
      deleteProduct,
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

    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const GetProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params
    const products = await ProductModel.find({ category });

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No Products Found in this Category",
        });
    }

   return  res.status(200).json({ products });
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const toggleFeatureProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (product) {
      product.isFeatured = !product.isFeatured;
      const updatedProduct = await product.save();

      // Update cached featured products in Redis
      await updateFeaturedProduct();

      return res.status(200).json({ success: true, updatedProduct });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

async function updateFeaturedProduct() {
  try {
    const featuredProducts = await ProductModel.find({
      isFeatured: true,
    }).lean();
    await redis.set("featured_products", JSON.stringify(featuredProducts));
  } catch (error) {
    console.log("ERROR updating featured products cache:", error);
  }
}
