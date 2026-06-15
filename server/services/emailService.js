const nodemailer = require('nodemailer');
require('dotenv').config();
const db = require('../db');

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

/**
 * Send a consolidated order confirmation email with item details and track order link
 * @param {string} orderId 
 */
async function sendOrderConfirmationEmail(orderId) {
  try {
    // 1. Fetch order items
    const [items] = await db.query(
      'SELECT * FROM user_orders WHERE order_id = ?',
      [orderId]
    );

    if (items.length === 0) {
      console.error(`❌ sendOrderConfirmationEmail: Order ${orderId} not found.`);
      return { success: false, error: 'Order not found' };
    }

    const userId = items[0].user_id;

    // 2. Fetch user details
    const [users] = await db.query(
      'SELECT first_name, last_name, email FROM users WHERE id = ?',
      [userId]
    );

    if (users.length === 0) {
      console.error(`❌ sendOrderConfirmationEmail: User ${userId} not found.`);
      return { success: false, error: 'User not found' };
    }

    const user = users[0];
    const customerEmail = user.email;
    const customerName = `${user.first_name} ${user.last_name}`;

    // 3. Calculate totals (matching front-end/back-end exactly)
    const subtotal = items.reduce((sum, item) => {
      const priceVal = parseFloat((item.price || '').replace(/[^0-9.]/g, '')) || 0;
      return sum + priceVal;
    }, 0);

    const shipping = subtotal > 500 ? 0 : 25;
    const taxes = subtotal * 0.08;
    const total = subtotal + shipping + taxes;

    const formatCurrency = (amount) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0
      }).format(amount);
    };

    // 4. Construct track order link
    const hostUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const trackingLink = `${hostUrl}/?track_order_id=${orderId}`;

    const activeTransporter = await getTransporter();

    // Helper to resolve absolute image URLs for emails
    const resolveImageUrl = (url) => {
      if (!url) return 'https://images.unsplash.com/photo-1724937721228-f7bf3df2a4d8';
      if (url.startsWith('http')) return url;
      return `http://localhost:5000${url}`;
    };

    // Construct order items list
    const itemsHtml = items.map(item => `
      <div class="item-row" style="display: flex; align-items: center; padding: 15px 0; border-bottom: 1px solid #f9f9f9;">
        <div class="item-image" style="width: 70px; height: 70px; background-color: #fafafa; border: 1px solid #f0f0f0; padding: 5px; margin-right: 20px; text-align: center; display: inline-block; vertical-align: middle;">
          <img src="${resolveImageUrl(item.image_url)}" alt="${item.product_name}" style="max-width: 100%; max-height: 100%; object-fit: contain;" />
        </div>
        <div class="item-details" style="flex: 1; display: inline-block; vertical-align: middle;">
          <div class="item-name" style="font-size: 13px; font-weight: 500; color: #111111; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">${item.product_name}</div>
          <div class="item-meta" style="font-size: 11px; color: #888888; text-transform: uppercase; letter-spacing: 0.05em;">
            ${item.selected_size ? `Size: ${item.selected_size} &middot; ` : ''}Qty: ${item.quantity || 1}
          </div>
        </div>
        <div class="item-price" style="font-size: 13px; font-weight: bold; color: #222222; text-align: right; flex-shrink: 0; display: inline-block; float: right; margin-top: 25px;">${item.price}</div>
        <div style="clear: both;"></div>
      </div>
    `).join('');

    const subject = `✨ Your Unicorn Jewels Order Confirmation - ${orderId}`;

    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #fcfcfc;
            color: #222222;
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border: 1px solid #eaeaea;
            padding: 40px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          }
          .header {
            text-align: center;
            border-bottom: 1px solid #eaeaea;
            padding-bottom: 25px;
            margin-bottom: 30px;
          }
          .header h1 {
            font-family: 'Georgia', serif;
            font-size: 26px;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin: 0;
            color: #111111;
            font-weight: 300;
          }
          .header p {
            font-size: 9px;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            color: #999999;
            margin: 10px 0 0 0;
          }
          .greeting {
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 30px;
            font-weight: 300;
            color: #555555;
          }
          .section-title {
            font-size: 10px;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: #c9a66b;
            font-weight: bold;
            margin-bottom: 15px;
            border-bottom: 1px solid #f5f5f5;
            padding-bottom: 6px;
          }
          .summary-box {
            margin-top: 30px;
            background-color: #fafafa;
            padding: 20px;
            border: 1px solid #f5f5f5;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            font-size: 13px;
            padding: 6px 0;
            color: #555555;
          }
          .summary-row.total {
            font-size: 16px;
            font-weight: bold;
            color: #111111;
            border-top: 1px solid #eaeaea;
            padding-top: 12px;
            margin-top: 6px;
          }
          .cta-container {
            text-align: center;
            margin: 40px 0;
          }
          .cta-button {
            display: inline-block;
            background-color: #111111;
            color: #ffffff !important;
            text-decoration: none;
            padding: 16px 36px;
            font-size: 10px;
            font-weight: bold;
            letter-spacing: 0.25em;
            text-transform: uppercase;
            border: 1px solid #111111;
          }
          .footer {
            margin-top: 50px;
            border-top: 1px solid #eaeaea;
            padding-top: 25px;
            text-align: center;
            font-size: 10px;
            color: #aaaaaa;
            letter-spacing: 0.05em;
            line-height: 1.8;
          }
        </style>
      </head>
      <body>
        <div class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #eaeaea; padding: 40px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);">
          <div class="header" style="text-align: center; border-bottom: 1px solid #eaeaea; padding-bottom: 25px; margin-bottom: 30px;">
            <h1 style="font-family: 'Georgia', serif; font-size: 26px; letter-spacing: 0.15em; text-transform: uppercase; margin: 0; color: #111111; font-weight: 300;">Unicorn Jewels</h1>
            <p style="font-size: 9px; letter-spacing: 0.25em; text-transform: uppercase; color: #999999; margin: 10px 0 0 0;">Order Confirmation</p>
          </div>
          
          <div class="greeting" style="font-size: 14px; line-height: 1.6; margin-bottom: 30px; font-weight: 300; color: #555555;">
            Thank you for your acquisition, <strong>${customerName}</strong>.<br />
            Your request has been successfully recorded. Below are the details of your order.
          </div>
          
          <div class="section-title" style="font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #c9a66b; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #f5f5f5; padding-bottom: 6px;">Order #${orderId} Details</div>
          <div>
            ${itemsHtml}
          </div>
          
          <div class="summary-box" style="margin-top: 30px; background-color: #fafafa; padding: 20px; border: 1px solid #f5f5f5;">
            <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #555555;">
              <tr>
                <td style="padding: 6px 0;">Subtotal</td>
                <td style="text-align: right; padding: 6px 0;">${formatCurrency(subtotal)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;">Shipping</td>
                <td style="text-align: right; padding: 6px 0;">${shipping === 0 ? 'Complimentary' : formatCurrency(shipping)}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0;">Estimated Tax</td>
                <td style="text-align: right; padding: 6px 0;">${formatCurrency(taxes)}</td>
              </tr>
              <tr style="font-size: 16px; font-weight: bold; color: #111111; border-top: 1px solid #eaeaea;">
                <td style="padding: 12px 0 0 0;">Total Bill</td>
                <td style="text-align: right; padding: 12px 0 0 0;">${formatCurrency(total)}</td>
              </tr>
            </table>
          </div>
          
          <div class="cta-container" style="text-align: center; margin: 40px 0;">
            <a href="${trackingLink}" class="cta-button" style="display: inline-block; background-color: #111111; color: #ffffff !important; text-decoration: none; padding: 16px 36px; font-size: 10px; font-weight: bold; letter-spacing: 0.25em; text-transform: uppercase; border: 1px solid #111111;">Track Order</a>
          </div>
          
          <div class="footer" style="margin-top: 50px; border-top: 1px solid #eaeaea; padding-top: 25px; text-align: center; font-size: 10px; color: #aaaaaa; letter-spacing: 0.05em; line-height: 1.8;">
            This is an automated correspondence from Unicorn Jewels.<br />
            For any custom styling inquiries or scheduling assistance, please contact boutique support.<br />
            &copy; ${new Date().getFullYear()} Unicorn Jewels. All Rights Reserved.
          </div>
        </div>
      </body>
      </html>
    `;

    const info = await activeTransporter.sendMail({
      from: `"Unicorn Jewels" <${process.env.EMAIL_USER || 'no-reply@unicornjewels.com'}>`,
      to: customerEmail,
      subject: subject,
      text: `Thank you for your order, ${customerName}!\n\nOrder ID: ${orderId}\nTotal: ${formatCurrency(total)}\n\nTrack your order here: ${trackingLink}`,
      html: htmlBody,
    });

    if (nodemailer.getTestMessageUrl(info)) {
      console.log('----------------------------------------------------');
      console.log('✉️ Order email preview URL:', nodemailer.getTestMessageUrl(info));
      console.log('----------------------------------------------------');
      return {
        success: true,
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info)
      };
    }

    console.log(`✉️ Order confirmation email successfully sent to ${customerEmail}. ID: ${info.messageId}`);
    return {
      success: true,
      messageId: info.messageId
    };
  } catch (error) {
    console.error(`❌ Error sending order confirmation email for ${orderId}:`, error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  sendAppointmentEmail,
  sendOrderConfirmationEmail
};
