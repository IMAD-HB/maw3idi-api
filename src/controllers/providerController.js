import User from "../models/User.js";
import AppError from "../utils/AppError.js";

export const getMyProviderProfile = async (req, res, next) => {
  try {
    const provider = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      provider,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProviderProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "specialty", "bio", "phone"];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const provider = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      provider,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviders = async (req, res, next) => {
  try {
    const { specialty } = req.query;

    const filter = {
      role: "provider",
      isApproved: true,
    };

    if (specialty) {
      filter.specialty = specialty;
    }

    const providers = await User.find(filter).select("-password");

    res.status(200).json({
      success: true,
      count: providers.length,
      providers,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderById = async (req, res, next) => {
  try {
    const provider = await User.findOne({
      _id: req.params.id,
      role: "provider",
      isApproved: true,
    }).select("-password");

    if (!provider) {
      throw new AppError("Provider not found", 404);
    }

    res.status(200).json({
      success: true,
      provider,
    });
  } catch (error) {
    next(error);
  }
};
