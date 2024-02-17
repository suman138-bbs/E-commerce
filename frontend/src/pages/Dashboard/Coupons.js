import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteRequest, getRequest, putRequest } from "../../api";
import CreateCollectionModal from "../../components/Modals/CreateCollectionModal";
import EditCollectionModal from "../../components/Modals/EditCollectionModal";
import Modal from "../../components/Modals/Modal";
import { AuthRoles } from "../../api/helper";
import withAuth from "../../hoc/withAuth";
import DashboardContainer from "../../layout/DashboardContainer";
import CreateCouponModal from "../../components/Modals/CreateCouponModal";
// import EditCouponModal from "../../components/Modals/EditCouponModal";

const Coupons = () => {
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [showEditCouponModal, setShowEditCouponModal] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [editableCoupon, setEditableCoupon] = useState();

  const getCoupons = async () => {
    try {
      const req = await getRequest(`/coupon/`);
      setCoupons(req.allCoupons);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCoupons();
  }, []);

  const updateCouponHandler = async (id, action) => {
    try {
      const req = await putRequest(`coupon/action/${id}`, {
        action,
      });
      if (req.success) {
        toast.success("Coupon Updated Successfully");
        getCoupons();
      }
    } catch (error) {
      throw new error();
    }
  };

  return (
    <DashboardContainer>
      <Modal
        showModal={showAddCouponModal}
        setShowModal={setShowAddCouponModal}
      >
        <CreateCouponModal
          setShowModal={setShowAddCouponModal}
          onFinish={getCoupons}
        />
      </Modal>

      <div className="w-full h-full rounded border-dashed border-2 border-gray-300 p-4">
        <div className="flex justify-between items-center h-full mb-10">
          <h1 className="text-2xl font-semibold">
            Coupons (Total: {coupons.length})
          </h1>
          <button
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline inline-flex items-center"
            onClick={() => setShowAddCouponModal(true)}
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
            <span className="ml-2">Add Coupon</span>
          </button>
        </div>

        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="bg-gray-800 text-gray-100 text-sm uppercase">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Coupon name
                </th>
                <th scope="col" className="py-3 px-6">
                  Coupon Id
                </th>
                <th scope="col" className="py-3 px-6">
                  Discount
                </th>
                <th scope="col" className="py-3 px-6">
                  Coupon Status
                </th>
                <th scope="col" className="py-3 px-6 text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons?.map((coupon, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 text-gray-700"
                  key={index}
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-semibold whitespace-nowrap text-gray-900"
                  >
                    {coupon.code}
                  </th>
                  <td className="py-4 px-6">{coupon._id}</td>
                  <td className="py-4 px-6">{coupon.discount} %</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        coupon.active
                          ? "bg-green-400 text-white"
                          : "bg-red-400 text-white"
                      }`}
                    >
                      {coupon.active ? "Active" : "Not Active"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-4">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded inline-flex items-center"
                        onClick={() => {
                          updateCouponHandler(coupon._id, !coupon.active);
                        }}
                      >
                        {coupon.active ? "Deactivate" : "Activate"}
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

export default withAuth(Coupons, [AuthRoles.ADMIN, AuthRoles.MODERATOR]);
