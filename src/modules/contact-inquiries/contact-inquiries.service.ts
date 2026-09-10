import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import type { Model } from 'mongoose';
import type { CreateContactInquiryDto } from './contact-inquiries.dto.js';
import type { ContactInquiry, ContactInquiryDocument } from './contact-inquiry.schema.js';

@Injectable()
export class ContactInquiriesService {
  constructor(
    @InjectModel('ContactInquiry')
    private readonly contactInquiryModel: Model<ContactInquiry>,
  ) {}

  create(dto: CreateContactInquiryDto): Promise<ContactInquiryDocument> {
    return this.contactInquiryModel.create(dto);
  }
}
