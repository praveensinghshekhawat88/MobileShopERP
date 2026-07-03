import { z } from 'zod';

export const repairFormSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  stockId: z.string().optional(),
  issueDescription: z
    .string()
    .trim()
    .max(5000, 'Issue description must be at most 5000 characters')
    .optional(),
  estimatedCost: z.number().min(0, 'Estimated cost cannot be negative').optional(),
  actualCost: z.number().min(0, 'Actual cost cannot be negative').optional(),
});

export type RepairFormValues = z.infer<typeof repairFormSchema>;

export const REPAIR_FORM_DEFAULT_VALUES: RepairFormValues = {
  customerId: '',
  stockId: '__external__',
  issueDescription: '',
  estimatedCost: undefined,
  actualCost: undefined,
};
