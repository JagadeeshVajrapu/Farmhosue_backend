"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContact = exports.updateContactStatus = exports.getContactById = exports.exportContacts = exports.getContacts = exports.statusValidation = exports.createContact = exports.contactValidation = void 0;
const express_validator_1 = require("express-validator");
const validate_1 = require("../middleware/validate");
const errorHandler_1 = require("../middleware/errorHandler");
const contact_service_1 = require("../services/contact.service");
const email_service_1 = require("../services/email.service");
const CONTACT_STATUSES = ['New', 'Contacted', 'Booked', 'Closed'];
const EVENT_TYPES = [
    'weekend-stay',
    'pool-party',
    'birthday',
    'wedding',
    'corporate',
    'family',
    'other',
];
exports.contactValidation = [
    (0, express_validator_1.body)('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
    (0, express_validator_1.body)('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required')
        .matches(/^[+\d\s-]+$/)
        .withMessage('Invalid phone number'),
    (0, express_validator_1.body)('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    (0, express_validator_1.body)('eventType')
        .trim()
        .notEmpty()
        .withMessage('Event type is required')
        .isIn(EVENT_TYPES)
        .withMessage('Invalid event type'),
    (0, express_validator_1.body)('preferredDate').isISO8601().withMessage('Valid preferred date is required'),
    (0, express_validator_1.body)('guestCount')
        .isInt({ min: 1, max: 500 })
        .withMessage('Guest count must be between 1 and 500'),
    (0, express_validator_1.body)('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required')
        .isLength({ min: 10 })
        .withMessage('Message must be at least 10 characters'),
];
/** POST /api/contact — submit a new enquiry */
exports.createContact = (0, validate_1.asyncHandler)(async (req, res) => {
    const { name, phone, email, eventType, preferredDate, guestCount, message } = req.body;
    const preferred = new Date(preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (preferred < today) {
        throw (0, errorHandler_1.createError)('Preferred date cannot be in the past', 400);
    }
    const enquiry = await contact_service_1.contactService.createEnquiry({
        name,
        phone,
        email,
        eventType,
        preferredDate: preferred,
        guestCount,
        message,
    });
    // Send owner notification — non-blocking; enquiry is already saved
    const emailSent = await (0, email_service_1.sendContactEnquiryEmail)({
        name: enquiry.name,
        phone: enquiry.phone,
        email: enquiry.email,
        eventType: enquiry.eventType,
        preferredDate: enquiry.preferredDate,
        guestCount: enquiry.guestCount,
        message: enquiry.message,
        submittedAt: enquiry.createdAt,
    }).catch((err) => {
        console.error('[Contact] Email notification error:', err);
        return false;
    });
    res.status(201).json({
        success: true,
        message: 'Your enquiry has been submitted successfully. Our team will respond shortly.',
        data: {
            id: enquiry._id,
            name: enquiry.name,
            email: enquiry.email,
            eventType: enquiry.eventType,
            preferredDate: enquiry.preferredDate,
            guestCount: enquiry.guestCount,
            status: enquiry.status,
            createdAt: enquiry.createdAt,
        },
        emailSent,
    });
});
exports.statusValidation = [
    (0, express_validator_1.param)('id').isMongoId().withMessage('Invalid enquiry ID'),
    (0, express_validator_1.body)('status')
        .isIn(CONTACT_STATUSES)
        .withMessage(`Status must be one of: ${CONTACT_STATUSES.join(', ')}`),
];
const formatCsvValue = (value) => {
    const str = value instanceof Date ? value.toISOString() : String(value);
    return `"${str.replace(/"/g, '""')}"`;
};
/** GET /api/contact — admin list with search, filter, pagination */
exports.getContacts = (0, validate_1.asyncHandler)(async (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const result = await contact_service_1.contactService.listEnquiries({ page, limit, search, status });
    res.json({
        success: true,
        ...result,
    });
});
/** GET /api/contact/export — CSV export */
exports.exportContacts = (0, validate_1.asyncHandler)(async (req, res) => {
    const search = req.query.search || '';
    const status = req.query.status || 'all';
    const enquiries = await contact_service_1.contactService.exportEnquiries(search, status);
    const headers = [
        'Name',
        'Phone',
        'Email',
        'Event Type',
        'Preferred Date',
        'Guests',
        'Message',
        'Status',
        'Submitted Date',
    ];
    const rows = enquiries.map((e) => [
        e.name,
        e.phone,
        e.email,
        e.eventType,
        e.preferredDate,
        e.guestCount,
        e.message,
        e.status,
        e.createdAt,
    ]
        .map(formatCsvValue)
        .join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="customer-enquiries.csv"');
    res.send(csv);
});
/** GET /api/contact/:id — view single enquiry */
exports.getContactById = (0, validate_1.asyncHandler)(async (req, res) => {
    const id = String(req.params.id);
    const enquiry = await contact_service_1.contactService.getEnquiryById(id);
    if (!enquiry) {
        throw (0, errorHandler_1.createError)('Enquiry not found', 404);
    }
    res.json({ success: true, data: enquiry });
});
/** PATCH /api/contact/:id/status — update status */
exports.updateContactStatus = (0, validate_1.asyncHandler)(async (req, res) => {
    const id = String(req.params.id);
    const enquiry = await contact_service_1.contactService.updateStatus(id, req.body.status);
    if (!enquiry) {
        throw (0, errorHandler_1.createError)('Enquiry not found', 404);
    }
    res.json({
        success: true,
        message: 'Status updated successfully',
        data: enquiry,
    });
});
/** DELETE /api/contact/:id — delete enquiry */
exports.deleteContact = (0, validate_1.asyncHandler)(async (req, res) => {
    const id = String(req.params.id);
    const deleted = await contact_service_1.contactService.deleteEnquiry(id);
    if (!deleted) {
        throw (0, errorHandler_1.createError)('Enquiry not found', 404);
    }
    res.json({ success: true, message: 'Enquiry deleted successfully' });
});
//# sourceMappingURL=contactController.js.map