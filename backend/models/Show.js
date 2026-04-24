const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: String, required: true }, // e.g., "April 24, 2026" or "Every Thursday"
    time: { type: String, required: true }, // e.g., "8:00 PM"
    location: { type: String, required: true }, // e.g., "Low Key Dueling Piano Bar, Tempe, AZ"
    address: { type: String }, // e.g., "501 South Mill Avenue, Tempe, AZ 85281"
    description: { type: String },
    image: { type: String, default: 'assets/Freestone Keys flier .jpg' },
    type: { type: String }, // e.g., 'Weekly', 'Late Night'
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Show", ShowSchema);
