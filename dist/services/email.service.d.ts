interface BookingEmailData {
    bookingId: string;
    guestName: string;
    guestEmail: string;
    propertyName: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
    eventType: string;
    eventName: string;
    paymentMethod: string;
}
export declare function sendBookingConfirmationEmail(data: BookingEmailData): Promise<boolean>;
export declare function sendAdminBookingAlert(data: BookingEmailData): Promise<boolean>;
export interface ContactEnquiryEmailData {
    name: string;
    phone: string;
    email: string;
    eventType: string;
    preferredDate: Date;
    guestCount: number;
    message: string;
    submittedAt: Date;
}
/** Notify owner of a new contact form enquiry */
export declare function sendContactEnquiryEmail(data: ContactEnquiryEmailData): Promise<boolean>;
export {};
//# sourceMappingURL=email.service.d.ts.map