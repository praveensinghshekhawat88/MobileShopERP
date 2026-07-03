import Grid from '@mui/material/Grid2';
import { Children, type JSX, type ReactNode } from 'react';

interface ReportStatGridProps {
  readonly children: ReactNode;
}

/** Responsive grid wrapper for report summary stat cards. */
export function ReportStatGrid({ children }: ReportStatGridProps): JSX.Element {
  return (
    <Grid container spacing={2}>
      {Children.toArray(children).map((child, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
}
