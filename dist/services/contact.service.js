"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactService = void 0;
const Contact_1 = require("../models/Contact");
function buildFilter(search, status) {
    const filter = {};
    if (status && status !== 'all') {
        filter.status = status;
    }
    if (search?.trim()) {
        const term = search.trim();
        filter.$or = [
            { name: { $regex: term, $options: 'i' } },
            { email: { $regex: term, $options: 'i' } },
            { phone: { $regex: term, $options: 'i' } },
            { eventType: { $regex: term, $options: 'i' } },
        ];
    }
    return filter;
}
exports.contactService = {
    async createEnquiry(data) {
        const enquiry = await Contact_1.Contact.create({
            ...data,
            status: 'New',
        });
        return enquiry;
    },
    async listEnquiries(params = {}) {
        const page = Math.max(params.page || 1, 1);
        const limit = Math.min(Math.max(params.limit || 10, 1), 100);
        const filter = buildFilter(params.search, params.status);
        const [data, total] = await Promise.all([
            Contact_1.Contact.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit),
            Contact_1.Contact.countDocuments(filter),
        ]);
        return {
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit) || 1,
        };
    },
    async getEnquiryById(id) {
        return Contact_1.Contact.findById(id);
    },
    async updateStatus(id, status) {
        return Contact_1.Contact.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
    },
    async deleteEnquiry(id) {
        const result = await Contact_1.Contact.findByIdAndDelete(id);
        return !!result;
    },
    async exportEnquiries(search, status) {
        const filter = buildFilter(search, status);
        return Contact_1.Contact.find(filter).sort({ createdAt: -1 });
    },
};
//# sourceMappingURL=contact.service.js.map