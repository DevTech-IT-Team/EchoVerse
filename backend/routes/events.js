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
        _id: 'yoga-pants-nov1',
        title: 'Yoga Pants the Duo',
        date: 'November 1, 2026',
        time: '3:00 PM - 6:00 PM',
        location: "Jolie's Place, Chandler, AZ – Patio",
        description: 'Yoga Pants the Duo live on the patio.',
        image: 'assets/yogapantsnew2.png',
        type: 'Featured',
        isFeatured: true,
        order: 1
    },
    {
        _id: 'collin-nikki-nov20',
        title: 'Collin Freestone on keyboards with Nikki Shue',
        date: 'November 20, 2026',
        time: '6:00 PM - 9:00 PM',
        location: "Dutchman's Country Barbecue, Apache Junction, AZ",
        description: 'Collin Freestone on keyboards with Nikki Shue.',
        image: 'assets/Collinblue.png',
        type: 'Show',
        isFeatured: false,
        order: 2
    },
    {
        _id: 'freestone-keys-dec12',
        title: 'Freestone Keys – Dueling Pianos with Fuoad Melki',
        date: 'December 12, 2026',
        time: '6:00 PM - 9:00 PM',
        location: 'Scarpetta on the Green, Mesa, AZ',
        description: 'Freestone Keys dueling pianos with Fuoad Melki.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Show',
        isFeatured: false,
        order: 3
    },
    {
        _id: 'live-band-karaoke-jan1',
        title: 'Live Band Karaoke with Yoga Pants the Duo',
        date: 'January 1, 2027',
        time: '8:00 PM - 11:00 PM',
        location: "Fibber Magee's, Chandler, AZ",
        description: 'Live Band Karaoke with Yoga Pants the Duo.',
        image: 'assets/yogapantsnew2.png',
        type: 'Show',
        isFeatured: false,
        order: 4
    },
    {
        _id: 'dueling-pianos-tba',
        title: 'Dueling Pianos with Andy Salmonson',
        date: 'Date TBA',
        time: '6:00 PM - 9:00 PM',
        location: 'Tucson, AZ',
        description: 'Dueling pianos with Andy Salmonson.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Show',
        isFeatured: false,
        order: 5
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
