import { Schema } from 'mongoose';
import type { HydratedDocument } from 'mongoose';

export interface ContactInquiry {
  name: string;
  mobileNumber: string;
  email: string;
  requirements?: string;
  message?: string;
  createdAt: Date;
}

export type ContactInquiryDocument = HydratedDocument<ContactInquiry>;

const contactInquirySchema = new Schema<ContactInquiry>(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    mobileNumber: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    requirements: { type: String, trim: true, maxlength: 2000 },
    message: { type: String, trim: true, maxlength: 2000 },
  },
  { collection: 'contact_inquiries', timestamps: true },
);

export { contactInquirySchema };
