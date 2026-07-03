import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import type { ComponentType, JSX } from 'react';

type StatCardColor = 'primary' | 'error' | 'warning' | 'success' | 'info';

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly icon: ComponentType<{ fontSize?: 'small' | 'medium' | 'large'; color?: StatCardColor }>;
  readonly iconColor?: StatCardColor;
  readonly loading?: boolean;
}

/**
 * Generic dashboard statistic card — see 05_UI_STANDARDS.md § Dashboard:
 * "Cards" and 04_TASKS.md P02-T001 (Statistics Cards). Every stat widget
 * composes this instead of a bespoke `Card`.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor = 'primary',
  loading = false,
}: StatCardProps): JSX.Element {
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack spacing={1.5} alignItems="flex-start">
          <Icon color={iconColor} fontSize="large" />
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {loading ? (
            <Skeleton variant="text" width={96} height={36} />
          ) : (
            <Typography variant="h5" fontWeight={700}>
              {value}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
