import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import AppError from "../utils/AppError.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    const users = await User.countDocuments();

    const providers = await User.countDocuments({
      role: "provider",
    });

    const appointments = await Appointment.countDocuments();

    res.status(200).json({
      success: true,

      stats: {
        users,
        providers,
        appointments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProviders = async (req, res, next) => {
  try {
    const providers = await User.find({
      role: "provider",
    }).select("-password");

    res.status(200).json({
      success: true,
      providers,
    });
  } catch (error) {
    next(error);
  }
};

export const approveProvider = async (req, res, next) => {
  try {
    const provider = await User.findById(req.params.id);

    if (!provider) {
      throw new AppError("Provider not found", 404);
    }

    if (provider.role !== "provider") {
      throw new AppError("User is not a provider", 400);
    }

    provider.isApproved = true;

    await provider.save();

    res.status(200).json({
      success: true,
      message: "Provider approved",
    });
  } catch (error) {
    next(error);
  }
};
