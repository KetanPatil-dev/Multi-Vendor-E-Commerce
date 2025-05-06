import React from 'react'
import CategoryItem from '../components/CategoryItem'
import { motion } from 'framer-motion'

const categories = [
  { href: "/jeans", name: "Jeans", imageUrl: "/jeans.png" },
  { href: "/t-shirt", name: "T-shirts", imageUrl: "/tshirts.png" },
  { href: "/shoes", name: "Shoes", imageUrl: "/shoes.png" },
  { href: "/glasses", name: "Glasses", imageUrl: "/glasses.png" },
  { href: "/jackets", name: "Jackets", imageUrl: "/jackets.png" },
  { href: "/suits", name: "Suits", imageUrl: "/suits.png" },
  { href: "/bags", name: "Bags", imageUrl: "/bags.png" },
]

const HomePage = () => {
  return (
    <motion.div className="relative min-h-screen text-white overflow-hidden" initial={{opacity:0, y:-20}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.2}}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-center text-5xl sm:text-6xl font-bold text-emerald-500 mb-4" >
          Explore Categories
        </h1>
        <p className="text-center text-xl text-gray-300 mb-12">
          Discover the latest trends in Everything...
        </p>
        {/* Center the grid horizontally */}
        <motion.div className="flex justify-center" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.2}}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
            {categories.map((category, index) => (
              <CategoryItem category={category} key={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default HomePage
