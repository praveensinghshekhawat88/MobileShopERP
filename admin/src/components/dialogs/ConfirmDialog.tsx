import { Button, Typography } from '@mui/material';
import type { JSX } from 'react';

import { AppButton, type AppButtonVariant } from '@/components/buttons/AppButton';
import { BaseDialog } from '@/components/dialogs/BaseDialog';

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly confirmVariant?: AppButtonVariant;
  readonly loading?: boolean;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

/**
 * Reusable confirmation dialog — see 01_AGENTS.md § Dialog Rules and
 * 05_UI_STANDARDS.md § Confirmation Dialog: "Delete, Cancel Purchase,
 * Complete Sale, Mark Repair Complete. Always ask confirmation."
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'danger',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps): JSX.Element {
  return (
    <BaseDialog
      open={open}
      title={title}
      onClose={onCancel}
      maxWidth="xs"
      actions={
        <>
          <Button variant="text" color="inherit" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <AppButton appVariant={confirmVariant} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </AppButton>
        </>
      }
    >
      <Typography variant="body1">{message}</Typography>
    </BaseDialog>
  );
}
