const express = require("express");
const sgMail = require("@sendgrid/mail");

const router = express.Router();

// Set SendGrid API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send", async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.json({ success: false, error: "Missing required fields" });
    }

    try {
        const msg = {
            to: process.env.EMAIL_TO,      // receiver email
            from: process.env.EMAIL_FROM,  // verified sender email
            subject: `New Contact Form Message from ${name}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong><br>${message}</p>
            `
        };

        await sgMail.send(msg);

        return res.json({ success: true, message: "Message sent successfully!" });

    } catch (error) {
        console.error("SendGrid Email Error:", error);
        return res.json({ success: false, error: "Email failed to send" });
    }
});

module.exports = router;
