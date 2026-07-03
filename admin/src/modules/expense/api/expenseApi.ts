/** Raw endpoint paths for the Expense module — see `ExpenseController.java`. */
export const EXPENSE_API = {
  base: '/expenses',
  byId: (id: string) => `/expenses/${id}`,
} as const;
