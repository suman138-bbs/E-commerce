//signup user
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError.js";
import User from "../models/user.schema.js";

export const cookieOptions = {
  expires: new Data(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
};

/**SignUp */
export const signUp = asyncHandler(async (req, res) => {
  //get data from user
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || password) {
    throw new CustomError("Please Provide required fields", 400);
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

    res.cookie("token", token, cookieOptions);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  }
});

/**Login */
export const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please fill all the details", 400);
  }
  const user = User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (isPasswordMatched) {
    const token = user.getJWTtoken();
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }

  throw new CustomError("Password is incorrect", 400);
});

/**Logout */
export const logOut = asyncHandler(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});
