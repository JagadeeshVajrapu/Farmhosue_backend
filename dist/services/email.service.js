"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBookingConfirmationEmail = sendBookingConfirmationEmail;
exports.sendAdminBookingAlert = sendAdminBookingAlert;
exports.sendContactEnquiryEmail = sendContactEnquiryEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
function createTransporter() {
    if (!env_1.env.smtp.isConfigured)
        return null;
    return nodemailer_1.default.createTransport({
        host: env_1.env.smtp.host,
        port: env_1.env.smtp.port,
        secure: env_1.env.smtp.port === 465,
        auth: {
            user: env_1.env.smtp.user,
            pass: env_1.env.smtp.pass,
        },
    });
}
function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function formatEmailDate(date) {
    return date.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });
}
function formatEventTypeLabel(eventType) {
    const labels = {
        'weekend-stay': 'Weekend Stay',
        'pool-party': 'Pool Party',
        birthday: 'Birthday Celebration',
        wedding: 'Wedding / Pre-Wedding',
        corporate: 'Corporate Retreat',
        family: 'Family Gathering',
        other: 'Other Event',
    };
    return labels[eventType] || eventType;
}
function luxuryEmailTemplate(data) {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#141414;border:1px solid #c9a96233;border-radius:12px;overflow:hidden;">
        <tr><td style="background:linear-gradient(135deg,#1a1a1a,#0a0a0a);padding:32px;text-align:center;border-bottom:1px solid #c9a96233;">
          <p style="margin:0 0 8px;font-size:10px;letter-spacing:4px;color:#c9a962;text-transform:uppercase;">Vidhaan Farmhouse</p>
          <h1 style="margin:0;font-size:28px;font-weight:300;color:#f5f0e8;">Booking Confirmed</h1>
        </td></tr>
        <tr><td style="padding:32px;">
          <p style="margin:0 0 24px;color:#e8dcc8;font-size:16px;">Dear ${data.guestName},</p>
          <p style="margin:0 0 24px;color:#8a8a8a;font-size:14px;line-height:1.6;">
            Thank you for choosing Vidhaan Farmhouse. Your reservation request has been received and our team will confirm availability within 24 hours.
          </p>
          <table width="100%" style="background:#1a1a1a;border-radius:8px;padding:20px;margin-bottom:24px;">
            <tr><td style="padding:8px 0;color:#c9a962;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Booking ID</td></tr>
            <tr><td style="padding:0 0 16px;color:#f5f0e8;font-size:24px;font-family:monospace;">${data.bookingId}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8a8a;font-size:13px;"><strong style="color:#e8dcc8;">Property:</strong> ${data.propertyName}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8a8a;font-size:13px;"><strong style="color:#e8dcc8;">Event:</strong> ${data.eventName} (${data.eventType})</td></tr>
            <tr><td style="padding:8px 0;color:#8a8a8a;font-size:13px;"><strong style="color:#e8dcc8;">Check-in:</strong> ${data.checkIn}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8a8a;font-size:13px;"><strong style="color:#e8dcc8;">Check-out:</strong> ${data.checkOut}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8a8a;font-size:13px;"><strong style="color:#e8dcc8;">Guests:</strong> ${data.guests}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8a8a;font-size:13px;"><strong style="color:#e8dcc8;">Total:</strong> ₹${data.totalPrice.toLocaleString('en-IN')}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8a8a;font-size:13px;"><strong style="color:#e8dcc8;">Payment:</strong> ${data.paymentMethod}</td></tr>
          </table>
          <p style="margin:0;color:#8a8a8a;font-size:12px;text-align:center;">reservations@vidhaan.com · +91 98765 43210</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
async function sendBookingConfirmationEmail(data) {
    const transporter = createTransporter();
    if (!transporter) {
        console.log('[Email] SMTP not configured — skipping guest confirmation email');
        return false;
    }
    try {
        await transporter.sendMail({
            from: env_1.env.smtp.from,
            to: data.guestEmail,
            subject: `Booking Confirmation — ${data.bookingId} | Vidhaan Farmhouse`,
            html: luxuryEmailTemplate(data),
        });
        return true;
    }
    catch (err) {
        console.error('[Email] Failed to send guest confirmation:', err);
        return false;
    }
}
async function sendAdminBookingAlert(data) {
    const transporter = createTransporter();
    if (!transporter || !env_1.env.smtp.adminEmail) {
        console.log('[Email] SMTP/admin not configured — skipping admin alert');
        return false;
    }
    try {
        await transporter.sendMail({
            from: env_1.env.smtp.from,
            to: env_1.env.smtp.adminEmail,
            subject: `New Booking: ${data.bookingId} — ${data.guestName}`,
            html: luxuryEmailTemplate(data),
        });
        return true;
    }
    catch (err) {
        console.error('[Email] Failed to send admin alert:', err);
        return false;
    }
}
function contactEnquiryEmailTemplate(data) {
    const name = escapeHtml(data.name);
    const phone = escapeHtml(data.phone);
    const email = escapeHtml(data.email);
    const eventType = escapeHtml(formatEventTypeLabel(data.eventType));
    const preferredDate = escapeHtml(formatEmailDate(data.preferredDate));
    const message = escapeHtml(data.message).replace(/\n/g, '<br/>');
    const submittedDate = escapeHtml(data.submittedAt.toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
    }));
    const row = (label, value) => `
    <tr>
      <td style="padding:14px 20px;border-bottom:1px solid #1e293b;width:38%;vertical-align:top;">
        <span style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#C9A227;font-family:Arial,sans-serif;">${label}</span>
      </td>
      <td style="padding:14px 20px;border-bottom:1px solid #1e293b;color:#f1f5f9;font-size:14px;line-height:1.6;font-family:Arial,sans-serif;">
        ${value}
      </td>
    </tr>`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>New Customer Enquiry — Vidhaan Farmhouse</title>
</head>
<body style="margin:0;padding:0;background:#0F172A;font-family:Georgia,'Times New Roman',serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.35);">

        <!-- Gold Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#C9A227 0%,#a8861f 50%,#C9A227 100%);padding:36px 32px;text-align:center;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center">
                  <div style="width:64px;height:64px;margin:0 auto 16px;border-radius:50%;background:rgba(15,23,42,0.15);border:2px solid rgba(15,23,42,0.2);line-height:64px;font-size:28px;color:#0F172A;font-weight:bold;font-family:Georgia,serif;">
                    V
                  </div>
                  <p style="margin:0 0 6px;font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#0F172A;font-family:Arial,sans-serif;font-weight:600;">Vidhaan Farmhouse</p>
                  <h1 style="margin:0;font-size:26px;font-weight:400;color:#0F172A;font-family:Georgia,serif;">New Customer Enquiry</h1>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px 28px;background:#FAFAF8;">
            <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#334155;font-family:Arial,sans-serif;">
              A new enquiry has been submitted through the Vidhaan Farmhouse contact form. Please review the details below and respond promptly.
            </p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0F172A;border-radius:12px;overflow:hidden;border:1px solid #1e293b;">
              ${row('Customer Name', `<strong style="color:#ffffff;">${name}</strong>`)}
              ${row('Phone', `<a href="tel:${phone}" style="color:#C9A227;text-decoration:none;">${phone}</a>`)}
              ${row('Email', `<a href="mailto:${email}" style="color:#C9A227;text-decoration:none;">${email}</a>`)}
              ${row('Event Type', eventType)}
              ${row('Preferred Date', preferredDate)}
              ${row('Guests', String(data.guestCount))}
              ${row('Message', `<span style="color:#cbd5e1;">${message}</span>`)}
              ${row('Submitted', submittedDate)}
            </table>
          </td>
        </tr>

        <!-- Dark Footer -->
        <tr>
          <td style="background:#0F172A;padding:28px 32px;text-align:center;border-top:3px solid #C9A227;">
            <p style="margin:0 0 8px;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#C9A227;font-family:Arial,sans-serif;">Vidhaan Farmhouse</p>
            <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-family:Arial,sans-serif;">Chhatarpur, New Delhi · Luxury Estate Retreat</p>
            <p style="margin:12px 0 0;font-size:11px;color:#64748b;font-family:Arial,sans-serif;">
              This is an automated notification. Do not reply directly to this email.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
/** Notify owner of a new contact form enquiry */
async function sendContactEnquiryEmail(data) {
    const transporter = createTransporter();
    const ownerEmail = env_1.env.smtp.ownerEmail;
    if (!transporter) {
        console.log('[Email] Gmail SMTP not configured — skipping contact enquiry notification');
        return false;
    }
    if (!ownerEmail) {
        console.log('[Email] OWNER_EMAIL not set — skipping contact enquiry notification');
        return false;
    }
    try {
        await transporter.sendMail({
            from: `"Vidhaan Farmhouse" <${env_1.env.smtp.from}>`,
            to: ownerEmail,
            replyTo: data.email,
            subject: 'New Customer Enquiry',
            html: contactEnquiryEmailTemplate(data),
        });
        console.log(`[Email] Contact enquiry notification sent to ${ownerEmail}`);
        return true;
    }
    catch (err) {
        console.error('[Email] Failed to send contact enquiry notification:', err);
        return false;
    }
}
//# sourceMappingURL=email.service.js.map