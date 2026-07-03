import { z } from 'zod';

/** Mirrors backend `ImeiValidator` — `^\d{15}$`. */
const IMEI_REGEX = /^\d{15}$/;

/** Mirrors `UpdateStockRequest.java` — metadata only (not status). */
export const stockMetadataFormSchema = z.object({
  imei: z
    .string()
    .trim()
    .max(30, 'IMEI must be at most 30 characters')
    .refine((value) => value === '' || IMEI_REGEX.test(value), {
      message: 'IMEI must be a 15-digit number',
    }),
  serialNumber: z.string().trim().max(100, 'Serial number must be at most 100 characters').optional(),
});

export type StockMetadataFormValues = z.infer<typeof stockMetadataFormSchema>;

export const STOCK_METADATA_FORM_DEFAULT_VALUES: StockMetadataFormValues = {
  imei: '',
  serialNumber: '',
};
