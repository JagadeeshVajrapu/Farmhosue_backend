interface WhatsAppBookingData {
    bookingId: string;
    guestName: string;
    guestPhone: string;
    propertyName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    eventName: string;
}
/** Send WhatsApp via Twilio API if configured, otherwise log for dev */
export declare function sendWhatsAppNotification(data: WhatsAppBookingData): Promise<boolean>;
export {};
//# sourceMappingURL=whatsapp.service.d.ts.map