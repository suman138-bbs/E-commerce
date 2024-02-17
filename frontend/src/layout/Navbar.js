import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as CartIcon } from "../assets/cart.svg";
import { ReactComponent as OrderIcon } from "../assets/order.svg";
import { ReactComponent as DefaultUserIcon } from "../assets/defaultUser.svg";
import { ReactComponent as DashboardIcon } from "../assets/dashboard.svg";
import Auth from "../components/Modals/Auth";
import Modal from "../components/Modals/Modal";
import {
  AuthRoles,
  isAuthenticated,
  requiredRoles,
  signOut,
} from "../api/helper";

const Navbar = () => {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="shadow-md bg-white sticky top-0 z-50">
      <Modal
        showModal={showAuthModal}
        setShowModal={setShowAuthModal}
        closeIcon={false}
      >
        <Auth setShowAuthModal={setShowAuthModal} />
      </Modal>
      <nav className="max-w-7xl mx-auto w-full flex items-center justify-between flex-wrap py-3">
        <div className="flex items-center flex-shrink-0 mr-6">
          <Link to="/" className="flex items-center gap-2">
            {/* <Bewakoof /> */}
            <span className="font-bold text-2xl">AtoZ Store</span>
          </Link>
        </div>
        <div className="block md:hidden">
          <button className="flex items-center px-3 py-2 border rounded text-teal-900 border-teal-900 hover:text-teal-900 hover:border-teal-900">
            <svg
              className="fill-current h-3 w-3"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <title>Menu</title>
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
          </button>
        </div>
        <div className="w-full hidden flex-grow md:flex items-center justify-end gap-5 md:w-auto">
          {isAuthenticated() && (
            <Link
              to="/orders"
              className="mt-4 md:mt-0 mr-4 flex flex-col items-center"
            >
              <OrderIcon />
              <span className="text-xs">Orders</span>
            </Link>
          )}
          <Link
            to="/cart"
            className="mt-4 md:mt-0 mr-4 flex flex-col items-center"
          >
            <CartIcon />
            <span className="text-xs">Cart</span>
          </Link>
          {requiredRoles([AuthRoles.ADMIN, AuthRoles.MODERATOR]) && (
            <Link
              to="/dashboard/orders"
              className="mt-4 md:mt-0 mr-4 flex flex-col items-center"
            >
              <DashboardIcon />
              <span className="text-xs">Dashboard</span>
            </Link>
          )}
          {false ? (
            <Link to="/profile" className="inline-block mt-4 md:mt-0 ml-4">
              <DefaultUserIcon />
            </Link>
          ) : (
            <button
              className="inline-block px-8 py-2 ml-4 bg-gray-800 text-white text-sm font-bold uppercase rounded hover:bg-white hover:text-gray-800 hover:border-gray-800 border-2 border-gray-800"
              onClick={() => {
                isAuthenticated()
                  ? signOut(() => navigate("/"))
                  : setShowAuthModal(true);
              }}
            >
              {isAuthenticated() ? "Sign Out" : "Sign In"}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
