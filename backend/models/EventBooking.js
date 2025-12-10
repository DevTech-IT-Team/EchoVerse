const mongoose = require("mongoose");

const EventBookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    events: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EventBooking", EventBookingSchema);
