import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function CardCollection({
  addToCart,
  collectionName,
  collectionId,
  products,
  cartProducts,
}) {
  return (
    <div className="bg-white py-4 border-b-2 ">
      <div className="mx-auto max-w-2xl px:4 py-6 lg:max-w-7xl lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {collectionName}
          </h2>
          <Link to={`/collection/${collectionId}`}>
            <button className="inline-block px-8 py-2 ml-4 bg-gray-800 text-white text-sm font-bold uppercase rounded hover:bg-white hover:text-gray-800 hover:border-gray-800 border-2 border-gray-800">
              See All
            </button>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
          {products?.map((product, index) => (
            <ProductCard
              key={index}
              product={product}
              addToCart={addToCart}
              cartProducts={cartProducts}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
