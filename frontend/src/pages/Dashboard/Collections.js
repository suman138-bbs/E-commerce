import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteRequest, getRequest } from "../../api";
import CreateCollectionModal from "../../components/Modals/CreateCollectionModal";
import EditCollectionModal from "../../components/Modals/EditCollectionModal";
import Modal from "../../components/Modals/Modal";
import { AuthRoles } from "../../api/helper";
import withAuth from "../../hoc/withAuth";
import DashboardContainer from "../../layout/DashboardContainer";

const Collections = () => {
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const [showEditCollectionModal, setShowEditCollectionModal] = useState(false);
  const [collections, setCollections] = useState([]);
  const [editableCollection, setEditableCollection] = useState();

  const getCollections = async () => {
    try {
      const req = await getRequest(`/collection/`);
      setCollections(req.collections);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCollections();
  }, []);

  const deleteHandler = async (id) => {
    try {
      const req = await deleteRequest(`/collection/${id}`);
      if (req.success) {
        toast.success("Collection deleted Successfully");
        getCollections();
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <DashboardContainer>
      <Modal
        showModal={showAddCollectionModal}
        setShowModal={setShowAddCollectionModal}
      >
        <CreateCollectionModal
          setShowModal={setShowAddCollectionModal}
          onFinish={getCollections}
        />
      </Modal>

      <Modal
        showModal={showEditCollectionModal}
        setShowModal={setShowEditCollectionModal}
      >
        <EditCollectionModal
          setShowModal={setShowEditCollectionModal}
          editableCollection={editableCollection}
          onFinish={getCollections}
        />
      </Modal>

      <div className="w-full h-full rounded border-dashed border-2 border-gray-300 p-4">
        <div className="flex justify-between items-center h-full mb-10">
          <h1 className="text-2xl font-semibold">
            Collections (Total {collections.length})
          </h1>
          <button
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
            onClick={() => setShowAddCollectionModal(true)}
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
            <span className="ml-2">Add collection</span>
          </button>
        </div>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="bg-gray-800 text-gray-100 text-sm uppercase">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Collection name
                </th>
                <th scope="col" className="py-3 px-6">
                  Collection Id
                </th>
                <th scope="col" className="py-3 px-6 text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {collections?.map((collection, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 text-gray-700"
                  key={index}
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-semibold whitespace-nowrap text-gray-900"
                  >
                    {collection.name}
                  </th>
                  <td className="py-4 px-6">{collection._id}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded inline-flex items-center"
                        onClick={() => {
                          setEditableCollection(collection);
                          setShowEditCollectionModal(true);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-200 hover:bg-red-300 text-red-800 font-bold py-1 px-4 rounded inline-flex items-center"
                        onClick={() => deleteHandler(collection._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardContainer>
  );
};

export default withAuth(Collections, [AuthRoles.ADMIN]);
