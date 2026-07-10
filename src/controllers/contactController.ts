import { Request, Response } from 'express';
import { body, param } from 'express-validator';
import { asyncHandler } from '../middleware/validate';
import { createError } from '../middleware/errorHandler';
import { contactService } from '../services/contact.service';
import { sendContactEnquiryEmail } from '../services/email.service';
import type { ContactStatus } from '../types';

const CONTACT_STATUSES: ContactStatus[] = ['New', 'Contacted', 'Booked', 'Closed'];

const EVENT_TYPES = [
  'weekend-stay',
  'pool-party',
  'birthday',
  'wedding',
  'corporate',
  'family',
  'other',
];

function normalizeIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  const local =
    digits.startsWith('91') && digits.length >= 12
      ? digits.slice(-10)
      : digits.startsWith('0') && digits.length === 11
        ? digits.slice(1)
        : digits.slice(-10);

  return `+91${local}`;
}

function isValidIndianMobile(phone: string): boolean {
  const digits = phone.replace(/\D/g, '').slice(-10);
  return digits.length === 10 && /^[6-9]\d{9}$/.test(digits);
}

export const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .custom((value) => {
      if (!isValidIndianMobile(value)) {
        throw new Error('Enter a valid 10-digit Indian mobile number');
      }
      return true;
    }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('eventType')
    .trim()
    .notEmpty()
    .withMessage('Event type is required')
    .isIn(EVENT_TYPES)
    .withMessage('Invalid event type'),
  body('preferredDate').isISO8601().withMessage('Valid preferred date is required'),
  body('guestCount')
    .isInt({ min: 1, max: 500 })
    .withMessage('Guest count must be between 1 and 500'),
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message must be at least 10 characters'),
];

/** POST /api/contact — submit a new enquiry */
export const createContact = asyncHandler(async (req: Request, res: Response) => {
  const { name, phone, email, eventType, preferredDate, guestCount, message } = req.body;

  const preferred = new Date(preferredDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (preferred < today) {
    throw createError('Preferred date cannot be in the past', 400);
  }

  const enquiry = await contactService.createEnquiry({
    name,
    phone: normalizeIndianPhone(phone),
    email,
    eventType,
    preferredDate: preferred,
    guestCount,
    message,
  });

  // Send owner notification — non-blocking; enquiry is already saved
  const emailSent = await sendContactEnquiryEmail({
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

export const statusValidation = [
  param('id').isMongoId().withMessage('Invalid enquiry ID'),
  body('status')
    .isIn(CONTACT_STATUSES)
    .withMessage(`Status must be one of: ${CONTACT_STATUSES.join(', ')}`),
];

const formatCsvValue = (value: string | number | Date): string => {
  const str = value instanceof Date ? value.toISOString() : String(value);
  return `"${str.replace(/"/g, '""')}"`;
};

/** GET /api/contact — admin list with search, filter, pagination */
export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const search = (req.query.search as string) || '';
  const status = (req.query.status as string) || 'all';

  const result = await contactService.listEnquiries({ page, limit, search, status });

  res.json({
    success: true,
    ...result,
  });
});

/** GET /api/contact/export — CSV export */
export const exportContacts = asyncHandler(async (req: Request, res: Response) => {
  const search = (req.query.search as string) || '';
  const status = (req.query.status as string) || 'all';

  const enquiries = await contactService.exportEnquiries(search, status);

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

  const rows = enquiries.map((e) =>
    [
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
      .join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="customer-enquiries.csv"');
  res.send(csv);
});

/** GET /api/contact/:id — view single enquiry */
export const getContactById = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const enquiry = await contactService.getEnquiryById(id);

  if (!enquiry) {
    throw createError('Enquiry not found', 404);
  }

  res.json({ success: true, data: enquiry });
});

/** PATCH /api/contact/:id/status — update status */
export const updateContactStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const enquiry = await contactService.updateStatus(id, req.body.status);

  if (!enquiry) {
    throw createError('Enquiry not found', 404);
  }

  res.json({
    success: true,
    message: 'Status updated successfully',
    data: enquiry,
  });
});

/** DELETE /api/contact/:id — delete enquiry */
export const deleteContact = asyncHandler(async (req: Request, res: Response) => {
  const id = String(req.params.id);
  const deleted = await contactService.deleteEnquiry(id);

  if (!deleted) {
    throw createError('Enquiry not found', 404);
  }

  res.json({ success: true, message: 'Enquiry deleted successfully' });
});
