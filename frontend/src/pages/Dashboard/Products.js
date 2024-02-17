import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteRequest, getRequest } from "../../api";
import { AuthRoles } from "../../api/helper";
import CreateProductModal from "../../components/Modals/CreateProductModal";
import EditProductModal from "../../components/Modals/EditProductModal";
import Modal from "../../components/Modals/Modal";
import withAuth from "../../hoc/withAuth";
import DashboardContainer from "../../layout/DashboardContainer";

const Products = () => {
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [editableProduct, setEditableProduct] = useState();
  const [collections, setCollections] = useState([]);

  const getProducts = async () => {
    try {
      const req = await getRequest(`/product`);
      setProducts(req.products);
    } catch (error) {
      console.error(error);
    }
  };

  const getCollections = async () => {
    try {
      const req = await getRequest(`/collection`);
      setCollections(req.collections);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProducts();
    getCollections();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const req = await deleteRequest(`/product/${id}`);
      if (req.success) {
        toast.success("Product deleted Successfully");
        getProducts();
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <DashboardContainer>
      <Modal
        showModal={showAddProductModal}
        setShowModal={setShowAddProductModal}
      >
        <CreateProductModal
          setShowModal={setShowAddProductModal}
          onFinish={getProducts}
          collections={collections}
        />
      </Modal>

      <Modal
        showModal={showEditProductModal}
        setShowModal={setShowEditProductModal}
      >
        <EditProductModal
          setShowModal={setShowEditProductModal}
          editableProduct={editableProduct}
          onFinish={getProducts}
          collections={collections}
        />
      </Modal>

      <div className="w-full h-full rounded border-dashed border-2 border-gray-300 p-4">
        <div className="flex justify-between items-center h-full mb-10">
          <h1 className="text-2xl font-semibold">
            Products (Total {products.length})
          </h1>
          <button
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
            onClick={() => setShowAddProductModal(true)}
          >
            <svg
              className="w-6 h-6 inline-block"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span className="ml-2">Add Product</span>
          </button>
        </div>

        <div>
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="bg-gray-800 text-gray-100 text-sm uppercase">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    Product name
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Stock
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Product Id
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Collection
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Price
                  </th>
                  <th scope="col" className="py-3 px-6 text-end">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => (
                  <>
                    <tr className="border-b border-gray-200 hover:bg-gray-100 text-gray-700">
                      <th
                        scope="row"
                        className="py-4 px-6 font-semibold whitespace-nowrap text-gray-900"
                      >
                        {product.name}
                      </th>
                      <td className="py-4 px-6">{product.stock}</td>
                      <td className="py-4 px-6">{product._id}</td>
                      <td className="py-4 px-6">
                        {collections.find(
                          (collection) =>
                            collection._id === product.collectionId
                        )?.name || "N/A"}
                      </td>
                      <td className="py-4 px-6 font-semibold whitespace-nowrap text-gray-900">
                        ₹ {product.price}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end space-x-4">
                          <button
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded inline-flex items-center"
                            onClick={() => {
                              setEditableProduct(product);
                              setShowEditProductModal(true);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="bg-red-200 hover:bg-red-300 text-red-800 font-bold py-1 px-4 rounded inline-flex items-center"
                            onClick={() => deleteHandler(product._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default withAuth(Products, [AuthRoles.ADMIN]);
