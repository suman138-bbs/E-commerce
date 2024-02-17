import { useEffect, useState } from "react";
import Container from "../layout/Container";
import Banner1 from "../assets/banners/banner1.jpg";
import Banner2 from "../assets/banners/banner2.png";
import Banner3 from "../assets/banners/banner3.jpg";
import Banner from "../components/Banner";
import CardCollection from "../components/Cards/CardCollection";
import { getRequest } from "../api";
import useLocalStorage from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Home = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [cartProducts, setCartProducts] = useLocalStorage("cartProducts", []);

  const addToCart = (product) => {
    let cartProd = cartProducts.find((item) => item._id === product._id);
    if (cartProd) {
      cartProd.quantity += 1;
      let newCartProducts = cartProducts.map((item) =>
        item._id === product._id ? cartProd : item
      );
      setCartProducts(newCartProducts);
      toast.success("Product quantity increased");
      navigate("/cart");
      return;
    }
    toast.success("Product added to cart");
    navigate("/cart");
    setCartProducts([...cartProducts, { ...product, quantity: 1 }]);
  };

  const getProducts = async () => {
    try {
      const req = await getRequest(`/product/collection`);
      setCollections(req.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <Container>
      <div className=" min-h-screen h-full">
        {/* Hero Banner */}
        <section aria-label="hero-banner">
          <div className="lg:max-w-7xl mx-auto my-10 bg-red-500">
            <div className="bg-yellow-400 ">
              <img src="/home-banner.webp" alt="hardik_banner" />
            </div>
          </div>
        </section>
        <div className="flex items-start flex-nowrap overflow-x-auto py-6 px-4 gap-5">
          <Banner image={Banner1} />
          <Banner image={Banner2} />
          <Banner image={Banner3} />
          <Banner image={Banner1} />
          <Banner image={Banner2} />
          <Banner image={Banner3} />
          <Banner image={Banner1} />
        </div>
        <div className="max-w-7xl mx-auto w-full h-full py-4 px-6">
          {collections?.map((item, index) => (
            <div key={index}>
              <CardCollection
                addToCart={addToCart}
                collectionName={item.collection.name}
                collectionId={item.collection._id}
                products={item.products}
                cartProducts={cartProducts}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Home;
