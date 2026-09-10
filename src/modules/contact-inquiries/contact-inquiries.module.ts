import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactInquiriesController } from './contact-inquiries.controller.js';
import { ContactInquiriesService } from './contact-inquiries.service.js';
import { contactInquirySchema } from './contact-inquiry.schema.js';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ContactInquiry', schema: contactInquirySchema }])],
  controllers: [ContactInquiriesController],
  providers: [ContactInquiriesService],
})
export class ContactInquiriesModule {}
