import { z } from 'zod';

export const leadFormSchema = z.object({
  startup_name: z
    .string()
    .min(2, { message: 'Startup name must be at least 2 characters long' })
    .max(100, { message: 'Startup name is too long' }),
  team_lead_name: z
    .string()
    .min(2, { message: 'Team lead name must be at least 2 characters long' })
    .max(100, { message: 'Team lead name is too long' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Please enter a valid phone or WhatsApp number' })
    .max(20, { message: 'Phone number format invalid' }),
  institution: z
    .string()
    .min(2, { message: 'Please specify your university or organization' }),
  city: z
    .string()
    .min(2, { message: 'Please specify your city' }),
  startup_logo_url: z
    .string()
    .optional(),
  website_url: z
    .string()
    .url({ message: 'Please enter a valid URL (e.g. https://...)' })
    .or(z.literal(''))
    .optional(),
  applied_on_official_link: z
    .enum(['Yes', 'No'], {
      required_error: 'Please select whether you applied on the official link',
    }),
  official_link_clicked: z
    .boolean()
    .optional(),
  contact_consent: z
    .boolean()
    .refine((val) => val === true, {
      message: 'You must agree to allow the organizing team to contact you regarding your application.',
    }),
  promotional_consent: z
    .boolean(),
});

export type LeadFormSchemaType = z.infer<typeof leadFormSchema>;
