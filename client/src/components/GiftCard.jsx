import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCartStore } from '../stores/useCartStore'

const GiftCard = () => {
    const [userInputCode,setUserInputCode]=useState("")
    const {coupon,applyCoupon,getMyCoupon,removeCoupon}=useCartStore()
    const [isCouponApplied,setCouponApplied]=useState(false)
    console.log(userInputCode)
    useEffect(()=>{
        getMyCoupon()
    },[getMyCoupon])
    const handleApplyCoupon=()=>{
      toast.success("Discount code is already Applied",{id:"Discount"})
        
    }
  useEffect(()=>{
    if(coupon) {setUserInputCode(coupon.code)
        setCouponApplied(true)
    }
  },[coupon])
const handleremoveCoupon=async()=>{
 toast.error("Dicount Removed",{id:"removed"})
    setUserInputCode("")
    
}
	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='space-y-4'>
				<div>
					<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
						Do you have a voucher or gift card?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-emerald-500'
						placeholder='Enter code here'
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value)}
						required
					/>
				</div>

				<motion.button
					type='button'
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApplyCoupon}
				>
					Apply Code
				</motion.button>
			</div>
			{isCouponApplied && coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Applied Coupon</h3>

					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>

					<motion.button
						type='button'
						className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleremoveCoupon}
					>
						Remove Coupon
					</motion.button>
				</div>
			)}

			{coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Your Available Coupon:</h3>
					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - {coupon.discountPercentage}% off
					</p>
				</div>
			)}
		</motion.div>
    )
}

export default GiftCard