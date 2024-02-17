import { Link, useLocation, useNavigate } from "react-router-dom";
import { isAdmin, isAuthenticated, signOut } from "../api/helper";

const DashboardContainer = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const getActiveClass = (path) => {
    return location.pathname === path
      ? "text-gray-200 hover:text-gray-200"
      : "text-gray-500 hover:text-gray-200";
  };

  return (
    <div className="flex flex-no-wrap">
      <div className="w-64 sticky inset-0 bg-black h-screen hidden md:block overflow-y-auto scrollbar-hide shadow-lg z-10 rounded-r-2xl">
        <div className="px-8 text-center">
          <Link to="/">
            <span className="font-semibold text-2xl text-white pt-8 block">
              HC TStore
            </span>
          </Link>
          <ul className="mt-8">
            <Link
              to="/dashboard/orders"
              className={`flex w-full justify-between cursor-pointer items-center mb-6 ${getActiveClass(
                "/dashboard/orders"
              )}`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-stack"
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="12 4 4 8 12 12 20 8 12 4" />
                  <polyline points="4 12 12 16 20 12" />
                  <polyline points="4 16 12 20 20 16" />
                </svg>
                <span className="text-sm ml-2">Orders</span>
              </div>
            </Link>
            {isAdmin() && (
              <>
                <Link
                  to="/dashboard/products"
                  className={`flex w-full justify-between cursor-pointer items-center mb-6 ${getActiveClass(
                    "/dashboard/products"
                  )}`}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-puzzle"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <path d="M4 7h3a1 1 0 0 0 1 -1v-1a2 2 0 0 1 4 0v1a1 1 0 0 0 1 1h3a1 1 0 0 1 1 1v3a1 1 0 0 0 1 1h1a2 2 0 0 1 0 4h-1a1 1 0 0 0 -1 1v3a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-1a2 2 0 0 0 -4 0v1a1 1 0 0 1 -1 1h-3a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h1a2 2 0 0 0 0 -4h-1a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1" />
                    </svg>
                    <span className="text-sm ml-2">Products</span>
                  </div>
                </Link>
                <Link
                  to="/dashboard/collections"
                  className={`flex w-full justify-between cursor-pointer items-center mb-6 ${getActiveClass(
                    "/dashboard/collections"
                  )}`}
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-compass"
                      width={18}
                      height={18}
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" />
                      <polyline points="8 16 10 10 16 8 14 14 8 16" />
                      <circle cx={12} cy={12} r={9} />
                    </svg>
                    <span className="text-sm ml-2">Collections</span>
                  </div>
                </Link>
              </>
            )}
            <Link
              to="/dashboard/coupons"
              className={`flex w-full justify-between cursor-pointer items-center mb-6 ${getActiveClass(
                "/dashboard/coupons"
              )}`}
            >
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-code"
                  width={20}
                  height={20}
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <polyline points="7 8 3 12 7 16" />
                  <polyline points="17 8 21 12 17 16" />
                  <line x1={14} y1={4} x2={10} y2={20} />
                </svg>
                <span className="text-sm ml-2">Coupons</span>
              </div>
            </Link>
            {isAuthenticated() && (
              <button
                className="w-full py-1 bg-transparent text-white text-sm font-bold uppercase rounded hover:bg-white hover:text-gray-600 hover:border-white border-2 border-gray-600"
                onClick={() => signOut(() => navigate("/"))}
              >
                Sign Out
              </button>
            )}
          </ul>
        </div>
      </div>
      <div className="min-h-screen max-w-7xl mx-auto w-full h-full px-6 py-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default DashboardContainer;
