import Availability from "../models/Availability.js";
import AppError from "../utils/AppError.js";

export const createAvailability = async (req, res, next) => {
  try {
    if (req.user.role !== "provider") {
      throw new AppError("Only providers can set availability", 403);
    }

    if (req.body.startTime >= req.body.endTime) {
      throw new AppError("End time must be after start time", 400);
    }

    const existing = await Availability.findOne({
      provider: req.user._id,
      dayOfWeek: req.body.dayOfWeek,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
    });

    if (existing) {
      throw new AppError("Availability already exists", 409);
    }

    const availability = await Availability.create({
      provider: req.user._id,
      ...req.body,
    });

    res.status(201).json({
      success: true,
      availability,
    });
  } catch (error) {
    next(error);
  }
};

export const getProviderAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.find({
      provider: req.params.providerId,
    });

    res.status(200).json({
      success: true,
      availability,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAvailability = async (req, res, next) => {
  try {
    const availability = await Availability.findById(req.params.id);

    if (!availability) {
      throw new AppError("Availability not found", 404);
    }

    if (availability.provider.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    await availability.deleteOne();

    res.status(200).json({
      success: true,
      message: "Availability removed",
    });
  } catch (error) {
    next(error);
  }
};
