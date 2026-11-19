const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const userController = require("../controllers/userController");
const scheduleController = require("../controllers/scheduleController");

// Auth
router.post("/register", userController.handleRegister);
router.post("/login", userController.handleLogin);

// Users
router.get("/get-all-users", userController.handleGetAllUsers);

// Booking & Deposit (30%)
router.post("/patient-book-appointment", bookingController.handleCreateBooking);
router.post("/booking/confirm-deposit", bookingController.handleConfirmDeposit);

// Schedule
router.post(
  "/bulk-create-schedule",
  scheduleController.handleBulkCreateSchedule,
);
router.get(
  "/get-schedule-doctor-by-date",
  scheduleController.handleGetScheduleByDate,
);

// Booking status & cancellation/refund
router.put("/booking/status", scheduleController.handleUpdateBookingStatus);

module.exports = router;
