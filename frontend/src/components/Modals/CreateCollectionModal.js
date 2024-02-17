import React, { useState } from "react";
import { postRequest } from "../../api";
import { toast } from "react-toastify";

const CreateCollectionModal = ({ setShowModal, onFinish = () => {} }) => {
  const [name, setName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const req = await postRequest(`/collection`, { name });
      if (req.success) {
        toast.success("Collection added successfully !");
        onFinish();
        setShowModal(false);
        return;
      }
      toast.error(req.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <h1>Create Collection</h1>
      <form>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full text-center bg-black p-2 text-white font-semibold rounded-md"
          onClick={onSubmit}
        >
          Add Collection
        </button>
      </form>
    </div>
  );
};

export default CreateCollectionModal;
