const mongoose = require("mongoose");

const { Schema, model, models } = mongoose;

const notificationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["offline_alert", "schedule_update", "payout_notice"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: false },
  }
);

const Notification =
  models.Notification || model("Notification", notificationSchema);

module.exports = Notification;
