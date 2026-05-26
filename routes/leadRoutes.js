const express = require("express");
const { appendLeadToSheet } = require("../services/sheetsService");

const router = express.Router();

const EXPERIENCE_OPTIONS = ["Beginner", "Tried Before", "Already Trading"];
const indianPhoneRegex = /^(?:\+91[\s-]?)?[6-9]\d{9}$/;

router.post("/", async (req, res) => {
  try {
    const { name, phone, experience } = req.body;
    const cleanName = String(name || "").trim();
    const cleanPhone = String(phone || "").trim().replace(/\s+/g, "");
    const cleanExperience = String(experience || "").trim();

    if (!cleanName || !cleanPhone || !cleanExperience) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields."
      });
    }

    if (!indianPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid Indian mobile number."
      });
    }

    if (!EXPERIENCE_OPTIONS.includes(cleanExperience)) {
      return res.status(400).json({
        success: false,
        message: "Please select a valid experience level."
      });
    }

    const timestamp = new Date().toISOString();
    await appendLeadToSheet({
      name: cleanName,
      phone: cleanPhone,
      experience: cleanExperience,
      timestamp
    });

    return res.status(201).json({
      success: true,
      message: "You're in! Redirecting you to WhatsApp..."
    });
  } catch (error) {
    console.error("Lead submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while submitting your form. Please try again."
    });
  }
});

module.exports = router;
