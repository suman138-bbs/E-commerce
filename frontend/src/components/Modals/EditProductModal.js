import React, { useEffect, useState } from "react";
import { putRequest } from "../../api";
import { toast } from "react-toastify";

const EditProductModal = ({
  setShowModal,
  editableProduct,
  onFinish = () => {},
  collections,
}) => {
  const [values, setValues] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
    collectionId: "",
    formData: new FormData(),
  });

  const { formData } = values;

  const handleChange = (name) => (event) => {
    const value = event.target.value;
    //Passing data to backend in a form data.
    formData.set(name, value);
    setValues({ ...values, [name]: value });
  };

  useEffect(() => {
    if (!editableProduct) return;
    setValues({
      ...values,
      name: editableProduct?.name,
      price: editableProduct?.price,
      description: editableProduct?.description,
      stock: editableProduct?.stock,
      collectionId: editableProduct?.collectionId,
    });

    Object.keys(values).map((key) => {
      if (key !== "formData") {
        formData.set(key, editableProduct[key]);
      }
    });

    return () => {
      setValues({
        name: "",
        price: "",
        description: "",
        stock: 0,
        collectionId: "",
        formData: new FormData(),
      });
    };
  }, [editableProduct]);

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const req = await putRequest(`/product/${editableProduct._id}`, formData);
      if (req.success) {
        toast.success("Product Updated successfully !");
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

  console.log(values);
  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4 mx-20">Edit Product</h1>

      <form className="w-full">
        <div className="mb-4 w-full">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter Product Name"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange("name")}
            value={values.name}
          />
        </div>
        <div className="mb-4 w-full">
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
        <div className="mb-4 w-full">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <input
            type="text"
            name="description"
            placeholder="Enter Product Description"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            onChange={handleChange("description")}
            value={values.description}
          />
        </div>
        <div className="mb-4 w-full">
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
        <div className="mb-4 w-full">
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
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductModal;
