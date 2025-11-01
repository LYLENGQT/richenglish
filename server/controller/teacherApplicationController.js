const { StatusCodes } = require("http-status-codes");
const TeacherApplication = require("../models/TeacherApplication");
const { BadRequestError, UnathoizedError } = require("../errors");

const ensureSuperAdmin = (user) => {
  if (!user || user.role !== "super-admin") {
    throw new UnathoizedError("Only super admin can perform this action");
  }
};

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
};

const getApplications = async (req, res) => {
  ensureSuperAdmin(req.user);

  const { status } = req.query;
  const applications = await TeacherApplication.findAll({ status });
  res.status(StatusCodes.OK).json(applications);
};

const updateApplicationStatus = async (req, res) => {
  ensureSuperAdmin(req.user);

  const { id } = req.params;
  const { status } = req.body || {};

  if (!id || !status || !["approved", "rejected", "pending"].includes(status)) {
    throw new BadRequestError("Invalid status update request");
  }

  const updated = await TeacherApplication.updateStatus(id, status);

  if (!updated) {
    throw new BadRequestError("Application not found");
  }

  res.status(StatusCodes.OK).json(updated);
};

module.exports = {
  createApplication,
  getApplications,
  updateApplicationStatus,
};

