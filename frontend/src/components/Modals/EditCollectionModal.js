import React, { useEffect, useState } from "react";
import { putRequest } from "../../api";
import { toast } from "react-toastify";

const EditCollectionModal = ({
  setShowModal,
  editableCollection,
  onFinish = () => {},
}) => {
  const [name, setName] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const req = await putRequest(`/collection/${editableCollection._id}`, {
        name,
      });
      if (req.success) {
        toast.success("Collection updated successfully !");
        onFinish();
        setName("");
        setShowModal(false);
        return;
      }
      toast.error(req.message);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (editableCollection) {
      setName(editableCollection.name);
    }

    return () => {
      setName("");
    };
  }, [editableCollection]);

  return (
    <div className="p-8 flex flex-col justify-center items-center">
      <h1>Edit Collection</h1>

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
            value={name}
          />
        </div>
        <button
          type="submit"
          className="w-full text-center bg-black p-2 text-white font-semibold rounded-md"
          onClick={onSubmit}
        >
          Update Collection
        </button>
      </form>
    </div>
  );
};

export default EditCollectionModal;
