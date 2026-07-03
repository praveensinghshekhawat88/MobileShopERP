import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  type DialogProps,
} from '@mui/material';
import type { JSX, ReactNode } from 'react';

interface BaseDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
  readonly maxWidth?: DialogProps['maxWidth'];
  readonly disableBackdropClose?: boolean;
}

/**
 * The one reusable dialog shell — see 01_AGENTS.md § Dialog Rules: "Every
 * CRUD operation must use Dialogs... Dialogs must be reusable. Never
 * duplicate dialog code." Also see 05_UI_STANDARDS.md § Dialogs: Header,
 * Body, Footer, Escape closes, Backdrop closes only if safe.
 *
 * Every module's create/edit/view/delete dialog should compose this shell
 * rather than building a bespoke `<Dialog>` from scratch.
 */
export function BaseDialog({
  open,
  title,
  onClose,
  children,
  actions,
  maxWidth = 'sm',
  disableBackdropClose = false,
}: BaseDialogProps): JSX.Element {
  const handleClose = (_event: object, reason: 'backdropClick' | 'escapeKeyDown'): void => {
    if (reason === 'backdropClick' && disableBackdropClose) {
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth={maxWidth}
      scroll="paper"
      aria-labelledby="base-dialog-title"
    >
      <DialogTitle
        id="base-dialog-title"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        {title}
        <IconButton aria-label="Close dialog" onClick={onClose} size="small" edge="end">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
}
