import { z } from 'zod';

export const expenseFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(200, 'Title must be at most 200 characters'),
  amount: z.number().min(0.01, 'Amount must be at least 0.01'),
  expenseDate: z.string().min(1, 'Expense date is required'),
  remarks: z.string().trim().max(2000, 'Remarks must be at most 2000 characters').optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export const EXPENSE_FORM_DEFAULT_VALUES: ExpenseFormValues = {
  title: '',
  amount: 0,
  expenseDate: new Date().toISOString().slice(0, 10),
  remarks: '',
};
