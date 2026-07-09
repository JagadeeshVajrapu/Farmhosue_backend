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
export declare function notifyBookingCreated(data: BookingNotificationPayload): void;
//# sourceMappingURL=notification.service.d.ts.map