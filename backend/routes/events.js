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
        _id: 'girl-and-guy-apr23',
        title: 'Girl and a Guy',
        date: 'April 23, 2026',
        time: '6:00 PM - 9:00 PM',
        location: 'Pizzacata, Mesa, AZ',
        description: 'Elegant duo featuring piano and vocal performances by Collin Freestone and Kaylee Leatherwood.',
        image: 'assets/Girl and a Guy flier .jpg',
        type: 'Featured',
        isFeatured: true,
        order: 1
    },
    {
        _id: 'dueling-pianos-weekly',
        title: 'Dueling Pianos',
        date: 'Every Wednesday',
        time: 'Evening',
        location: 'Low Key Piano Bar, Tempe, AZ',
        description: 'Interactive, request-driven piano-bar shows.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Weekly',
        isFeatured: false,
        order: 2
    },
    {
        _id: 'dueling-pianos-apr24',
        title: 'Dueling Pianos',
        date: 'April 24, 2026',
        time: 'Evening',
        location: 'Low Key Piano Bar, Tempe, AZ',
        description: 'High-energy dueling piano performance.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Friday',
        isFeatured: false,
        order: 3
    },
    {
        _id: 'yoga-pants-apr25',
        title: 'Yoga Pants (Trio)',
        date: 'April 25, 2026',
        time: '4:00 PM - 7:00 PM',
        location: 'Pedal Haus Brewery, Mesa, AZ',
        description: 'High-energy trio performance featuring Kaylee Leatherwood (drums/vocals) and Max Bustamante (saxophone).',
        image: 'assets/yogapantsnew2.png',
        type: 'Saturday',
        isFeatured: false,
        order: 4
    },
    {
        _id: 'dueling-pianos-apr25-late',
        title: 'Dueling Pianos',
        date: 'April 25, 2026',
        time: 'Late Night',
        location: 'Low Key Piano Bar, Tempe, AZ',
        description: 'Late night dueling piano show.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Late Night',
        isFeatured: false,
        order: 5
    },
    {
        _id: 'dueling-pianos-apr27',
        title: 'Dueling Pianos',
        date: 'April 27, 2026',
        time: '6:00 PM - 9:00 PM',
        location: 'Pizzacata, Mesa, AZ',
        description: 'Monday night dueling piano performance.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Monday',
        isFeatured: false,
        order: 6
    },
    {
        _id: 'live-band-karaoke-sundays',
        title: 'Live Band Karaoke (Yoga Pants Trio)',
        date: 'Every Sunday',
        time: '8:00 PM - 11:00 PM',
        location: 'The Dark Side, Tempe, AZ',
        description: 'Turn the audience into lead singers with our interactive live band karaoke experience!',
        image: 'assets/yogapantsnew2.png',
        type: 'Weekly',
        isFeatured: false,
        order: 7
    },
    {
        _id: 'yoga-pants-may16',
        title: 'Yoga Pants (Trio)',
        date: 'May 16, 2026',
        time: '3:00 PM - 6:00 PM',
        location: 'Lucky\'s',
        description: 'Featuring Kaylee Leatherwood (drums/vocals) and Brandon Croft (guitar).',
        image: 'assets/yogapantsnew2.png',
        type: 'May',
        isFeatured: false,
        order: 8
    },
    {
        _id: 'dueling-pianos-may13',
        title: 'Dueling Pianos (with Jeffrey Taylor)',
        date: 'May 13, 2026',
        time: '5:00 PM - 8:00 PM',
        location: 'The Backyard, Gilbert, Arizona',
        description: 'Special dueling piano performance with guest Jeffrey Taylor.',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Wednesday',
        isFeatured: false,
        order: 9
    },
    {
        _id: 'dueling-pianos-may15',
        title: 'Dueling Pianos',
        date: 'May 15, 2026',
        time: '8:00 PM - 12:00 AM',
        location: 'Whiskey & Ivory, Prescott, Arizona',
        description: 'Performing at the new dueling piano venue in Prescott!',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'Friday',
        isFeatured: false,
        order: 10
    },
    {
        _id: 'dueling-pianos-may29-30',
        title: 'Dueling Pianos',
        date: 'May 29-30, 2026',
        time: 'Multiple Shows',
        location: 'Whiskey & Ivory, Prescott, AZ',
        description: 'Performing at the new dueling piano venue in the Whiskey Row area!',
        image: 'assets/Freestone Keys flier .jpg',
        type: 'May',
        isFeatured: false,
        order: 11
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
