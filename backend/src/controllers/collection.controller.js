import Collection from "../models/collection.schema.js";
import asyncHandler from "../service/asyncHandler.js";
import CustomError from "../utils/CustomError";

export const createCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  if (!name) {
    throw new CustomError("collection name is required", 401);
  }

  // const collection = new Collection({name}).save()

  const collection = await Collection.create({ name });

  res.status(200).json({
    success: true,
    message: "Collection was created successfully",
    collection,
  });
});

export const updateCollection = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const { id: collectionId } = req.params;

  if (!name) {
    throw new CustomError("collection name is required", 401);
  }
  const updatedCollection = await Collection.findByIdAndUpdate(
    collectionId,
    { name },
    { new: true, runValidators: true }
  );

  if (!updateCollection) {
    throw new CustomError("collection not found", 400);
  }
  res.status(200).json({
    success: true,
    message: "Collection updated successfully",
    updateCollection,
  });
});

export const deleteCollection = asyncHandler(async (req, res) => {
  const { id: collectionId } = req.params;

  if (!id) {
    throw new CustomError("collection id is required", 401);
  }
  const deletedCollection = await Collection.findByIdAndDelete(collectionId);

  if (!deletedCollection) {
    throw new CustomError("collection to be deleted not found", 400);
  }
  res.status(200).json({
    success: true,
    message: "Collection deleted successfully",
    updateCollection,
  });
});

export const getAllCollection = asyncHandler(async (req, res) => {
  const collections = await Collection.find();
  if (!collections) {
    req.status(400).json({
      success: false,
      message: "No collection to display",
    });
  }
  res.status(200).json({
    success: true,
    message: "Collection deleted successfully",
    collections,
  });
});
