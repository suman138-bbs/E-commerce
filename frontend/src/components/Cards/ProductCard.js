import { toast } from "react-toastify";

const ProductCard = ({ product, addToCart, cartProducts }) => {
  return (
    <div
      key={product._id}
      className="group border-2 border-gray-100 rounded-lg"
    >
      <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <img
          src={product.photos[0].secure_url}
          alt="product"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      <div className="mt-4 flex justify-between p-2">
        <div>
          <h3 className="text-sm text-gray-700 font-bold">{product.name}</h3>
        </div>
        <p className="text-sm text-gray-900 font-semibold">₹ {product.price}</p>
      </div>
      <div className="p-2">
        <button
          className={`w-full text-white p-2 mt-2 font-semibold rounded-md cursor-pointer ${
            cartProducts?.find((cartProduct) => cartProduct._id === product._id)
              ? "bg-white border-2 border-gray-800 text-gray-800"
              : "bg-black"
          }`}
          onClick={() => {
            if (product.stock > 0) {
              addToCart(product);
            } else {
              toast.error("Product out of stock");
            }
          }}
        >
          {cartProducts?.find((cartProduct) => cartProduct._id === product._id)
            ? "Add More"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
