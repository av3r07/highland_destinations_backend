import { Body, Controller, Post } from '@nestjs/common';
import { validateCreateContactInquiry } from './contact-inquiries.dto';
import { ContactInquiriesService } from './contact-inquiries.service';

@Controller('contact-inquiries')
export class ContactInquiriesController {
  constructor(private readonly contactInquiriesService: ContactInquiriesService) {}

  @Post()
  async create(@Body() body: unknown) {
    const dto = validateCreateContactInquiry(body);
    const inquiry = await this.contactInquiriesService.create(dto);
    return {
      data: {
        id: inquiry._id.toString(),
        name: inquiry.name,
        mobileNumber: inquiry.mobileNumber,
        email: inquiry.email,
        requirements: inquiry.requirements,
        message: inquiry.message,
        createdAt: inquiry.createdAt,
      },
    };
  }
}
