const express = require("express");
const router = express.Router();
const EventBooking = require("../models/EventBooking");

// PUBLIC BOOKING (no auth)
router.post("/book", async (req, res) => {
    try {
        const booking = new EventBooking({
            name: req.body.name,
            email: req.body.email,
            events: req.body.events
        });

        await booking.save();
        res.json({ message: "Booking saved", booking });

    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
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

module.exports = router;
