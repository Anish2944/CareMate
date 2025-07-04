
import { asyncHandler } from "../utils/asyncHandler.js";
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const createDoctor = asyncHandler(async (req, res) => {
    const { specialization, fees, qualification, experience, about, languages } = req.body;

    // Validate required fields
    if (!specialization || !qualification || !experience || !about || !languages) {
        throw new ApiError(400, "All fields are required, including 'about' and at least one language");
    }

    const profileImageLocalPath = req.file?.path;
    const profileImage = profileImageLocalPath ? await uploadOnCloudinary(profileImageLocalPath) : null;

    const doctor = await Doctor.create({
        user_id: req?.user._id,
        profileImage: profileImage?.url || "",
        specialization,
        fees,
        qualification,
        experience,
        about,
        languages
    });

    const createdDoctor = await Doctor.findById(doctor._id).populate({
        path: "user_id",
        select: "-password -refreshToken"
    });

    if (!createdDoctor) {
        throw new ApiError(500, "Something went wrong while creating doctor");
    }

    return res.status(201).json(new ApiResponse(201, createdDoctor, "Doctor created successfully"));
});

const getDoctorById = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    if (!doctorId) {
        throw new ApiError(400, "Doctor not found")
    }
    const doctor = await Doctor.findById(doctorId).populate({
        path: 'user_id',
        select: '-password -refreshToken'
    });
    if (!doctor) {
        throw new ApiError(404, "Doctor profile not found");
    }

    return res.status(200).json(new ApiResponse(200, doctor, "Doctor profile fetched successfully"));
});

const updateDoctorProfile = asyncHandler(async (req, res) => {
    const { specialization, fees, qualification, experience, about, languages } = req.body;

    // Optional: throw if any required field is missing
    if (!specialization || !qualification || !experience || !about || !languages) {
        throw new ApiError(400, "All fields are required to update the profile");
    }

    const doctor = await Doctor.findOneAndUpdate(
        { user_id: req?.user._id },
        {
            specialization,
            fees,
            qualification,
            experience,
            about,
            languages
        },
        {
            new: true, // returns the updated doc
            runValidators: true // make sure it respects schema rules
        }
    ).populate({
        path: 'user_id',
        select: '-password -refreshToken'
    });

    if (!doctor) {
        throw new ApiError(404, "Doctor profile not found");
    }

    return res.status(200).json(new ApiResponse(200, doctor, "Doctor profile updated successfully"));
});

const toggleDoctorStatus = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { status } = req.body;
    if (!doctorId) {
        throw new ApiError(400, "Doctor not found")
    }
    if (!status || !['active', 'inactive'].includes(status)) {
        throw new ApiError(400, "Invalid status value. Use 'active' or 'inactive'.");
    }
    const doctor = await Doctor.findByIdAndUpdate(
        doctorId,
        { status },
        { new: true }
    ).populate({
        path: 'user_id',
        select: '-password -refreshToken'
    });

    if (!doctor) {
        throw new ApiError(404, "Doctor profile not found");
    }
    return res.status(200).json(new ApiResponse(200, doctor, "Doctor status updated successfully"));
});

const updateAvailableTimeSlots = asyncHandler(async (req, res) => {
    const { available_time_slots } = req.body;
    
    // Validate the structure of available_time_slots
    if (
        !Array.isArray(available_time_slots) || 
        available_time_slots.some(slot => 
            typeof slot.day !== 'string' || 
            !Array.isArray(slot.times) || 
            slot.times.some(time => 
                typeof time.time !== 'string' || 
                (time.status && !["available", "booked"].includes(time.status))
            )
        )
    ) {
        throw new ApiError(400, "Each entry must include a valid 'day' and an array of times with 'time' and 'status' fields");
    }

    const { doctorId } = req.params;
    if (!doctorId) {
        throw new ApiError(400, "Doctor ID is required");
    }

    // Update the doctor's available time slots
    const doctor = await Doctor.findOneAndUpdate(
        { _id: doctorId },
        { $set: { available_time_slots } }, // Explicitly use `$set` to avoid accidental overwrites
        { new: true, runValidators: true } // Enforce schema validation during update
    ).populate({
        path: 'user_id',
        select: '-password -refreshToken'
    });

    if (!doctor) {
        throw new ApiError(404, "Doctor profile not found");
    }

    return res.status(200).json(new ApiResponse(200, doctor, "Available time slots updated successfully"));
});


const updateProfileImage = asyncHandler(async (req, res) => {
    console.log(req.file);
    const ImageLocalpath = req.file?.path;
    if (!ImageLocalpath) {
        throw new ApiError(400, "Image file is missing");
    }

    const doctorProfile = await Doctor.findOne({ user_id: req.user?._id });
    if (!doctorProfile) {
        throw new ApiError(404, "Doctor profile not found");
    }

    // Delete existing profile image if available
    if (doctorProfile.profileImage) {
        try {
            await deleteFromCloudinary(doctorProfile.profileImage);
        } catch (error) {
            console.error("Error deleting existing profile image:", error);
        }
    }

    // Upload new image
    const uploadedImage = await uploadOnCloudinary(ImageLocalpath);
    if (!uploadedImage?.url) {
        throw new ApiError(400, "Error while uploading profile image");
    }

    doctorProfile.profileImage = uploadedImage.url;
    await doctorProfile.save();

    return res.status(200).json(new ApiResponse(200, doctorProfile, "Profile image updated successfully"));
});


const getDoctorByUserId = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findOne({ user_id: req.user?._id }).populate({
        path: 'user_id',
        select: '-password -refreshToken'
    });
    if (!doctor) {
        throw new ApiError(404, "Doctor profile not found");
    }

    return res.status(200).json(new ApiResponse(200, doctor, "Doctor profile fetched successfully"));
});

const getDoctorsBySpecialization = asyncHandler(async (req, res) => {
    const { specialization } = req.query;

    if (!specialization) {
        throw new ApiError(400, "Specialization is required");
    }

    const doctors = await Doctor.find({
        specialization,
        status: "active" // Only return active doctors
    }).populate({
        path: 'user_id',
        select: '-password -refreshToken'
    }); // Select relevant fields to display

    if (!doctors || doctors.length === 0) {
        throw new ApiError(404, "No doctors found for this specialization");
    }

    return res.status(200).json(new ApiResponse(200, doctors, "Doctors retrieved successfully"));
});

const getAvailableSlotsForDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;

    if (!doctorId) {
        throw new ApiError(400, "Doctor ID is required");
    }

    const doctor = await Doctor.findById(doctorId).select("available_time_slots");

    if (!doctor) {
        throw new ApiError(404, "Doctor not found");
    }

    // Filter out only available time slots
    const availableSlots = doctor.available_time_slots.map(slot => ({
        day: slot.day,
        times: slot.times.filter(time => time.status === "available")
    })).filter(slot => slot.times.length > 0); // Exclude days with no available times

    return res.status(200).json(new ApiResponse(200, availableSlots, "Available slots retrieved successfully"));
});

const getDoctors = asyncHandler(async (req, res) => {
    const { specialization, experience, available_time_slots, name, minRating } = req.query;

    const pipeline = [
        {
            $match: {
                ...(specialization ? { specialization } : {}),
                status: "active",
            }
        },
        {
            $lookup: {
                from: 'users', // assuming doctor names are stored in the users collection
                localField: 'user_id',
                foreignField: '_id',
                as: 'user'
            }
        },
        {
            $unwind: {
                path: '$user',
                preserveNullAndEmptyArrays: true
            }
        },
        {
            $lookup: {
                from: 'feedbacks',
                localField: 'user_id',
                foreignField: 'user_id',
                as: 'ratings'
            }
        },
        {
            $addFields: {
                avgRating: { $avg: "$ratings.rating" }
            }
        },
        {
            $match: {
                ...(name ? { "user.name": { $regex: new RegExp(name, 'i') } } : {})
            }
        },
        {
            $project: {
                _id: 1,
                user_id: 1,
                name: "$user.name",
                profileImage: 1,
                specialization: 1,
                qualification: 1,
                experience: 1,
                languages: 1,
                fees: 1,
                available_time_slots: 1,
                avgRating: 1
            }
        }
    ];

    if (minRating) {
        pipeline.push({
            $match: {
                avgRating: { $gte: parseFloat(minRating) }
            }
        });
    }

    if (experience) {
        pipeline.push({
            $match: {
                experience: { $gte: parseInt(experience) }
            }
        });
    }

    if (available_time_slots) {
        pipeline.push({
            $match: {
                "available_time_slots.times.time": available_time_slots
            }
        });
    }

    const doctors = await Doctor.aggregate(pipeline);

    if (!doctors || doctors.length === 0) {
        throw new ApiError(404, "No doctors found");
    }

    return res.status(200).json(new ApiResponse(200, doctors, "Doctors Found"));
});

const getPatientsForDoctor = asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
  
    if (!doctorId) {
      throw new ApiError(400, "Doctor ID not found");
    }
  
    // Get all appointments for this doctor
    const appointments = await Appointment.find({ doctorId }).sort({ date: -1 }).populate({
      path: "patientId", // or "patient" depending on your schema
      populate: { path: "user_id", select: "-password -refreshToken" } // exclude stuff like password
    });
  
    // Extract unique patients from the appointments
    const uniquePatientsMap = new Map();
  
    appointments.forEach(app => {
      const patient = app.patientId;
      if (patient && !uniquePatientsMap.has(patient._id.toString())) {
        uniquePatientsMap.set(patient._id.toString(), patient);
      }
    });
  
    const uniquePatients = Array.from(uniquePatientsMap.values());
  
    return res.status(200).json(new ApiResponse(200, uniquePatients, "Patients fetched successfully"));
  });
  




export { 
    createDoctor,
    getDoctorById,
    updateDoctorProfile,
    toggleDoctorStatus,
    updateAvailableTimeSlots,
    getDoctors,
    getDoctorByUserId,
    updateProfileImage,
    getDoctorsBySpecialization,
    getAvailableSlotsForDoctor,
    getPatientsForDoctor
}
