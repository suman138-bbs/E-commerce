import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRequest } from "../api";
import ProductCard from "../components/Cards/ProductCard";
import useLocalStorage from "../hooks/useLocalStorage";
import Container from "../layout/Container";

const CollectionPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [collectionId, setCollectionId] = useState("");
  const [products, setProducts] = useState([]);
  const [cartProducts, setCartProducts] = useLocalStorage("cartProducts", []);

  const addToCart = (product) => {
    let cartProd = cartProducts.find((item) => item._id === product._id);
    if (cartProd) {
      cartProd.quantity += 1;
      let newCartProducts = cartProducts.map((item) =>
        item._id === product._id ? cartProd : item
      );
      setCartProducts(newCartProducts);
      navigate("/cart");
      return;
    }
    navigate("/cart");
    setCartProducts([...cartProducts, { ...product, quantity: 1 }]);
  };

  useEffect(() => {
    if (params?.collectionId) {
      setCollectionId(params?.collectionId);
    }
  }, [params]);

  const getProducts = async () => {
    try {
      const req = await getRequest(`/product/collection/${collectionId}`);
      console.log("req", req);
      setProducts(req.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!collectionId) return;
    getProducts();
  }, [collectionId]);

  return (
    <Container>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-6 lg:max-w-7xl lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">
              Collection
            </h2>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                addToCart={addToCart}
                cartProducts={cartProducts}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default CollectionPage;
