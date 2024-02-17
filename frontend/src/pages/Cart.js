import Container from "../layout/Container";
import CartCard from "../components/Cards/CartCard";
import useLocalStorage from "../hooks/useLocalStorage";
import { Link, useNavigate } from "react-router-dom";
import Modal from "../components/Modals/Modal";
import OrderCheckout from "../components/Modals/OrderCheckout";
import { useEffect, useState } from "react";
import { postRequest } from "../api";
import config from "../config";
import { toast } from "react-toastify";
import Auth from "../components/Modals/Auth";
import { isAuthenticated } from "../api/helper";

const Cart = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [cartProducts, setCartProducts] = useLocalStorage("cartProducts", []);
  const [checkoutModal, showCheckoutModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discountData, setDiscountData] = useState({
    discountAmount: 0,
    couponCode: "",
  });
  const [order, setOrder] = useState(null);

  const removeFromCart = (productId) => {
    let newCartProducts = cartProducts.filter((item) => item._id !== productId);
    setCartProducts(newCartProducts);
  };

  const updateQuantity = (productId, action) => {
    let cartProd = cartProducts.find((item) => item._id === productId);
    if (cartProd) {
      if (action === "increase") {
        cartProd.quantity += 1;
      } else {
        cartProd.quantity -= 1;
      }
      let newCartProducts = cartProducts.map((item) =>
        item._id === productId ? cartProd : item
      );
      setCartProducts(newCartProducts);
    }
  };

  const getOrderDetails = async () => {
    if (!isAuthenticated()) {
      setShowAuthModal(true);
      return;
    }
    try {
      const req = await postRequest(`/order/razorpay`, {
        products: cartProducts.map((item) => ({
          productId: item._id,
          count: item.quantity,
        })),
        couponCode,
      });
      if (req.success) {
        setDiscountData(req.discountData);
        setOrder(req.order);
        if (req.discountData.couponCode) {
          toast.success("Coupon applied successfully");
        }
        showCheckoutModal(true);
      }
    } catch (error) {
      toast.error(
        error.response.data.message || "Something went wrong, try again"
      );
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js");
  }, []);

  const placeOrder = async ({ phoneNumber, address }) => {
    if (phoneNumber.length !== 10) {
      toast.error("Invalid phone number");
      return;
    }
    if (!address) {
      toast.error("Address is required");
      return;
    }

    const options = {
      key: config.RAZORPAY_KEY_ID,
      currency: order.currency,
      amount: order.amount,
      name: "HC Store",
      description: "Thank you for shopping with us",
      image: "https://avatars.githubusercontent.com/u/7713209?s=280&v=4",
      order_id: order.id,
      handler: async function (response) {
        if (response.razorpay_payment_id) {
          toast.success("Payment successful");
          try {
            const req = await postRequest(`/order`, {
              products: cartProducts.map((item) => ({
                productId: item._id,
                count: item.quantity,
              })),
              coupon: discountData.couponCode,
              address,
              phoneNumber,
              amount: order.amount / 100,
              transactionId: response.razorpay_payment_id,
            });
            if (req.success) {
              setCartProducts([]);
              showCheckoutModal(false);
              toast.success("Order placed successfully");
              navigate("/orders");
            }
          } catch (error) {
            console.log(error);
            toast.error(
              "If order is not placed, your payment will be refunded within 7 days"
            );
          }
        } else {
          toast.error("Payment failed");
        }
      },
      prefill: {
        name: JSON.parse(localStorage.getItem("user")).name,
        email: JSON.parse(localStorage.getItem("user")).email,
        contact: phoneNumber,
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container>
      <Modal
        showModal={showAuthModal}
        setShowModal={setShowAuthModal}
        closeIcon={false}
      >
        <Auth setShowAuthModal={setShowAuthModal} callBack={getOrderDetails} />
      </Modal>
      <Modal
        showModal={checkoutModal}
        setShowModal={showCheckoutModal}
        closeIcon={false}
        onClose={() => {
          setOrder(null);
          setCouponCode("");
          setDiscountData({ discountAmount: 0, couponCode: "" });
        }}
      >
        <OrderCheckout
          cartProducts={cartProducts}
          order={order}
          discountData={discountData}
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          getOrderDetails={getOrderDetails}
          placeOrder={placeOrder}
        />
      </Modal>
      <div className="min-h-screen h-full">
        <div className="max-w-7xl mx-auto w-full py-2">
          <div className="flex items-center justify-between py-5">
            <h1 className="text-2xl font-bold">Cart</h1>
            <div className="flex items-end justify-center gap-5">
              <button
                className="bg-white border-gray-800 border text-gray-800 text-sm font-bold px-4 py-2 rounded-lg"
                onClick={() => {
                  setCartProducts([]);
                  toast.success("Cart cleared successfully");
                }}
              >
                Remove All Products
              </button>
              <button
                className={`bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg border border-gray-800 ${
                  cartProducts.length === 0 && "opacity-50 cursor-not-allowed"
                }`}
                disabled={cartProducts.length === 0}
                onClick={getOrderDetails}
              >
                Checkout
              </button>
            </div>
          </div>
          <h2 className="text-gray-700 font-bold text-2xl text-right">
            Total Price: ₹{" "}
            {cartProducts.reduce(
              (acc, curr) => acc + curr.price * curr.quantity,
              0
            )}
          </h2>

          <div className="flex flex-col items-center justify-center gap-10 my-10">
            {cartProducts?.map((cartProduct, index) => (
              <CartCard
                key={index}
                cartProduct={cartProduct}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
              />
            ))}
            {cartProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-5">
                <h1 className="text-2xl font-bold text-gray-700">
                  No Products in Cart
                </h1>
                <Link to="/">
                  <button className="bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg border border-gray-800">
                    Shop Now
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Cart;
