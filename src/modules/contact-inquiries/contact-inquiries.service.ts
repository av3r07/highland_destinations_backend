import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateContactInquiryDto } from './contact-inquiries.dto';
import { ContactInquiry, ContactInquiryDocument } from './contact-inquiry.schema';

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
