import { z } from 'zod';

/** Mirrors backend `ImeiValidator` — 15-digit IMEI enforced on metadata update; recommended on receive. */
const IMEI_REGEX = /^\d{15}$/;

const receiveLineSchema = z
  .object({
    purchaseItemId: z.string().min(1),
    variantLabel: z.string(),
    quantity: z.number().int().min(1),
    imeis: z.array(z.string().trim()),
  })
  .superRefine((line, ctx) => {
    if (line.imeis.length !== line.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Provide exactly ${line.quantity} IMEI field(s) for this line`,
        path: ['imeis'],
      });
      return;
    }
    const nonBlank = line.imeis.filter((imei) => imei.length > 0);
    if (nonBlank.length === 0) {
      return;
    }
    if (nonBlank.length !== line.quantity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either leave all IMEIs blank (accessories) or fill every IMEI for this line',
        path: ['imeis'],
      });
      return;
    }
    line.imeis.forEach((imei, index) => {
      if (!IMEI_REGEX.test(imei)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'IMEI must be a 15-digit number',
          path: ['imeis', index],
        });
      }
    });
    const unique = new Set(nonBlank);
    if (unique.size !== nonBlank.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Duplicate IMEI in this line',
        path: ['imeis'],
      });
    }
  });

export const receivePurchaseFormSchema = z.object({
  lines: z.array(receiveLineSchema).min(1, 'At least one line item is required'),
});

export type ReceivePurchaseFormValues = z.infer<typeof receivePurchaseFormSchema>;

export type ReceivePurchaseLineFormValues = z.infer<typeof receiveLineSchema>;
