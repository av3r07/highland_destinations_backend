import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContactInquiriesController } from './contact-inquiries.controller';
import { ContactInquiriesService } from './contact-inquiries.service';
import { contactInquirySchema } from './contact-inquiry.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ContactInquiry', schema: contactInquirySchema }])],
  controllers: [ContactInquiriesController],
  providers: [ContactInquiriesService],
})
export class ContactInquiriesModule {}
