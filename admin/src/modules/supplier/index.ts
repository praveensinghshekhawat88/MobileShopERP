/**
 * Public exports of the supplier module — see 01_AGENTS.md § Module
 * Structure: "index.ts (public exports of the module)".
 */
export { SupplierFormDialog } from '@/modules/supplier/components/SupplierFormDialog';
export {
  useCreateSupplier,
  useDeleteSupplier,
  useUpdateSupplier,
} from '@/modules/supplier/hooks/useSupplierMutations';
export { useSupplier, useSupplierOptions, useSuppliers } from '@/modules/supplier/hooks/useSuppliers';
export { SupplierPage } from '@/modules/supplier/pages/SupplierPage';
export type {
  CreateSupplierRequest,
  SupplierResponse,
  UpdateSupplierRequest,
} from '@/modules/supplier/types/Supplier';
