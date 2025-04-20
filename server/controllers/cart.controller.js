import ProductModel from "../models/product.model.js";

export const AddToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }
    await user.save();
    return res.json(user.cartItems);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const RemoveAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;
    if (!productId) {
      user.cartItems = [];
    } else {
      user.cartItems = user.cartItems.filter((items) => items.id !== productId);
    }
    await user.save();
    return res.json(user.cartItems);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const UpdateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params;
    const user = req.user;
    const { quantity } = req.body;
    const existingItem = user.cartItems.find((items) => items.id === productId);
    if (existingItem) {
      if (quantity === 0) {
        user.cartItems = user.cartItems.filter(
          (items) => items.id !== productId
        );
        await user.save();
        return res.json(user.cartItems);
      }
      existingItem.quantity = quantity;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: "Product not Found" });
    }
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const GetCartProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({
      _id: { $in: req.user.cartItems },
    });
    const cartItems = products.map((products) => {
      const item = req.user.cartItems.find(
        (cartItems) => cartItems.id === products.id
      );
      return { ...products.toJSON(), quantity: item.quantity };
    });
    return res.json(cartItems);
  } catch (error) {
    console.log("Error", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
