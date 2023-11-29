//signup user
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import User from "../models/user.schema";

export const cookieOptions = {
  expires: new Data(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

export const signUp = asyncHandler(async (req, res) => {
  //get data from user
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || password) {
    throw new CustomError("Please Provide required fields", 400);
    //   throw new Error("Got an Error")
  }

  //check weather user already exsist
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User already exists", 400);
  } else {
    const user = await User.create({
      name,
      email,
      password,
    });
    const token = user.getJWTtoken();

    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
    });
  }
});
