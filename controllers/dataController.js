const { title } = require("process");
const Data = require("../models/dataModel");

// savedata
const { encryptValue, decryptValue } = require("../utils/crypto");
exports.saveData = async (req, res) => {
  try {
    const { title, value } = req.body;
    const userId = req.user._id; // match schema field name

    const encryptedValue = encryptValue(value);

    const data = await Data.create({
      userId,
      title,
      encryptedValue,
    });

    res.status(201).json({
      status: "success",
      data,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// getdata
exports.getData = async (req, res) => {
  try {
    const userId = req.user._id;

    const encryptedData = await Data.find({ userId });

    const decryptedData = encryptedData.map((item) => ({
      _id: item._id,
      title: item.title,
      value: decryptValue(item.encryptedValue),
      createdAt: item.createdAt,
    }));
    res.status(200).json({
      status: "success",
      data: decryptedData,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

// delete item
exports.deleteItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;

    const item = await Data.findOne({ _id: itemId, userId });

    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Item not found or does not belong to you",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      status: "success",
      message: `Item "${item.title}" has been deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

exports.deleteMultipleItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemIds } = req.body;

    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide an array of item IDs to delete",
      });
    }

    const result = await Data.deleteMany({ _id: { $in: itemIds }, userId });

    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} item(s) have been deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

// edit data

exports.editItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const itemId = req.params.id;
    const { title, value } = req.body;
    if (!title || !value) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide both title and value",
      });
    }

    const encryptedValue = encryptValue(value);

    const item = await Data.findOne({ _id: itemId, userId });
    if (!item) {
      return res.status(404).json({
        status: "fail",
        message: "Item not found or does not belong to you",
      });
    }

    item.title = title;
    item.encryptedValue = encryptedValue;
    await item.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: `Item "${item.title}" has been updated successfully`,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

// search item

exports.getVaultItems = async (req, res) => {
  try {
    const userId = req.user._id;
    const { search, page = 1, limit = 50, sort = "-createdAt" } = req.query;

    const query = { userId };
    if (search) {
      query.title = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Find items with pagination and sorting
    const items = await Data.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Decrypt values before sending
    const results = items.map((item) => ({
      _id: item._id,
      title: item.title,
      value: decryptValue(item.encryptedValue),
      createdAt: item.createdAt,
    }));

    // Optional: total count for pagination info
    const total = await Data.countDocuments(query);

    res.status(200).json({
      status: "success",
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      results,
    });
  } catch (err) {
    console.error("getVaultItems error:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};
