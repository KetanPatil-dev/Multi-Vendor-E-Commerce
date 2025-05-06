import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BarChart, PlusCircle, ShoppingCart } from "lucide-react";
import CreateProductsForm from "../components/CreateProductsForm";
import ProductsList from "../components/ProductsList";
import AnalyticsTab from "../components/AnalyticsTab";
import { useProductStore } from "../stores/useProductStore";

const tabs = [
  {
    id: "create",
    label: "Create Product",
    icon: PlusCircle,
  },
  { id: "products", label: "Products", icon: ShoppingCart },
  { id: "analytics", label: "Analytics", icon: BarChart },
];

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("create");
  const {fetchAllProducts}=useProductStore()
  useEffect(()=>{
    fetchAllProducts()
  },[fetchAllProducts])

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-0">
        <motion.h1
          className="text-4xl text-center text-emerald-400 font-bold mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Admin Dashboard
        </motion.h1>

        <motion.div className="flex justify-center flex-wrap mb-8 gap-4" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.2}}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md transition-colors duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              <tab.icon className="mr-2 h-5 w-5" />
              {tab.label}
            </button>
          ))}
        </motion.div>

       <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.2}}>{activeTab === "create" && <CreateProductsForm />}</motion.div> 
        {activeTab === "products" && <ProductsList />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  );
};

export default AdminPage;
