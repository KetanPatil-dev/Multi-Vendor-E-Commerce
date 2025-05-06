import React from "react";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/useUserStore";
import { useProductStore } from "../stores/useProductStore";
import { useCartStore } from "../stores/useCartStore";

const ProductCard = ({ product }) => {
    const {user}=useUserStore()
    
const {addToCart}=useCartStore()
    const handleaddToCart=()=>{
        if(!user)
        {
            toast.error("Login to add product to Cart",{id:"error"})
        }
        else
        addToCart(product)
    
    }
  return (
    <div className="ml-0 w-full max-w-xs mx-auto border rounded-lg shadow-md p-2 bg-transparent hover:shadow-lg transition-shadow duration-300 border-gray-700">
      {/* Image container: full width, fixed height */}
      <div className="w-full h-32 flex items-center justify-center mb-2 bg-white rounded-md overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      <h3 className="text-base font-semibold mb-1">{product.name}</h3>
      <p className="text-gray-600 text-xs mb-1 line-clamp-2">{product.description}</p>
      <p className="text-base font-bold text-emerald-500 mb-2">${product.price}</p>
      <button onClick={handleaddToCart} className="ml-0 bg-emerald-400 hover:bg-emerald-500 text-white py-1 px-2 rounded text-sm flex items-center gap-2 w-50 justify-center">
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
