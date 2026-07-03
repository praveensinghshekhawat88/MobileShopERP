import { z } from 'zod';

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

export const applicationSettingsFormSchema = z.object({
  companyName: z.string().trim().max(200, 'Company name must be at most 200 characters').optional(),
  ownerName: z.string().trim().max(150, 'Owner name must be at most 150 characters').optional(),
  gstNumber: z
    .string()
    .trim()
    .max(20, 'GST number must be at most 20 characters')
    .refine((value) => value === '' || GST_REGEX.test(value.toUpperCase()), {
      message: 'Enter a valid GST number (e.g. 22AAAAA0000A1Z5)',
    }),
  mobile: z.string().trim().max(15, 'Mobile must be at most 15 characters').optional(),
  email: z.union([
    z.literal(''),
    z.string().trim().max(150, 'Email must be at most 150 characters').email('Enter a valid email address'),
  ]),
  address: z.string().trim().optional(),
  logo: z.string().trim().optional(),
  invoicePrefix: z.string().trim().max(20, 'Invoice prefix must be at most 20 characters').optional(),
});

export type ApplicationSettingsFormValues = z.infer<typeof applicationSettingsFormSchema>;

export const APPLICATION_SETTINGS_FORM_DEFAULT_VALUES: ApplicationSettingsFormValues = {
  companyName: '',
  ownerName: '',
  gstNumber: '',
  mobile: '',
  email: '',
  address: '',
  logo: '',
  invoicePrefix: '',
};
