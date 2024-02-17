import Product from "../models/product.schema.js";
import formidable from "formidable";
import fs from "fs";
import { s3FileUpload, deleteFile } from "../services/imageUpload.js";
import Mongoose from "mongoose";
import asyncHandler from "../services/asyncHandler.js";
import CustomError from "../utils/customError.js";
import config from "../config/index.js";

/**********************************************************
 * @ADD_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for creating a new product
 * @description Only admin can create the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

export const addProduct = asyncHandler(async (req, res) => {
  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        throw new CustomError(err.message || "Something went wrong", 500);
      }

      let productId = new Mongoose.Types.ObjectId().toHexString();
      console.log(fields, files);
      if (
        !fields.name ||
        !fields.price ||
        !fields.description ||
        !fields.collectionId
      ) {
        throw new CustomError("Please fill all the fields", 400);
      }

      let imgArrayResp = Promise.all(
        Object.keys(files).map(async (fileKey, index) => {
          const element = files[fileKey];
          const data = fs.readFileSync(element.filepath);

          const upload = await s3FileUpload({
            bucketName: config.S3_BUCKET_NAME,
            key: `products/${productId}/photo_${index + 1}.png`,
            body: data,
            contentType: element.mimetype,
          });

          //productId = 1234567890
          //1: products/1234567890/photo_1
          //2: products/1234567890/photo_2

          return {
            secure_url: upload.Location,
          };
        })
      );

      let imgArray = await imgArrayResp;

      const product = await Product.create({
        _id: productId,
        photos: imgArray,
        ...fields,
      });

      if (!product) {
        throw new CustomError("Product not created", 400);
      }

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  });
});

/**********************************************************
 * @GET_ALL_PRODUCT
 * @route https://localhost:5000/api/product
 * @description Controller used for getting all products details
 * @description User and admin can get all the prducts
 * @returns Products Object
 *********************************************************/

export const getAllProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({});

  if (!products) {
    throw new CustomError("No products found", 404);
  }

  res.status(200).json({
    success: true,
    products,
  });
});

/**********************************************************
 * @GET_PRODUCT_BY_ID
 * @route https://localhost:5000/api/product
 * @description Controller used for getting single product details
 * @description User and admin can get single product details
 * @returns Product Object
 *********************************************************/

export const getProductById = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("No product found", 404);
  }

  res.status(200).json({
    success: true,
    product,
  });
});

/**********************************************************
 * @GET_GROUPED_PRODUCTS
 * @route https://localhost:5000/api/product/collection
 * @description Controller used for grouping the products collectionwise
 * @description User can get all collectionwise products
 * @returns Products Object
 *********************************************************/

export const groupProductsByCollection = asyncHandler(async (_req, res) => {
  const groupedProducts = await Product.aggregate([
    {
      $group: {
        _id: "$collectionId",
        products: { $push: "$$ROOT" },
      },
    },
    {
      $lookup: {
        from: "collections",
        localField: "_id",
        foreignField: "_id",
        as: "collection",
      },
    },
    {
      $project: {
        _id: 0,
        collection: 1,
        products: 1,
      },
    },
  ]);

  if (!groupedProducts) {
    throw new CustomError("No products found", 404);
  }

  let limitedProducts = groupedProducts.map((group) => {
    return {
      collection: group.collection[0],
      products: group.products.slice(0, 4),
    };
  });

  res.status(200).json({
    success: true,
    data: limitedProducts,
  });
});

/**********************************************************
 * @GET_PRODUCTS_BY_COLLECTION_ID
 * @route https://localhost:5000/api/product/collection/:collectionId
 * @description Controller used for get product details as per collectionId
 * @description User can get product as per collectionId
 * @returns Products Object
 *********************************************************/

export const getProductsByCollectionId = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  const products = await Product.find({ collectionId });

  if (!products) {
    throw new CustomError("No products found", 404);
  }

  res.status(200).json({
    success: true,
    products,
  });
});

/**********************************************************
 * @UPDATE_PRODUCT
 * @route https://localhost:5000/api/product/:productId
 * @description Controller used for updating a product
 * @description Only admin can update the coupon
 * @descriptio Uses AWS S3 Bucket for image upload
 * @returns Product Object
 *********************************************************/

export const updateProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;

  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        throw new CustomError(err.message || "Something went wrong", 500);
      }

      // const imgCount = product.photos.length;

      // if (files.photos.length !== imgCount) {
      //   throw new CustomError(
      //     `Please upload ${imgCount} images for this product`,
      //     400
      //   );
      // }

      if (files.photos) {
        let imgArrayResp = Promise.all(
          files.photos?.map(async (element, index) => {
            const data = fs.readFileSync(element.filepath);

            const upload = await s3FileUpload({
              bucketName: config.S3_BUCKET_NAME,
              key: `products/${productId}/photo_${index + 1}.png`,
              body: data,
              contentType: element.mimetype,
            });

            return {
              secure_url: upload.Location,
            };
          })
        );

        let imgArray = await imgArrayResp;

        if (imgArray && imgArray.length > 0) {
          fields.photos = imgArray;
        }
      }

      const product = await Product.findByIdAndUpdate(
        productId,
        { ...fields },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message || "Something went wrong",
      });
    }
  });
});

/**********************************************************
 * @DELETE_PRODUCT
 * @route https://localhost:5000/api/product/:productId
 * @description Controller used for delete a product
 * @description Only admin can delete the coupon
 * @descriptio Delete all the product images from S3 Bucket as well
 * @returns Success Message "Product has been delted successfully"
 *********************************************************/

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    throw new CustomError("No product found", 404);
  }

  const deletePhotos = Promise.all(
    product.photos.map(async (_elem, index) => {
      await deleteFile({
        bucketName: config.S3_BUCKET_NAME,
        key: `products/${product._id.toString()}/photo_${index + 1}.png`,
      });
    })
  );

  await deletePhotos;

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product has been deleted successfully",
  });
});
