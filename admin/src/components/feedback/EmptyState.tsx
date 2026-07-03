import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined';
import { Box, Stack, Typography } from '@mui/material';
import type { JSX, ReactNode } from 'react';

interface EmptyStateProps {
  readonly title: string;
  readonly description?: string;
  readonly action?: ReactNode;
  readonly icon?: ReactNode;
}

/**
 * Generic empty state — see 05_UI_STANDARDS.md § Empty State:
 * "Illustration, Title, Description, Primary Action."
 * Example usage: `<EmptyState title="No Products Found" action={<AppButton>Add Product</AppButton>} />`
 */
export function EmptyState({ title, description, action, icon }: EmptyStateProps): JSX.Element {
  return (
    <Box display="flex" justifyContent="center" width="100%" py={8}>
      <Stack spacing={2} alignItems="center" textAlign="center" maxWidth={360}>
        <Box color="text.secondary" fontSize={48} lineHeight={0}>
          {icon ?? <InboxOutlinedIcon fontSize="inherit" />}
        </Box>
        <Typography variant="h6" component="p">
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        ) : null}
        {action}
      </Stack>
    </Box>
  );
}
