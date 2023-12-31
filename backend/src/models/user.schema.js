import mongoose from "mongoose";
import AuthRoles from "../utils/authRoles.js";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";
import config from "../config/index.js";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: ["true", "Name is required"],
      maxLength: [50, "Name must be less than 50 chars"],
    },
    email: {
      type: String,
      required: ["true", "Email is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "password must be at least 8 chars"],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(AuthRoles),
      default: AuthRoles.USER,
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
  },
  { timestamps: true }
);

// Encrypt the password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods = {
  //compare Password
  comparePassword: async function (enteredPassword) {
    try {
      return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
      console.log("Error in comparing password");
    }
  },
  // generate JWT token
  getJWTtoken: async function () {
    try {
      const token = await JWT.sign(
        { _id: this._id, role: this.role },
        config.JWT_SECRET,
        {
          expiresIn: config.JWT_EXPIRY,
        }
      );

      return token;
    } catch (error) {
      console.log("Error generating token", error);
    }
  },

  //generate forgot password token
  generateForgotPasswordToken: function () {
    const forgotToken = crypto.randomBytes(20).toString("hex");

    //to encrypt the token which is generate by the crypto
    this.forgotPasswordToken = crypto
      .createHash("sha256")
      .update(forgotToken)
      .digest("hex");

    this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

    return forgotToken;
  },
};

export default mongoose.model("User", userSchema);
