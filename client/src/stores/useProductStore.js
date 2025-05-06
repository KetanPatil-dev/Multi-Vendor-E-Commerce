import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set,get) => ({
  products: [],
  loading: false,
  setProducts: (products) => set({ products }),
  createProducts: async (productData) => {
    set({ loading: true });
    try {
      const res = await axios.post("/products", productData);
      set((prevState) => ({
        products: [...prevState.products, res.data],
        loading: false,
      }));
      toast.success("Product Created Successfully", { position: "top-center" });
      window.location.reload()
    } catch (error) {
      
      toast.error(error.response.data.message ?? "An error occured");
      set({ loading: false });
    }
  },
  fetchProductsByCategory:async(category)=>{
    set({loading:true})
    try {
      const res= await axios.get(`/products/category/${category}`)
      set({products:res.data.products,loading:false})
      
    } catch (error) {
      set({loading:false})
      toast.error(error.response?.data?.message??"An error occured")
      
    }
  },
  fetchAllProducts:async()=>{
    set({loading:true})
    try {
      const res= await axios.get("/products/getallproducts")
      set({products:res.data.products,loading:false})
    } catch (error) {
      set({loading:false})
      toast.error(error.response?.data?.message??"An error occured")
    }
  },
  deleteProduct:async(productId)=>{
    set({loading:true})
    try {
      await axios.delete(`/products/${productId}`)
      set((prevProducts)=>({
        products:prevProducts.products.filter((product)=>product._id!==productId),
        loading:false
      }))
     toast.success("Product Deleted Successfully")
      
    } catch (error) {
      set({loading:false})
      toast.error(error.response?.data?.message ?? "An error occured")
    }
  },
  toggleFeaturedProduct:async(productId)=>{
    set({loading:false})
    try {
      const res= await axios.patch(`/products/${productId}`)
      set((prevProducts)=>({
        products:prevProducts.products.map((product)=>product._id===productId?{...product,isFeatured:res.data.isFeatured}:product),
     loading:false
    
      }))
      window.location.reload()
      toast.success(res.data.message)
    } catch (error) {
      set({ loading: false });
			toast.error(error.response.data.error ?? "Failed to update product");
    }
  }
}));
