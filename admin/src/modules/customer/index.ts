/**
 * Public exports of the customer module — see 01_AGENTS.md § Module
 * Structure: "index.ts (public exports of the module)".
 */
export { CustomerFormDialog } from '@/modules/customer/components/CustomerFormDialog';
export {
  useCreateCustomer,
  useDeleteCustomer,
  useUpdateCustomer,
} from '@/modules/customer/hooks/useCustomerMutations';
export { useCustomer, useCustomerOptions, useCustomers } from '@/modules/customer/hooks/useCustomers';
export { CustomerPage } from '@/modules/customer/pages/CustomerPage';
export type {
  CreateCustomerRequest,
  CustomerResponse,
  UpdateCustomerRequest,
} from '@/modules/customer/types/Customer';
