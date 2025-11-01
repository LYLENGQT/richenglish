const { StatusCodes } = require("http-status-codes");
const TeacherApplication = require("../models/TeacherApplication");
const { BadRequestError, UnathoizedError } = require("../errors");
const { sendMail } = require("../lib/nodemailer");

const createApplication = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    degree,
    major,
    englishLevel,
    experience,
    motivation,
    availability,
    internetSpeed,
    computerSpecs,
    hasWebcam,
    hasHeadset,
    hasBackupInternet,
    hasBackupPower,
    teachingEnvironment,
    resumeFile,
    introVideoFile,
    speedTestFile,
  } = req.body || {};

  if (!firstName || !lastName || !email) {
    throw new BadRequestError("First name, last name, and email are required");
  }

  const existing = await TeacherApplication.findByEmail(email);
  if (existing && existing.status === "pending") {
    throw new BadRequestError("You already have a pending application");
  }

  const application = await TeacherApplication.create({
    firstName,
    lastName,
    email,
    phone,
    degree,
    major,
    englishLevel,
    experience,
    motivation,
    availability,
    internetSpeed,
    computerSpecs,
    hasWebcam,
    hasHeadset,
    hasBackupInternet,
    hasBackupPower,
    teachingEnvironment,
    resumeFile,
    introVideoFile,
    speedTestFile,
  });

  res.status(StatusCodes.CREATED).json(application);

  await sendMail(
    email,
    "Your Teaching Application Received",
    `Hello ${firstName},\n\nThank you for applying as a teacher. Our team will review your application and get back to you within 1–3 days.\n\nBest regards,\nYour Team`
  );
};

const getApplications = async (req, res) => {
  const { status } = req.query;
  const applications = await TeacherApplication.findAll({ status });
  res.status(StatusCodes.OK).json(applications);
};

const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!id || !status || !["approved", "rejected", "pending"].includes(status)) {
    throw new BadRequestError("Invalid status update request");
  }

  const updated = await TeacherApplication.updateStatus(id, status);

  if (!updated) {
    throw new BadRequestError("Application not found");
  }

  const { email, first_name: firstName } = updated;

  res.status(StatusCodes.OK).json(updated);

  if (status === "approved") {
    await sendMail(
      email,
      "Congratulations! Your Rich English Application is Approved 🎉",
      `Hello ${firstName},\n\nWe are pleased to inform you that your teacher application at Rich English has been approved!\n\nOur team will contact you soon with onboarding details and your account setup instructions.\n\nBest regards,\nRich English Team`
    );
  } else if (status === "rejected") {
    await sendMail(
      email,
      "Update on Your Rich English Teacher Application",
      `Hello ${firstName},\n\nWe appreciate the time and effort you took to apply at Rich English.\n\nUnfortunately, we are unable to move forward with your application at this time. Please feel free to reapply in the future.\n\nBest regards,\nRich English Team`
    );
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
};
