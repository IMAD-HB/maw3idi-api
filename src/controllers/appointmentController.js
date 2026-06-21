import Appointment from "../models/Appointment.js";
import Availability from "../models/Availability.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import { isTimeInsideRange } from "../utils/time.js";

export const createAppointment = async (req, res, next) => {
  try {
    if (req.user.role !== "client") {
      throw new AppError("Only clients can book appointments", 403);
    }

    const { provider, date, startTime, endTime } = req.body;

    const providerUser = await User.findById(provider);

    if (!providerUser || providerUser.role !== "provider") {
      throw new AppError("Provider not found", 404);
    }

    if (!providerUser.isApproved) {
      throw new AppError("Provider not approved", 400);
    }

    const appointmentDate = new Date(date);
    appointmentDate.setHours(0, 0, 0, 0);

    const dayOfWeek = appointmentDate.getDay();

    if (appointmentDate < new Date()) {
      throw new AppError("Cannot book in the past", 400);
    }

    const availability = await Availability.find({
      provider,
      dayOfWeek,
    });

    if (!availability.length) {
      throw new AppError("Provider unavailable on this day", 400);
    }

    const existingAppointments = await Appointment.find({
      provider,
      date: appointmentDate,
      status: "scheduled",
    });

    const isOverlapping = existingAppointments.some((appt) => {
      return !(endTime <= appt.startTime || startTime >= appt.endTime);
    });

    if (isOverlapping) {
      throw new AppError("Time slot overlaps with existing booking", 409);
    }

    if (existingAppointment) {
      throw new AppError("Slot already booked", 409);
    }

    const validSlot = availability.some((slot) =>
      isTimeInsideRange(startTime, endTime, slot.startTime, slot.endTime),
    );

    if (!validSlot) {
      throw new AppError(
        "Requested time is outside provider availability",
        400,
      );
    }

    const appointment = await Appointment.create({
      client: req.user._id,
      provider,
      date: appointmentDate,
      startTime,
      endTime,
      status: "scheduled",
    });

    res.status(201).json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAppointments = async (req, res, next) => {
  try {
    let appointments;

    if (req.user.role === "client") {
      appointments = await Appointment.find({
        client: req.user._id,
      })
        .populate("provider", "name specialty")
        .sort({
          date: 1,
        });
    } else if (req.user.role === "provider") {
      appointments = await Appointment.find({
        provider: req.user._id,
      })
        .populate("client", "name email")
        .sort({
          date: 1,
        });
    } else {
      appointments = await Appointment.find()
        .populate("client", "name")
        .populate("provider", "name specialty");
    }

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }

    if (appointment.client.toString() !== req.user._id.toString()) {
      throw new AppError("Not authorized", 403);
    }

    appointment.status = "cancelled";

    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Appointment cancelled",
    });
  } catch (error) {
    next(error);
  }
};
