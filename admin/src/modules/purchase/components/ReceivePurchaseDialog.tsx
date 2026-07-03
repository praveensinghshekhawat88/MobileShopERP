import { zodResolver } from '@hookform/resolvers/zod';
import { Divider, Stack, Typography } from '@mui/material';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { AppButton } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';
import { Form } from '@/components/form/Form';
import { FormTextField } from '@/components/inputs/FormTextField';
import { useProductVariantOptions } from '@/modules/product';
import { useReceivePurchase } from '@/modules/purchase/hooks/usePurchaseMutations';
import type { PurchaseItemResponse } from '@/modules/purchase/types/Purchase';
import {
  receivePurchaseFormSchema,
  type ReceivePurchaseFormValues,
} from '@/modules/purchase/validation/receivePurchaseValidation';
import { getApiErrorMessage } from '@/utils/apiError';
import { applyServerValidationErrors } from '@/utils/formErrors';
import { showErrorToast } from '@/utils/toast';

interface ReceivePurchaseDialogProps {
  readonly open: boolean;
  readonly purchaseId: string;
  readonly items: readonly PurchaseItemResponse[];
  readonly onClose: () => void;
}

const FORM_ID = 'receive-purchase-form';

/**
 * Receive dialog — see 04_TASKS.md P06-T001 and AGENTS.md § Stock Rule.
 * Must include every line item; IMEIs are optional per line (blank = accessory
 * stock) but if provided must match quantity exactly.
 */
export function ReceivePurchaseDialog({
  open,
  purchaseId,
  items,
  onClose,
}: ReceivePurchaseDialogProps): JSX.Element {
  const { skuById } = useProductVariantOptions();
  const receivePurchase = useReceivePurchase();

  const methods = useForm<ReceivePurchaseFormValues>({
    resolver: zodResolver(receivePurchaseFormSchema),
    defaultValues: { lines: [] },
  });

  useEffect(() => {
    if (!open) {
      return;
    }
    methods.reset({
      lines: items.map((item) => ({
        purchaseItemId: item.id,
        variantLabel: skuById.get(item.variantId) ?? item.variantId,
        quantity: item.quantity,
        imeis: Array.from({ length: item.quantity }, () => ''),
      })),
    });
  }, [open, items, skuById, methods]);

  const handleSubmit = (values: ReceivePurchaseFormValues): void => {
    const request = {
      lines: values.lines.map((line) => ({
        purchaseItemId: line.purchaseItemId,
        imeis: line.imeis.every((imei) => !imei.trim())
          ? undefined
          : line.imeis.map((imei) => imei.trim()),
      })),
    };

    const onError = (error: unknown): void => {
      const handledAsFieldErrors = applyServerValidationErrors(error, methods.setError);
      if (!handledAsFieldErrors) {
        showErrorToast(getApiErrorMessage(error));
      }
    };

    receivePurchase.mutate({ id: purchaseId, request }, { onSuccess: onClose, onError });
  };

  const lines = useWatch({ control: methods.control, name: 'lines' }) ?? [];

  return (
    <BaseDialog
      open={open}
      title="Receive Purchase"
      onClose={onClose}
      disableBackdropClose
      maxWidth="md"
      actions={
        <>
          <AppButton appVariant="secondary" onClick={onClose} disabled={receivePurchase.isPending}>
            Cancel
          </AppButton>
          <AppButton type="submit" form={FORM_ID} appVariant="primary" loading={receivePurchase.isPending}>
            Receive & Create Stock
          </AppButton>
        </>
      }
    >
      <Form id={FORM_ID} methods={methods} onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Typography variant="body2" color="text.secondary">
            Receiving creates one stock record per unit. Enter 15-digit IMEIs for serialized items, or
            leave all IMEI fields blank for accessories.
          </Typography>

          {lines.map((line, lineIndex) => (
            <Stack key={line.purchaseItemId} spacing={1.5}>
              <Typography variant="subtitle2" fontWeight={600}>
                {line.variantLabel} — Qty {line.quantity}
              </Typography>
              {line.imeis.map((_imei, imeiIndex) => (
                <FormTextField<ReceivePurchaseFormValues>
                  key={`${line.purchaseItemId}-${imeiIndex}`}
                  name={`lines.${lineIndex}.imeis.${imeiIndex}`}
                  label={`IMEI ${imeiIndex + 1} (optional)`}
                />
              ))}
              {lineIndex < lines.length - 1 ? <Divider /> : null}
            </Stack>
          ))}
        </Stack>
      </Form>
    </BaseDialog>
  );
}
