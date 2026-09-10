import type { Model } from 'mongoose';
import type { CreateContactInquiryDto } from './contact-inquiries.dto.js';
import type { ContactInquiry, ContactInquiryDocument } from './contact-inquiry.schema.js';

export class ContactInquiriesService {
  constructor(private readonly contactInquiryModel: Model<ContactInquiry>) {}

  create(dto: CreateContactInquiryDto): Promise<ContactInquiryDocument> {
    return this.contactInquiryModel.create(dto);
  }
}
