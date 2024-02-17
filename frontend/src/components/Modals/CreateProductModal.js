import React, { useState } from "react";
import { postRequest } from "../../api";
import { toast } from "react-toastify";

const CreateProductModal = ({
  setShowModal,
  onFinish = () => {},
  collections,
}) => {
  const [values, setValues] = useState({
    name: "",
    price: 0,
    description: "",
    photos: [],
    stock: 0,
    collectionId: "",
    formData: new FormData(),
  });

  const { formData } = values;

  const handleChange = (name) => (event) => {
    const value = name === "photos" ? event.target.files : event.target.value;
    //Passing data to backend in a form data.
    console.log(name, value);
    if (name === "photos") {
      Object.keys(value).map((fileInd, ind) => {
        formData.set(`photo${ind + 1}`, value[fileInd]);
      });
    } else {
      formData.set(name, value);
    }
    setValues({ ...values, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const req = await postRequest(`/product`, formData);
      if (req.success) {
        toast.success("Product added successfully !");
        setShowModal(false);
        onFinish();
        return;
      }
      toast.error(req.message);
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  console.log(values);
  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">Create Product</h1>

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
            onChange={handleChange("name")}
            value={values.name}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price
          </label>
          <input
            type="number"
            min={0}
            name="price"
            placeholder="Enter Product Price"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange("price")}
            value={values.price}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            placeholder="Enter Description"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange("description")}
            value={values.description}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="file"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Photos
          </label>
          <input
            type="file"
            name="photos"
            placeholder="Enter Description"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange("photos")}
            multiple="multiple"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="stock"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Stock
          </label>
          <input
            type="number"
            min={0}
            name="stock"
            placeholder="Enter Stock"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange("stock")}
            value={values.stock}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="collectionId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Collection
          </label>
          <select
            name="collectionId"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange("collectionId")}
            value={values.collectionId}
          >
            <option value="">Select Collection</option>
            {collections.map((collection) => (
              <option value={collection._id}>{collection.name}</option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full text-center bg-black p-2 text-white font-semibold rounded-md"
          onClick={onSubmit}
        >
          Add Products
        </button>
      </form>
    </div>
  );
};

export default CreateProductModal;
