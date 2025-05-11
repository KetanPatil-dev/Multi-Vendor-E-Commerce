import { create } from "zustand";
import axios from "../lib/axios";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  getCartItems: async () => {
    try {
      const res = await axios.get("/cart");
      set({ cart: res.data });
      get().calcTotal();
    } catch (error) {
      set({ cart: [] });
      console.log(error);
    }
  },
  clearCart: () => {
    get().removeFromCart();
    window.location.reload();
  },
  getMyCoupon: async () => {
    try {
      const res = await axios.get("/coupon");
      
      set({ coupon: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message ?? "An error occured");
    }
  },
  applyCoupon: async (code) => {
    try {
      const res = await axios.post("/coupon/validate", { code });
      console.log(res)
      set({ coupon: res.data });
      set({ isCouponApplied: true });

      get().calcTotal();
      
      toast.success("Coupon applied Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message ?? "Failed to apply Coupon");
    }
  },
  removeCoupon: () => {
    set(
      { coupon: null, isCouponApplied: false },
      get().calcTotal(),
      toast.success("Discount Coupon removed")
    );
  },
  addToCart: async (product) => {
    try {
      await axios.post("/cart", { productId: product._id });
      toast.success("Product Added to Cart");
      set((prevState) => {
        const existingItem = prevState.cart.find(
          (item) => item._id === product._id
        );
        const newCart = existingItem
          ? prevState.cart.find((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prevState.cart, { ...product, quantity: 1 }];
        return { cart: newCart };
      });
      get().calcTotal()
      window.location.reload()
    
    } catch (error) {
      toast.error(error.response.data.message ?? "An error occured");
    }
  },
  removeFromCart: async (productId) => {
    await axios.delete("/cart", { data: { productId } });
    set((prevState) => ({
      cart: prevState.cart.filter((item) => item._id !== productId),
    }));
    get().calcTotal();
    toast.success("Item removed from Cart.");
    window.location.reload()
  },
  calcTotal: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    let total = subtotal;
    if (coupon) {
      const discount = subtotal + coupon.discountPercentage / 100;
      total = subtotal - discount;
    }
    set({ subtotal, total });
  },
  updateQuantity: async (productId, quantity) => {
    if (quantity === 0) {
      get().removeFromCart(productId);
      return;
    }
    await axios.put(`/cart/${productId}`, { quantity });
    set((prevState) => ({
      cart: prevState.cart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      ),
    }));
   get().calcTotal()
   window.location.reload()
  },
}));
