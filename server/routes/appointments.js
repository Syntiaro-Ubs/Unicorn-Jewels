const express = require('express');
const router = express.Router();
const emailService = require('../services/emailService');

// POST /api/appointments
router.post('/', async (req, res) => {
  const {
    service,
    location,
    date,
    time,
    firstName,
    lastName,
    email,
    phone,
    notes
  } = req.body;

  // Simple validation
  if (!service || !location || !date || !time || !firstName || !lastName || !email) {
    return res.status(400).json({
      message: 'Missing required parameters. Required: service, location, date, time, firstName, lastName, email'
    });
  }

  try {
    const result = await emailService.sendAppointmentEmail({
      service,
      location,
      date,
      time,
      firstName,
      lastName,
      email,
      phone,
      notes
    });

    res.status(200).json({
      message: 'Appointment booking request received and email sent.',
      result
    });
  } catch (error) {
    console.error('❌ Error sending appointment email:', error);
    res.status(500).json({
      message: 'Failed to notify boutique staff via email.',
      error: error.message
    });
  }
});

module.exports = router;
