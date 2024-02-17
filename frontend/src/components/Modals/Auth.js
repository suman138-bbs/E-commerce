import { useState } from "react";
import { postRequest } from "../../api";
import Modal from "./Modal";
import useLocalStorage from "../../hooks/useLocalStorage";
import { toast } from "react-toastify";

const Auth = ({ setShowAuthModal, callBack = () => {} }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [token, setToken] = useLocalStorage("token", null);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [authData, setAuthData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setAuthData({ ...authData, [e.target.name]: e.target.value });
  };

  const toggleLogin = (toggleVal) => {
    if (toggleVal === showLogin) return;
    setShowLogin(toggleVal);
    setAuthData({ name: "", email: "", password: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (showLogin) {
      try {
        const req = await postRequest(`/auth/login`, authData);

        if (req.token) {
          setToken(req.token);
          setUser(req.user);
          setShowAuthModal(false);
          toast.success("Login successful");
          setAuthData({ name: "", email: "", password: "" });
          callBack();
        } else {
          toast.error("Invalid credentials");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message || "Something went wrong");
      }
    } else {
      try {
        const req = await postRequest(`/auth/signup`, authData);
        if (req.token) {
          setToken(req.token);
          setUser(req.user);
          setShowAuthModal(false);
          toast.success("Signup successful");
          setAuthData({ name: "", email: "", password: "" });
          callBack();
        } else {
          toast.error("Invalid credentials");
        }
      } catch (error) {
        console.error(error);
        toast.error(error.response.data.message || "Something went wrong");
      }
    }
  };

  const sendPasswordReset = (e) => {
    e.preventDefault();
    console.log(forgotEmail);
  };

  return (
    <div>
      <Modal
        showModal={forgotPassword}
        setShowModal={setForgotPassword}
        onClose={() => setForgotEmail("")}
      >
        <div className="p-10 flex flex-col">
          <h1 className="text-3xl font-bold mb-10 text-center">
            Forgot Password
          </h1>
          <p className="text-left mb-4">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>
          <label
            htmlFor="forgotEmail"
            className="block text-gray-700 text-sm font-bold mb-2 self-start"
          >
            Email
          </label>
          <input
            type="text"
            name="forgotEmail"
            placeholder="Email"
            className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <button
            className="bg-black hover:bg-gray-800 text-white font-bold px-6 py-3 mt-4 rounded focus:outline-none focus:shadow-outline self-end"
            type="button"
            onClick={sendPasswordReset}
          >
            Send Reset Link
          </button>
        </div>
      </Modal>
      <ul className="grid grid-cols-2 shadow-md">
        <li
          className={`col-span-1 text-white bg-black text-center py-5 px-20 cursor-pointer border-b-8 ${
            !showLogin ? "border-white" : "border-transparent"
          } animate-all duration-300 ease-in-out`}
          onClick={() => toggleLogin(false)}
        >
          SIGN UP
        </li>
        <li
          className={`col-span-1 text-white bg-black text-center py-5 px-20 cursor-pointer border-b-8 ${
            showLogin ? "border-white" : "border-transparent"
          } animate-all duration-300 ease-in-out`}
          onClick={() => toggleLogin(true)}
        >
          SIGN IN
        </li>
      </ul>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4 text-center">
          {showLogin ? "Sign In" : "Sign Up"}
        </h1>
        <form>
          {!showLogin && (
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
                value={authData.name}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-800 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your email"
              value={authData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-800 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter your password"
              value={authData.password}
              onChange={handleChange}
            />
          </div>
          {showLogin && (
            <h1
              className="font-bold text-sm text-teal-900 hover:text-teal-800 text-right cursor-pointer"
              onClick={() => setForgotPassword(true)}
            >
              Forgot Password?
            </h1>
          )}
          <button
            className="bg-black hover:bg-gray-800 text-white font-bold py-3 mt-8 w-full rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            {showLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
