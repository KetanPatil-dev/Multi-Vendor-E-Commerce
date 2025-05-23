import React from "react";
import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import {loadStripe} from "@stripe/stripe-js"
import axios from "../lib/axios";


const stripePromise=loadStripe("pk_test_51RFWj3BOK4QGF21Eg1NWKeuIaOZXa23mJaSW9njKSAolX6XsTBxTfrkiRQ6eQGcHfklshRAs5nGyd6t3cLjDnlTl002IhBYmQd")
const OrderSummary = () => {
  
  const {  coupon, isCouponApplied ,cart} = useCartStore();
  let {total}=useCartStore()
  const savings = (total*10/100);
  //const formatedSubtotal = subtotal.toFixed(2);
  const formatedTotal = total.toFixed(2); // Fixed: should use total, not subtotal
  const formatedSavings = savings.toFixed(2);
console.log(savings,total)
  const handlePayment=async ()=>{
try {
    const stripe= await stripePromise
    const res= await axios.post("/payment/create-checkout-session",{products:cart,coupon:coupon?coupon.code:null})
    const session=res.data
    const result= await stripe.redirectToCheckout({
        sessionId:session.id
    })
    if(result.error)
    {
        console.log(result.error)
    }
} catch (error) {
    console.log(error)
}
  }

  return (
    <motion.div
      className="space-y-4 rounded-lg border border-gray-600 bg-gray-800 p-4 shadow-sm sm:p-6 mr-3 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <p className="font-semibold text-xl text-emerald-500 ">Order Summary</p>
      <div className="space-y-2">
        <dl className="flex items-center justify-between gap-4">
          <dt className="text-base font-normal text-gray-300">
            Original price
          </dt>
          <dd className="text-base font-medium text-white">
            ${formatedTotal}
          </dd>
        </dl>
        {savings > 0 && (
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">Savings</dt>
            <dd className="text-base font-medium text-emerald-400">
              -${formatedSavings}
            </dd>
          </dl>
        )}
        {coupon && isCouponApplied && (
          <dl className="flex items-center justify-between gap-4">
            <dt className="text-base font-normal text-gray-300">
              Coupon ({coupon.code})
            </dt>
            <dd className="text-base font-medium text-emerald-400">
              -{coupon.discountPercentage}%
            </dd>
          </dl>
        )}
        <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
          <dt className="text-base font-bold text-white">Total</dt>
          <dd className="text-base font-bold text-emerald-400">
            ${formatedTotal-formatedSavings}
          </dd>
        </dl>
      </div>
      <motion.button
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
                    onClick={handlePayment}
					
				>
					Proceed to Checkout
				</motion.button>
                <div className='flex items-center justify-center gap-2'>
					<span className='text-sm font-normal text-gray-400'>or</span>
					<Link
						to='/'
						className='inline-flex items-center gap-2 text-sm font-medium text-emerald-400 underline hover:text-emerald-300 hover:no-underline'
					>
						Continue Shopping
						<MoveRight size={16} />
					</Link>
				</div>
    </motion.div>
  );
};

export default OrderSummary;
