"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWhatsAppNotification = sendWhatsAppNotification;
const env_1 = require("../config/env");
function formatBookingMessage(data) {
    return [
        '🏡 *New Vidhaan Farmhouse Booking*',
        '',
        `📋 Booking ID: *${data.bookingId}*`,
        `👤 Guest: ${data.guestName}`,
        `📞 Phone: ${data.guestPhone}`,
        `🏠 Property: ${data.propertyName}`,
        `🎉 Event: ${data.eventName}`,
        `📅 ${data.checkIn} → ${data.checkOut}`,
        `👥 Guests: ${data.guests}`,
        `💰 Total: ₹${data.totalPrice.toLocaleString('en-IN')}`,
        '',
        '_Please confirm availability within 24 hours._',
    ].join('\n');
}
/** Send WhatsApp via Twilio API if configured, otherwise log for dev */
async function sendWhatsAppNotification(data) {
    const message = formatBookingMessage(data);
    if (env_1.env.twilio.isConfigured) {
        try {
            const auth = Buffer.from(`${env_1.env.twilio.accountSid}:${env_1.env.twilio.authToken}`).toString('base64');
            const to = `whatsapp:${env_1.env.whatsapp.adminPhone}`;
            const from = env_1.env.twilio.whatsappFrom;
            const body = new URLSearchParams({
                To: to,
                From: from,
                Body: message,
            });
            const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${env_1.env.twilio.accountSid}/Messages.json`, {
                method: 'POST',
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: body.toString(),
            });
            if (!res.ok) {
                const err = await res.text();
                console.error('[WhatsApp] Twilio error:', err);
                return false;
            }
            return true;
        }
        catch (err) {
            console.error('[WhatsApp] Twilio request failed:', err);
            return false;
        }
    }
    if (env_1.env.whatsapp.webhookUrl) {
        try {
            await fetch(env_1.env.whatsapp.webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message, phone: env_1.env.whatsapp.adminPhone }),
            });
            return true;
        }
        catch (err) {
            console.error('[WhatsApp] Webhook failed:', err);
            return false;
        }
    }
    console.log('[WhatsApp - dev mode]\n', message);
    return true;
}
//# sourceMappingURL=whatsapp.service.js.map