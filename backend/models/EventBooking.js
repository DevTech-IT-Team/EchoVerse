const mongoose = require("mongoose");

const EventBookingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    eventType: { type: String, required: true, default: 'upcoming-show' }, // 'upcoming-show', 'custom-event', or 'general-inquiry'
    events: { type: [String], default: [] }, // For general inquiry with multiple selections
    eventId: { type: String }, // For upcoming shows
    eventTitle: { type: String },
    eventDate: { type: String },
    eventTime: { type: String },
    eventLocation: { type: String },
    numberOfGuests: { type: Number, default: 1 },
    specialRequests: { type: String },
    status: { type: String, default: 'pending' }, // 'pending', 'confirmed', 'cancelled'
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("EventBooking", EventBookingSchema);
