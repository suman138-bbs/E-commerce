import React from "react";
import { toast } from "react-toastify";

const OrderCheckout = ({
  cartProducts,
  order,
  discountData,
  couponCode,
  setCouponCode,
  getOrderDetails,
  placeOrder,
}) => {
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [address, setAddress] = React.useState("");

  return (
    <div className="p-10 flex flex-col">
      <h1 className="text-3xl font-bold mb-10 text-center mx-20">
        Order Details
      </h1>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold">Coupon Code</h2>
          <div className="relative">
            <input
              type="text"
              name="couponCode"
              placeholder="Coupon Code"
              className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-20"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
            />

            <button
              className="text-teal-500 font-bold text-sm uppercase absolute right-0 top-0 mt-3 mr-4"
              onClick={() => {
                if (couponCode) {
                  getOrderDetails();
                } else {
                  toast.error("Please enter coupon code");
                }
              }}
            >
              Apply
            </button>
          </div>
        </div>
        <h2 className="text-xl font-bold">Order Summary</h2>
        <div className="flex flex-col border border-gray-300 p-2 px-3">
          {cartProducts.map((product) => (
            <div className="flex justify-between" key={product._id}>
              <h3 className="text-lg font-medium whitespace-nowrap overflow-ellipsis overflow-hidden">
                {product.name}
              </h3>
              <h3 className="text-lg font-medium">
                {product.quantity} x{" "}
                <span className="font-bold">{product.price}₹</span>
              </h3>
            </div>
          ))}
          <div className="flex justify-between mt-3 border-t border-gray-300 pt-3">
            <h3 className="text-lg font-medium">Total</h3>
            <h3 className="text-lg font-bold">
              {cartProducts.reduce(
                (acc, curr) => acc + curr.price * curr.quantity,
                0
              )}
            </h3>
          </div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Discount</h3>
            <h3 className="text-lg font-bold">
              - {discountData?.discountAmount}
            </h3>
          </div>
        </div>
        <div className="flex justify-between border border-gray-300 p-3">
          <h3 className="text-lg font-bold">Total Price</h3>
          <h3 className="text-lg font-bold">₹ {order?.amount / 100}</h3>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-10">
        <h2 className="text-xl font-bold">Shipping Details</h2>
        <div className="flex flex-col">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            id="phoneNumber"
            className="shadow appearance-none border rounded w-full px-2 py-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            id="address"
            className="shadow appearance-none border rounded w-full px-2 py-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <button
          className="mt-10 bg-gray-800 text-white text-sm font-bold px-4 py-2 rounded-lg border border-gray-800"
          onClick={() => placeOrder({ phoneNumber, address })}
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default OrderCheckout;
