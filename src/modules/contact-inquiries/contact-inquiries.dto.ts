import Joi from 'joi';
import { HttpError } from '../../common/filters/global-exception.filter.js';

export interface CreateContactInquiryDto {
  name: string;
  mobileNumber: string;
  email: string;
  requirements?: string;
  message?: string;
}

const createContactInquirySchema = Joi.object<CreateContactInquiryDto>({
  name: Joi.string().trim().max(100).required(),
  mobileNumber: Joi.string().trim().max(30).required(),
  email: Joi.string().email().max(254).required(),
  requirements: Joi.string().trim().max(2000).optional(),
  message: Joi.string().trim().max(2000).optional(),
}).unknown(false);

export function validateCreateContactInquiry(value: unknown): CreateContactInquiryDto {
  const result = createContactInquirySchema.validate(value, { abortEarly: false });
  if (result.error) {
    throw new HttpError(
      400,
      'Request validation failed',
      result.error.details.map((detail) => detail.message),
    );
  }
  return result.value;
}
