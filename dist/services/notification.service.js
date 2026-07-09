"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyBookingCreated = notifyBookingCreated;
const email_service_1 = require("./email.service");
const whatsapp_service_1 = require("./whatsapp.service");
/** Fire-and-forget booking notifications — never blocks the API response */
function notifyBookingCreated(data) {
    Promise.all([
        (0, email_service_1.sendBookingConfirmationEmail)(data),
        (0, email_service_1.sendAdminBookingAlert)(data),
        (0, whatsapp_service_1.sendWhatsAppNotification)(data),
    ]).catch((err) => console.error('[Notifications] Unexpected error:', err));
}
//# sourceMappingURL=notification.service.js.map