import React, { useEffect, useState } from "react";
import { getRequest } from "../api";
import { AuthRoles } from "../api/helper";
import withAuth from "../hoc/withAuth";
import Container from "../layout/Container";

const OrderPage = () => {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMyorders = async () => {
    setLoading(true);
    try {
      const req = await getRequest(`/order/personal`);
      if (req.success) {
        console.log(req.orders);
        setMyOrders(req.orders);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMyorders();
  }, []);

  return (
    <Container>
      <div className="min-h-screen h-full">
        <div className="max-w-7xl mx-auto w-full py-2">
          <h1 className="text-2xl font-semibold my-2 mb-10">Your Orders</h1>

          {!loading &&
            (myOrders.length > 0 ? (
              <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="bg-gray-800 text-gray-100 text-sm uppercase">
                    <tr>
                      <th scope="col" className="py-3 px-6">
                        Order Id
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Order Date
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Total Price
                      </th>
                      <th scope="col" className="py-3 px-6">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-200 hover:bg-gray-100 text-gray-700"
                      >
                        <td className="py-3 px-6">{order._id}</td>
                        <td className="py-3 px-6">
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                        <td className="py-3 px-6 font-semibold text-gray-900">
                          ₹ {order.amount}
                        </td>
                        <td className="py-3 px-6">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <h1 className="text-xl font-semibold">No orders yet</h1>
              </div>
            ))}
          {loading && (
            <div className="flex items-center justify-center">
              <h1 className="text-xl font-semibold">Loading...</h1>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
};

export default withAuth(OrderPage, [
  AuthRoles.USER,
  AuthRoles.MODERATOR,
  AuthRoles.ADMIN,
]);
