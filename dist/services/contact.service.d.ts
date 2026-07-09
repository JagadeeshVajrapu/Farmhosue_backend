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
export declare const contactService: {
    createEnquiry(data: CreateContactInput): Promise<IContact>;
    listEnquiries(params?: ListContactsParams): Promise<PaginatedContacts>;
    getEnquiryById(id: string): Promise<IContact | null>;
    updateStatus(id: string, status: ContactStatus): Promise<IContact | null>;
    deleteEnquiry(id: string): Promise<boolean>;
    exportEnquiries(search?: string, status?: string): Promise<IContact[]>;
};
//# sourceMappingURL=contact.service.d.ts.map