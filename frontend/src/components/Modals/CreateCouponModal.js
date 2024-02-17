import React, { useState } from "react";
import { postRequest } from "../../api";
import { toast } from "react-toastify";

const CreateCouponModal = ({ setShowModal, onFinish = () => {} }) => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const req = await postRequest(`/coupon`, { code, discount });
      if (req.success) {
        toast.success("Coupon added successfully !");
        onFinish();
        setCode("");
        setDiscount("");
        setShowModal(false);
        return;
      }
      toast.error(req.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong!");
      console.error(error);
    }
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <h1>Create Coupon</h1>

      <form>
        <div className="mb-4">
          <label
            htmlFor="code"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Coupon Code
          </label>
          <input
            type="text"
            name="code"
            placeholder="Enter coupon code"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setCode(e.target.value)}
            value={code}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="discount"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Discount
          </label>
          <input
            type="number"
            min={0}
            max={100}
            name="discount"
            placeholder="Enter Discount"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
          />
        </div>
        <button
          type="submit"
          className="w-full text-center bg-black p-2 text-white font-semibold rounded-md"
          onClick={onSubmit}
        >
          Add Coupon
        </button>
      </form>
    </div>
  );
};

export default CreateCouponModal;
