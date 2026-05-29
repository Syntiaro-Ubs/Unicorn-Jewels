const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;
  const isConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS;

  if (isConfigured) {
    console.log('✉️ Configuring production SMTP email transporter...');
    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const isGmail = host.includes('gmail.com');

    if (isGmail) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    } else {
      transporter = nodemailer.createTransport({
        host: host,
        port: parseInt(process.env.EMAIL_PORT || '587', 10),
        secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }
  } else {
    console.log('✉️ No email credentials found in .env. Creating Ethereal mock test email account...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`✉️ Mock Ethereal email account created: user=${testAccount.user}`);
    } catch (err) {
      console.error('❌ Failed to create Ethereal mock email account, falling back to basic logger:', err);
      // Fallback simple logger transporter so server doesn't crash
      transporter = {
        sendMail: async (options) => {
          console.log('✉️ [MOCK EMAIL LOG]:', JSON.stringify(options, null, 2));
          return { messageId: 'mock-id', mock: true };
        }
      };
    }
  }

  return transporter;
}

/**
 * Send an email notification for a new appointment booking
 * @param {Object} details 
 */
async function sendAppointmentEmail(details) {
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
  } = details;

  const activeTransporter = await getTransporter();
  const ownerEmail = process.env.OWNER_EMAIL || 'waghmareshrinivas99@gmail.com';
  
  const clientFullName = `${firstName} ${lastName}`;
  const subject = `✨ New Appointment Request: ${service} - ${clientFullName}`;

  // Luxury HTML layout for the boutique notification
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
          background-color: #f7f7f7;
          color: #333333;
          margin: 0;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border: 1px solid #e5e5e5;
          padding: 40px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #C9A66B;
          padding-bottom: 25px;
          margin-bottom: 30px;
        }
        .header h1 {
          font-size: 24px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin: 0;
          color: #111111;
          font-weight: 400;
        }
        .header p {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #999999;
          margin: 8px 0 0 0;
        }
        .section-title {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C9A66B;
          font-weight: 700;
          margin-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
          padding-bottom: 6px;
        }
        .grid {
          margin-bottom: 30px;
        }
        .row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px dashed #f5f5f5;
        }
        .label {
          width: 150px;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #888888;
          font-weight: bold;
        }
        .value {
          flex: 1;
          font-size: 13.5px;
          color: #222222;
        }
        .notes-box {
          background-color: #fcfcfc;
          border: 1px solid #f0f0f0;
          padding: 15px;
          font-style: italic;
          font-size: 13px;
          color: #555555;
          line-height: 1.6;
          margin-top: 10px;
        }
        .footer {
          margin-top: 40px;
          border-top: 1px solid #e5e5e5;
          padding-top: 20px;
          text-align: center;
          font-size: 11px;
          color: #999999;
          letter-spacing: 0.05em;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Unicorn Jewels</h1>
          <p>Boutique Scheduler Notification</p>
        </div>
        
        <div class="section-title">Visit Details</div>
        <div class="grid">
          <div class="row">
            <div class="label">Service</div>
            <div class="value" style="font-weight: bold; color: #111111;">${service}</div>
          </div>
          <div class="row">
            <div class="label">Boutique Location</div>
            <div class="value">${location}</div>
          </div>
          <div class="row">
            <div class="label">Date & Time</div>
            <div class="value" style="color: #c9a66b; font-weight: bold;">${date} at ${time}</div>
          </div>
        </div>

        <div class="section-title">Client Details</div>
        <div class="grid">
          <div class="row">
            <div class="label">Client Name</div>
            <div class="value">${firstName} ${lastName}</div>
          </div>
          <div class="row">
            <div class="label">Email Address</div>
            <div class="value">${email}</div>
          </div>
          <div class="row">
            <div class="label">Phone Number</div>
            <div class="value">${phone || 'N/A'}</div>
          </div>
        </div>

        <div class="section-title">Additional Comments</div>
        <div class="notes-box">
          ${notes ? notes.replace(/\n/g, '<br />') : 'No additional comments provided.'}
        </div>

        <div class="footer">
          This is an automated request generated from the Unicorn Jewels booking system.<br />
          Please follow up with the client within 24 hours to confirm scheduling details.
        </div>
      </div>
    </body>
    </html>
  `;

  // Send the email
  const info = await activeTransporter.sendMail({
    from: `"Unicorn Jewels Scheduler" <${process.env.EMAIL_USER || 'no-reply@unicornjewels.com'}>`,
    to: ownerEmail,
    subject: subject,
    text: `New Appointment Booking Details:\n\nService: ${service}\nLocation: ${location}\nDate: ${date}\nTime: ${time}\nClient Name: ${clientFullName}\nEmail: ${email}\nPhone: ${phone}\nNotes: ${notes || 'None'}`,
    html: htmlBody,
  });

  // If using Ethereal mock account, log the preview URL
  if (nodemailer.getTestMessageUrl(info)) {
    console.log('----------------------------------------------------');
    console.log('✉️ Appointment email preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('----------------------------------------------------');
    return {
      success: true,
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  }

  console.log(`✉️ Appointment email successfully sent to ${ownerEmail}. ID: ${info.messageId}`);
  return {
    success: true,
    messageId: info.messageId
  };
}

module.exports = {
  sendAppointmentEmail
};
