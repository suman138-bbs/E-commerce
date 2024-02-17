import Coupon from "../models/coupon.schema.js";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";

/**********************************************************
 * @CREATE_COUPON
 * @route https://localhost:5000/api/coupon
 * @description Controller used for creating a new coupon
 * @description Only admin and Moderator can create the coupon
 * @returns Coupon Object with success message "Coupon Created SuccessFully"
 *********************************************************/

export const createCoupon = asyncHandler(async (req, res) => {
  const { code, discount } = req.body;

  if (!code || !discount) {
    throw new CustomError("Code and discount are required", 400);
  }

  const coupon = await Coupon.create({
    code,
    discount,
  });

  res.status(200).json({
    success: true,
    message: "Coupon created Successfully",
    coupon,
  });
});

/**********************************************************
 * @DEACTIVATE_COUPON
 * @route https://localhost:5000/api/coupon/deactive/:couponId
 * @description Controller used for deactivating the coupon
 * @description Only admin and Moderator can update the coupon
 * @returns Coupon Object with success message "Coupon Deactivated SuccessFully"
 *********************************************************/

export const updateCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  const { action } = req.body;

  let coupon = await Coupon.findByIdAndUpdate(
    couponId,
    {
      active: action,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon Deactivated Successfully",
    coupon,
  });
});

/**********************************************************
 * @DELETE_COUPON
 * @route https://localhost:5000/api/coupon/:couponId
 * @description Controller used for deleting the coupon
 * @description Only admin and Moderator can delete the coupon
 * @returns Success Message "Coupon Deleted SuccessFully"
 *********************************************************/

export const deleteCoupon = asyncHandler(async (req, res) => {
  const { id: couponId } = req.params;
  let coupon = await Coupon.findByIdAndDelete(couponId);

  if (!coupon) {
    throw new CustomError("Coupon not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Coupon Deleted Successfully",
  });
});

/**********************************************************
 * @GET_ALL_COUPONS
 * @route https://localhost:5000/api/coupon
 * @description Controller used for getting all coupons details
 * @description Only admin and Moderator can get all the coupons
 * @returns allCoupons Object
 *********************************************************/

export const getAllCoupons = asyncHandler(async (_req, res) => {
  const allCoupons = await Coupon.find();

  if (!allCoupons) {
    throw new CustomError("No coupons found", 404);
  }

  res.status(200).json({
    success: true,
    allCoupons,
  });
});
