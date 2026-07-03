/** Mirrors `ExpenseResponse.java`. Phase-1: no expense category field. */
export interface ExpenseResponse {
  readonly id: string;
  readonly title: string;
  readonly amount: number;
  readonly expenseDate: string;
  readonly remarks: string | null;
}

/** Mirrors `CreateExpenseRequest.java`. */
export interface CreateExpenseRequest {
  readonly title: string;
  readonly amount: number;
  readonly expenseDate: string;
  readonly remarks?: string | null;
}

/** Mirrors `UpdateExpenseRequest.java` — all fields optional. */
export interface UpdateExpenseRequest {
  readonly title?: string;
  readonly amount?: number;
  readonly expenseDate?: string;
  readonly remarks?: string | null;
}
