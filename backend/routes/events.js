const express = require("express");
const router = express.Router();
const EventBooking = require("../models/EventBooking");

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
        // This could be fetched from a database or returned as static data
        const upcomingShows = [
            {
                id: "dueling-pianos-apr22",
                title: "Dueling Pianos",
                date: "April 22, 2026",
                time: "5:00 PM – 8:00 PM",
                location: "The Backyard, Gilbert, Arizona",
                type: "Dueling Pianos with Joe Fladung",
                image: "assets/Freestone Keys flier .jpg",
                description: "High-energy dueling piano show at The Backyard."
            },
            {
                id: "dueling-pianos-may01",
                title: "Dueling Pianos",
                date: "May 1, 2026",
                time: "Starts at 8:00 PM",
                location: "Low Key Dueling Piano Bar, Tempe, AZ",
                type: "Evening Performance",
                image: "assets/Freestone Keys flier .jpg",
                description: "Interactive, request-driven piano-bar shows."
            },
            {
                id: "dueling-pianos-may02",
                title: "Dueling Pianos",
                date: "May 2, 2026",
                time: "Starts at 8:00 PM",
                location: "Low Key Dueling Piano Bar, Tempe, AZ",
                type: "Evening Performance",
                image: "assets/Freestone Keys flier .jpg",
                description: "Interactive, request-driven piano-bar shows."
            },
            {
                id: "girl-and-guy-apr23",
                title: "Girl and a Guy",
                date: "April 23, 2026",
                time: "6:00 PM - 9:00 PM",
                location: "Pizzacata, Mesa, AZ",
                type: "Featured Event",
                image: "assets/Girl and a Guy flier .jpg",
                description: "Elegant duo featuring piano and vocal performances by Collin Freestone and Kaylee Leatherwood."
            },
            {
                id: "dueling-pianos-weekly",
                title: "Dueling Pianos",
                date: "Every Wednesday",
                time: "Varies",
                location: "Low Key Dueling Piano Bar, Tempe, AZ",
                type: "Weekly Event",
                image: "assets/Freestone Keys flier .jpg",
                description: "Interactive, request-driven piano-bar shows with Freestone Keys."
            },
            {
                id: "yoga-pants-apr25",
                title: "Yoga Pants (Trio)",
                date: "April 25, 2026",
                time: "4:00 PM - 7:00 PM",
                location: "Pedal Haus Brewery, Mesa, AZ",
                type: "Special Event",
                image: "assets/yogapantsnew2canva.png",
                description: "High-energy trio performance featuring Kaylee Leatherwood (drums/vocals) and Max Bustamante (saxophone)."
            },
            {
                id: "live-band-karaoke-sundays",
                title: "Live Band Karaoke (Yoga Pants Trio)",
                date: "Every Sunday",
                time: "8:00 PM - 11:00 PM",
                location: "The Dark Side, Tempe, AZ",
                type: "Weekly Event",
                image: "assets/yogapantsnew2canva.png",
                description: "Turn the audience into lead singers with our interactive live band karaoke experience!"
            }
        ];
        
        res.json(upcomingShows);
    } catch (err) {
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
