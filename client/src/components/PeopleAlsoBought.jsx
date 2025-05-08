import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

const PeopleAlsoBought = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get("/products/recommendations");

        setRecommendations(res.data.products);
      } catch (error) {
        toast.error(error.response.data.message ?? "An error occured");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, []);
  if (isLoading) return <LoadingSpinner />;
  return (
    <div className="relative z-50 mt-8">
      <h3 className="ml-2 text-emerald-400 text-2xl font-semibold">
        People also Bought
      </h3>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations?.map((product) => {
          return <ProductCard key={product._id} product={product} />;
        })}
      </div>
    </div>
  );
};

export default PeopleAlsoBought;
