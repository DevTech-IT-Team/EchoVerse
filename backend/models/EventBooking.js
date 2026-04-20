const mongoose = require("mongoose");

const EventBookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    eventType: { type: String, required: true }, // 'upcoming-show' or 'custom-event'
    eventId: { type: String }, // For upcoming shows
    eventTitle: { type: String, required: true },
    eventDate: { type: String, required: true },
    eventTime: { type: String },
    eventLocation: { type: String, required: true },
    numberOfGuests: { type: Number, default: 1 },
    specialRequests: { type: String },
    status: { type: String, default: 'pending' }, // 'pending', 'confirmed', 'cancelled'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EventBooking", EventBookingSchema);
