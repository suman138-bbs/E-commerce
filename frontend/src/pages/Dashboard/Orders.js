import { useEffect, useState } from "react";
import { getRequest, putRequest } from "../../api";
import { AuthRoles } from "../../api/helper";
import withAuth from "../../hoc/withAuth";
import DashboardContainer from "../../layout/DashboardContainer";
import Modal from "../../components/Modals/Modal";
import { toast } from "react-toastify";

const OrderStatusTypes = {
  ORDERED: "ORDERED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

const Orders = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderToUpdate, setOrderToUpdate] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  const getOrders = async () => {
    try {
      const req = await getRequest(`/order`);
      setOrders(req.orders);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const updateOrderStatus = async (orderId) => {
    try {
      const req = await putRequest(`/order/${orderId}`, {
        status: orderStatus,
      });

      if (req.success) {
        getOrders();
        setOrderToUpdate(null);
        setOrderStatus("");
        setShowUpdateModal(false);
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message || "Something went wrong");
    }
  };

  return (
    <DashboardContainer>
      <Modal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        onClose={() => {
          setOrderToUpdate(null);
          setOrderStatus("");
        }}
      >
        <div className="flex flex-col items-center justify-center py-5 px-10">
          <h1 className="text-2xl font-bold mb-5">Update Order Status</h1>
          <div className="flex flex-col w-full">
            <label htmlFor="status" className="mb-2">
              Status
            </label>
            <select
              name="status"
              id="status"
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:border-gray-500"
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
            >
              {Object.keys(OrderStatusTypes).map((key) => (
                <option value={OrderStatusTypes[key]}>
                  {OrderStatusTypes[key]}
                </option>
              ))}
            </select>
            <div className="flex justify-between w-full mt-5 gap-5">
              <button
                className="bg-gray-300 text-white w-full py-2 rounded-md  "
                onClick={() => setShowUpdateModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white w-full py-2 rounded-md"
                onClick={() => updateOrderStatus(orderToUpdate._id)}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </Modal>
      <div className="w-full h-full rounded border-dashed border-2 border-gray-300 p-4">
        <h1 className="text-2xl font-semibold mb-10">
          Orders (Total {orders.length})
        </h1>
        <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="bg-gray-800 text-gray-100 text-sm uppercase">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Order ID
                </th>
                <th scope="col" className="py-3 px-6">
                  Transaction ID
                </th>
                <th scope="col" className="py-3 px-6">
                  Order Date
                </th>
                <th scope="col" className="py-3 px-6">
                  Customer Phone
                </th>
                <th scope="col" className="py-3 px-6">
                  Coupon Code
                </th>
                <th scope="col" className="py-3 px-6">
                  Total Price
                </th>
                <th scope="col" className="py-3 px-6">
                  Status
                </th>
                <th scope="col" className="py-3 px-6">
                  Update Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order, index) => (
                <tr
                  className="border-b border-gray-200 hover:bg-gray-100 text-gray-700"
                  key={index}
                >
                  <th
                    scope="row"
                    className="py-4 px-6 font-semibold whitespace-nowrap text-gray-900"
                  >
                    {order._id}
                  </th>
                  <td className="py-4 px-6">{order.transactionId}</td>
                  <td className="py-4 px-6">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">{order.phoneNumber}</td>
                  <td className="py-4 px-6">{order.coupon || "N/A"}</td>
                  <td className="py-4 px-6">₹ {order.amount}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "ORDERED"
                          ? "bg-yellow-200 text-yellow-800"
                          : order.status === "SHIPPED"
                          ? "bg-blue-200 text-blue-800"
                          : order.status === "DELIVERED"
                          ? "bg-green-200 text-green-800"
                          : order.status === "CANCELLED"
                          ? "bg-red-200 text-red-800"
                          : ""
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-1 px-4 rounded inline-flex items-center"
                      onClick={() => {
                        setOrderToUpdate(order);
                        setShowUpdateModal(true);
                      }}
                    >
                      Update
                    </button>
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

export default withAuth(Orders, [AuthRoles.ADMIN, AuthRoles.MODERATOR]);
