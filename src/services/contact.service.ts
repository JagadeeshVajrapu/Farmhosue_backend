import { Contact } from '../models/Contact';
import type { ContactStatus, CreateContactInput, IContact } from '../types';

export interface ListContactsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface PaginatedContacts {
  data: IContact[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

function buildFilter(search?: string, status?: string) {
  const filter: Record<string, unknown> = {};

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

export const contactService = {
  async createEnquiry(data: CreateContactInput): Promise<IContact> {
    const enquiry = await Contact.create({
      ...data,
      status: 'New',
    });
    return enquiry;
  },

  async listEnquiries(params: ListContactsParams = {}): Promise<PaginatedContacts> {
    const page = Math.max(params.page || 1, 1);
    const limit = Math.min(Math.max(params.limit || 10, 1), 100);
    const filter = buildFilter(params.search, params.status);

    const [data, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Contact.countDocuments(filter),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  },

  async getEnquiryById(id: string): Promise<IContact | null> {
    return Contact.findById(id);
  },

  async updateStatus(id: string, status: ContactStatus): Promise<IContact | null> {
    return Contact.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
  },

  async deleteEnquiry(id: string): Promise<boolean> {
    const result = await Contact.findByIdAndDelete(id);
    return !!result;
  },

  async exportEnquiries(search?: string, status?: string): Promise<IContact[]> {
    const filter = buildFilter(search, status);
    return Contact.find(filter).sort({ createdAt: -1 });
  },
};
