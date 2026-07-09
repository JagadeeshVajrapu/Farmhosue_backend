import { sendBookingConfirmationEmail, sendAdminBookingAlert } from './email.service';
import { sendWhatsAppNotification } from './whatsapp.service';

export interface BookingNotificationPayload {
  bookingId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  propertyName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  eventType: string;
  eventName: string;
  paymentMethod: string;
}

/** Fire-and-forget booking notifications — never blocks the API response */
export function notifyBookingCreated(data: BookingNotificationPayload): void {
  Promise.all([
    sendBookingConfirmationEmail(data),
    sendAdminBookingAlert(data),
    sendWhatsAppNotification(data),
  ]).catch((err) => console.error('[Notifications] Unexpected error:', err));
}
