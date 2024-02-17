import Product from "../models/product.schema.js";
import Coupon from "../models/coupon.schema.js";
import Order from "../models/order.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import razorpay from "../config/razorpay.config.js";

/**********************************************************
 * @GENEARATE_RAZORPAY_ID
 * @route https://localhost:5000/api/order/razorpay
 * @description Controller used for genrating razorpay Id
 * @description Creates a Razorpay Id which is used for placing order
 * @returns Order Object with "Razorpay order id generated successfully"
 *********************************************************/

export const generateRazorpayOrderId = asyncHandler(async (req, res) => {
  const { products, couponCode } = req.body;

  if (!products || products.length === 0) {
    throw new CustomError("No products found", 400);
  }

  let totalAmount = 0;
  let discountAmount = 0;

  let productPriceCalc = Promise.all(
    products.map(async (product) => {
      const { productId, count } = product;
      const productFromDB = await Product.findById(productId);

      if (!productFromDB) {
        throw new CustomError("Product not found", 404);
      }
      if (productFromDB.stock < count) {
        return res.status(400).json({
          error: "Product quantity is not available",
        });
      }
      totalAmount += productFromDB.price * count;
    })
  );

  await productPriceCalc;

  // Check if coupon code is valid
  if (couponCode) {
    let coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      throw new CustomError("Invalid coupon code", 400);
    }
    if (!coupon?.active) {
      throw new CustomError("Coupon code expired", 400);
    }

    discountAmount = totalAmount * (coupon.discount / 100);
    totalAmount = totalAmount - totalAmount * (coupon.discount / 100);
  }

  const options = {
    amount: Math.round(totalAmount * 100),
    currency: "INR",
    receipt: `receipt_${new Date().getTime()}`,
  };

  const order = await razorpay.orders.create(options);

  if (!order) {
    throw new CustomError("Unable to generate order", 400);
  }

  res.status(200).json({
    success: true,
    message: "Razorpay order id generated successfully",
    discountData: {
      couponCode,
      discountAmount,
    },
    order,
  });
});

/**********************************************************
 * @GENEARATE_ORDER
 * @route https://localhost:5000/api/order
 * @description Controller used for generating order
 * @description Generates order with all the user details including address, phonenumber and transactionId
 * @returns Order Object with "Order created successfully"
 *********************************************************/

export const generateOrder = asyncHandler(async (req, res) => {
  const { products, coupon, address, phoneNumber, amount, transactionId } =
    req.body;
  let orderedProducts = [];

  if (!products || products.length === 0) {
    throw new CustomError("No products found", 400);
  }

  if (!address || !phoneNumber) {
    throw new CustomError("Address and phone number are required", 400);
  }

  if (!amount) {
    throw new CustomError("Amount is required", 400);
  }

  let updateProductStock = Promise.all(
    products.map(async (product) => {
      const { productId, count } = product;
      const productFromDB = await Product.findById(productId);

      orderedProducts.push({
        productId,
        count,
        price: productFromDB.price,
      });

      // Update stock and sold
      productFromDB.stock -= count;
      productFromDB.sold += count;
      await productFromDB.save();
    })
  );

  await updateProductStock;

  const order = await Order.create({
    products: orderedProducts,
    user: req.user._id,
    address,
    phoneNumber,
    amount: amount || 0,
    coupon: coupon || "",
    transactionId: transactionId || "",
  });

  res.status(200).json({
    success: true,
    message: "Order created successfully",
    order,
  });
});

/**********************************************************
 * @GET_ALL_ORDERS [ USER ]
 * @route https://localhost:5000/api/order/personal
 * @description Controller used for getting all user personal orders
 * @description Returns user's order details
 * @returns Order Object with "Order fetched successfully"
 *********************************************************/

export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate("products.productId");

  if (!orders) {
    throw new CustomError("No orders found", 400);
  }

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
  });
});

/**********************************************************
 * @GET_ALL_ORDERS [ ADMIN , MODERATOR]
 * @route https://localhost:5000/api/order
 * @description Controller used for getting all orders
 * @description Returns all order details
 * @description Only Admin and Moderator are able to fetch all order details
 * @returns Order Object with "Order fetched successfully"
 *********************************************************/

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate("products.productId")
    .populate("user", "_id name email");

  if (!orders) {
    throw new CustomError("No orders found", 400);
  }

  res.status(200).json({
    success: true,
    message: "Orders fetched successfully",
    orders,
  });
});

/**********************************************************
 * @UPDATE_ORDER_STATUS [ ADMIN , MODERATOR]
 * @route https://localhost:5000/api/order/:id
 * @description Controller used for updating order status
 * @description Updates order status
 * @description Only Admin and Moderator are able to update order status
 * @returns Order Object with "Order status updated successfully"
 *********************************************************/

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { id: orderId } = req.params;

  const order = await Order.findByIdAndUpdate(
    orderId,
    { status },
    { new: true }
  );

  if (!order) {
    throw new CustomError("No order found", 400);
  }

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});
