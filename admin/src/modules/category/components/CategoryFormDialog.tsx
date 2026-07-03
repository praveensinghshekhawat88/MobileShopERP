import { zodResolver } from '@hookform/resolvers/zod';
import type { JSX } from 'react';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormSelect } from '@/components/inputs/FormSelect';
import { FormSwitch } from '@/components/inputs/FormSwitch';
import { FormTextarea } from '@/components/inputs/FormTextarea';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useCreateCategory, useUpdateCategory } from '@/modules/category/hooks/useCategoryMutations';
import { useCategoryOptions } from '@/modules/category/hooks/useCategoryOptions';
import type { CategoryResponse } from '@/modules/category/types/Category';
import {
  CATEGORY_FORM_DEFAULT_VALUES,
  categoryFormSchema,
  ROOT_CATEGORY_OPTION_VALUE,
  type CategoryFormValues,
} from '@/modules/category/validation/categoryValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface CategoryFormDialogProps {
  readonly open: boolean;
  readonly category: CategoryResponse | null;
  readonly onClose: () => void;
}

const FORM_ID = 'category-form';
const ROOT_OPTION_LABEL = '— None (Root Category) —';

/**
 * Create/Edit dialog for the self-referencing Category master — see
 * 04_TASKS.md P03-T002 and AGENTS.md § Category Rule. The parent picker is
 * built from the active category tree with the category itself (and its
 * descendants, when editing) excluded to pre-empt a circular reference.
 */
export function CategoryFormDialog({ open, category, onClose }: CategoryFormDialogProps): JSX.Element {
  const isEditMode = category !== null;
  const { options: parentOptions } = useCategoryOptions(category?.id);
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const isSubmitting = createCategory.isPending || updateCategory.isPending;

  const selectOptions = useMemo(
    () => [{ value: ROOT_CATEGORY_OPTION_VALUE, label: ROOT_OPTION_LABEL }, ...parentOptions],
    [parentOptions]
  );

  const methods = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: CATEGORY_FORM_DEFAULT_VALUES,
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset(
      category
        ? {
            parentId: category.parentId !== null ? String(category.parentId) : ROOT_CATEGORY_OPTION_VALUE,
            name: category.name,
            description: category.description ?? '',
            active: category.active,
          }
        : CATEGORY_FORM_DEFAULT_VALUES
    );
  }, [open, category, methods]);

  const handleSubmit = (values: CategoryFormValues): void => {
    const request = {
      parentId: values.parentId ? Number(values.parentId) : null,
      name: values.name,
      description: values.description?.trim() ? values.description.trim() : null,
      active: values.active,
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    if (isEditMode) {
      updateCategory.mutate({ id: category.id, request }, { onSuccess: onClose, onError });
    } else {
      createCategory.mutate(request, { onSuccess: onClose, onError });
    }
  };

  return (
    <BaseDialog
      open={open}
      title={isEditMode ? 'Edit Category' : 'New Category'}
      onClose={onClose}
      disableBackdropClose
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={isSubmitting}>
            {isEditMode ? 'Save Changes' : 'Create Category'}
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <FormSelect<CategoryFormValues> name="parentId" label="Parent Category" options={selectOptions} />
        <FormTextField<CategoryFormValues> name="name" label="Category Name" autoFocus required />
        <FormTextarea<CategoryFormValues> name="description" label="Description" rows={3} />
        <FormSwitch<CategoryFormValues> name="active" label="Active" />
      </Form>
    </BaseDialog>
  );
}
