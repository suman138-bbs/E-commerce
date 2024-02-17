import { toast } from "react-toastify";
import { ReactComponent as AddIcon } from "../../assets/add.svg";
import { ReactComponent as RemoveIcon } from "../../assets/remove.svg";

const CartCard = ({ cartProduct, removeFromCart, updateQuantity }) => {
  return (
    <div
      className="flex items-center justify-center w-fit bg-white shadow-lg rounded-lg border-r-8 border-r-black"
      key={cartProduct._id}
    >
      <div className="flex w-[320px] bg-white rounded-l-lg overflow-hidden border-r-2 border-r-teal">
        <div
          className="w-1/3 bg-cover"
          style={{
            backgroundImage: `url(${cartProduct.photos[0].secure_url})`,
          }}
        ></div>
        <div className="w-2/3 py-6 px-5">
          <h1 className="text-gray-900 font-bold text-2xl w-full whitespace-nowrap overflow-hidden overflow-ellipsis">
            {cartProduct.name}
          </h1>
          <p className="mt-2 text-gray-600 text-sm">
            {cartProduct.description}
          </p>
          <h1 className="text-gray-700 font-bold text-xl mt-3">
            ₹ {cartProduct.price}
          </h1>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-2 px-5">
        <h2 className="text-gray-700 font-bold text-lg">
          Sub Total: ₹ {cartProduct.price * cartProduct.quantity}
        </h2>
        <div className="flex items-center justify-between gap-5 w-full">
          <button
            className="bg-gray-800 text-white text-sm font-bold px-1 py-1 rounded-lg border border-gray-800"
            onClick={() => {
              if (cartProduct.quantity > 1) {
                updateQuantity(cartProduct._id, "decrease");
              }
            }}
          >
            <RemoveIcon />
          </button>
          <p className="text-gray-800 font-bold text-xl px-1">
            {cartProduct.quantity}
          </p>
          <button
            className="bg-gray-800 text-white text-sm font-bold px-1 py-1 rounded-lg border border-gray-800"
            onClick={() => {
              if (cartProduct.quantity < cartProduct.stock) {
                updateQuantity(cartProduct._id, "increase");
              } else {
                toast.error("Product out of stock");
              }
            }}
          >
            <AddIcon />
          </button>
        </div>
        <button
          className="bg-gray-800 text-white text-sm font-bold w-full py-1 rounded-lg border border-gray-800"
          onClick={() => removeFromCart(cartProduct._id)}
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartCard;
