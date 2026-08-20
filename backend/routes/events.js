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
        // Use staticShows array instead of hardcoded data
        const allEvents = staticShows;

        // Get current date for comparison
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth(); // 0-11 (0 = January)
        const currentDay = currentDate.getDate();

        // Function to parse event date
        const parseEventDate = (dateString) => {
            if (dateString.includes('Every')) return null; // Weekly events don't expire
            
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const dateParts = dateString.split(' ');
            const monthName = dateParts[0];
            const dayPart = dateParts[1] ? dateParts[1].replace(',', '').split('-')[0] : dateParts[1];
            
            const monthIndex = months.indexOf(monthName);
            const day = parseInt(dayPart);
            
            return { monthIndex, day, year: currentYear };
        };

        // Show all managed shows as upcoming (no date-based filtering)
        const upcomingEvents = [...allEvents];
        const pastEvents = []; // Empty - all shows go to upcoming

        // Sort events by order
        upcomingEvents.sort((a, b) => a.order - b.order);

        res.json({
            upcoming: upcomingEvents,
            past: pastEvents,
            currentDate: currentDate.toISOString()
        });
        
    } catch (err) {
        console.error("Fetch shows error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// Static data store (in production, this would be a database)
let staticShows = [
    {
        _id: 'dueling-pianos-aug22',
        title: 'Dueling Pianos',
        date: 'August 22, 2026',
        time: '8:00 PM - 12:00 AM',
        location: 'Whiskey & Ivory Dueling Piano Bar, Prescott, AZ',
        description: 'Collin Freestone performing at Whiskey & Ivory Dueling Piano Bar.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Featured',
        isFeatured: true,
        order: 1
    },
    {
        _id: 'live-band-karaoke-sundays',
        title: 'Live Band Karaoke',
        date: 'Every Sunday',
        time: '8:00 PM - 11:00 PM',
        location: 'The Dark Side, Tempe, AZ',
        description: 'Live Band Karaoke with Yoga Pants the Duo. Turn the audience into the lead singers!',
        image: 'assets/yogapantsnew2.png',
        type: 'Weekly',
        isFeatured: false,
        order: 2
    },
    {
        _id: 'dueling-pianos-aug27',
        title: 'Dueling Pianos',
        date: 'August 27, 2026',
        time: 'Showtime to be confirmed',
        location: '12 West Brewing, Downtown Mesa, AZ',
        description: 'Dueling Pianos show at 12 West Brewing.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Thursday',
        isFeatured: false,
        order: 3
    },
    {
        _id: 'dueling-pianos-aug28-29',
        title: 'Dueling Pianos',
        date: 'August 28-29, 2026',
        time: '8:00 PM - 12:00 AM both nights',
        location: 'Whiskey & Ivory Dueling Piano Bar, Prescott, AZ',
        description: 'Collin Freestone performing at Whiskey & Ivory Dueling Piano Bar.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Featured',
        isFeatured: true,
        order: 4
    },
    {
        _id: 'dueling-pianos-aug31',
        title: 'Freestone Keys – Dueling Pianos',
        date: 'August 31, 2026',
        time: '6:00 PM - 9:00 PM',
        location: 'Scarpetta on the Green, Mesa, AZ',
        description: 'Freestone Keys – Dueling Pianos performance.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Monday',
        isFeatured: false,
        order: 5
    },
    {
        _id: 'dueling-pianos-sept11-12',
        title: 'Dueling Pianos',
        date: 'September 11-12, 2026',
        time: '8:00 PM - 12:00 AM both nights',
        location: 'Whiskey & Ivory Dueling Piano Bar, Prescott, AZ',
        description: 'Collin Freestone performing at Whiskey & Ivory Dueling Piano Bar.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'September',
        isFeatured: false,
        order: 6
    },
    {
        _id: 'dueling-pianos-sept25-26',
        title: 'Dueling Pianos',
        date: 'September 25-26, 2026',
        time: '8:00 PM - 12:00 AM both nights',
        location: 'Whiskey & Ivory Dueling Piano Bar, Prescott, AZ',
        description: 'Collin Freestone performing at Whiskey & Ivory Dueling Piano Bar.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'September',
        isFeatured: false,
        order: 7
    },
    {
        _id: 'dueling-pianos-oct01',
        title: 'Ricky Harris & Collin Freestone',
        date: 'October 1, 2026',
        time: '8:00 PM - 10:00 PM',
        location: 'Dierks Bentley, Scottsdale, AZ',
        description: 'Collin Freestone on bass with Ricky Harris.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'October',
        isFeatured: false,
        order: 8
    },
    {
        _id: 'dueling-pianos-nov28',
        title: 'Nikki Shue & Collin Freestone',
        date: 'November 28, 2026',
        time: '8:00 PM - 11:00 PM',
        location: 'OSHO',
        description: 'Collin Freestone on keys with Nikki Shue.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'November',
        isFeatured: false,
        order: 9
    },
    {
        _id: 'dueling-pianos-dec12',
        title: 'Amazing Pianos (with James Brown)',
        date: 'December 12, 2026',
        time: 'Evening',
        location: 'Old Ellsworth Brewing Company, Queen Creek, AZ',
        description: 'Collin Freestone performing for Amazing Pianos with James Brown.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'December',
        isFeatured: false,
        order: 10
    }
];

// Function to determine if event is past or upcoming
const isEventPast = (dateString) => {
    if (dateString.includes('Every')) return false; // Weekly events are always upcoming
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const dateParts = dateString.split(' ');
    const monthName = dateParts[0];
    const dayPart = dateParts[1] ? dateParts[1].replace(',', '').split('-')[0] : dateParts[1];
    
    const monthIndex = months.indexOf(monthName);
    const day = parseInt(dayPart);
    
    return (
        monthIndex < currentMonth ||
        (monthIndex === currentMonth && day < currentDay)
    );
};

// ADMIN: ADD SHOW
router.post("/add-show", async (req, res) => {
    try {
        const newShow = {
            _id: `show-${Date.now()}`,
            ...req.body,
            order: staticShows.length + 1
        };
        
        // Add to static shows
        staticShows.push(newShow);
        
        // Always categorize admin-added shows as upcoming
        // Admin can manually move to past if needed via update
        res.json({ 
            message: "Show added successfully", 
            show: newShow,
            category: 'upcoming'
        });
    } catch (err) {
        console.error("Add show error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN: UPDATE SHOW
router.put("/update-show/:id", async (req, res) => {
    try {
        const index = staticShows.findIndex(show => show._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: "Show not found" });
        
        // Update the show
        staticShows[index] = { ...staticShows[index], ...req.body };
        
        // Determine if updated show is past or upcoming
        const isPast = isEventPast(staticShows[index].date);
        
        res.json({ 
            message: "Show updated successfully", 
            show: staticShows[index],
            category: isPast ? 'past' : 'upcoming'
        });
    } catch (err) {
        console.error("Update show error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// ADMIN: DELETE SHOW
router.delete("/delete-show/:id", async (req, res) => {
    try {
        const index = staticShows.findIndex(show => show._id === req.params.id);
        if (index === -1) return res.status(404).json({ message: "Show not found" });
        
        const deletedShow = staticShows.splice(index, 1)[0];
        res.json({ message: "Show deleted successfully", show: deletedShow });
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

// GET PAST SHOWS (for frontend)
router.get("/past-shows", async (req, res) => {
    try {
        // Get current date for comparison (same logic as upcoming-shows)
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();

        // Use staticShows array instead of hardcoded data
        const allEvents = staticShows;

        // Function to parse event date (same as upcoming-shows)
        const parseEventDate = (dateString) => {
            if (dateString.includes('Every')) return null;
            
            const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            const dateParts = dateString.split(' ');
            const monthName = dateParts[0];
            const dayPart = dateParts[1] ? dateParts[1].replace(',', '').split('-')[0] : dateParts[1];
            
            const monthIndex = months.indexOf(monthName);
            const day = parseInt(dayPart);
            
            return { monthIndex, day, year: currentYear };
        };

        // Show all managed shows as upcoming (no date-based filtering)
        const upcomingEvents = [...allEvents];
        const pastEvents = []; // Empty - all shows go to upcoming

        // Sort events by order
        upcomingEvents.sort((a, b) => a.order - b.order);

        res.json({
            upcoming: upcomingEvents,
            past: pastEvents,
            currentDate: currentDate.toISOString()
        });
        
    } catch (err) {
        console.error("Fetch past shows error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
