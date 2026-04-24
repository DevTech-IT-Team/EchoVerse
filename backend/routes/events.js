const express = require("express");
const router = express.Router();
const EventBooking = require("../models/EventBooking");
const Show = require("../models/Show");

// PUBLIC BOOKING (no auth)
router.post("/book", async (req, res) => {
    try {
        const { events, eventType, eventTitle, eventDate, eventLocation } = req.body;

        const booking = new EventBooking({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            // If events array is provided, it's likely a general inquiry
            eventType: eventType || (events && events.length > 0 ? 'general-inquiry' : 'upcoming-show'),
            events: events || [],
            eventId: req.body.eventId,
            eventTitle: eventTitle,
            eventDate: eventDate,
            eventTime: req.body.eventTime,
            eventLocation: eventLocation,
            numberOfGuests: req.body.numberOfGuests || 1,
            specialRequests: req.body.specialRequests
        });

        await booking.save();
        res.json({ message: "Booking saved successfully", booking });

    } catch (err) {
        console.log("Booking error:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
});

// GET UPCOMING SHOWS (for frontend)
router.get("/upcoming-shows", async (req, res) => {
    try {
        const upcomingShows = await Show.find().sort({ order: 1, createdAt: 1 });
        res.json(upcomingShows);
    } catch (err) {
        console.error("Fetch shows error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN: ADD SHOW
router.post("/add-show", async (req, res) => {
    try {
        const newShow = new Show(req.body);
        await newShow.save();
        res.json({ message: "Show added successfully", show: newShow });
    } catch (err) {
        console.error("Add show error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN: UPDATE SHOW
router.put("/update-show/:id", async (req, res) => {
    try {
        const updatedShow = await Show.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedShow) return res.status(404).json({ message: "Show not found" });
        res.json({ message: "Show updated successfully", show: updatedShow });
    } catch (err) {
        console.error("Update show error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN: DELETE SHOW
router.delete("/delete-show/:id", async (req, res) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id);
        if (!show) return res.status(404).json({ message: "Show not found" });
        res.json({ message: "Show deleted successfully" });
    } catch (err) {
        console.error("Delete show error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN VIEW
router.get("/all", async (req, res) => {
    try {
        const bookings = await EventBooking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// UPDATE BOOKING STATUS (admin only)
router.put("/update-status/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await EventBooking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.json({ message: "Status updated successfully", booking });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// GET USER BOOKINGS
router.get("/my-bookings/:email", async (req, res) => {
    try {
        const bookings = await EventBooking.find({ email: req.params.email.toLowerCase() }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

// DELETE BOOKING (admin only)
router.delete("/:id", async (req, res) => {
    try {
        const booking = await EventBooking.findByIdAndDelete(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.json({ message: "Booking deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
