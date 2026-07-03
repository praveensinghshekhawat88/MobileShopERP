import { Skeleton, TableCell, TableRow } from '@mui/material';
import type { JSX } from 'react';
import { Fragment } from 'react';

interface TableSkeletonProps {
  readonly columnCount: number;
  readonly rowCount?: number;
}

/**
 * Loading skeleton for `DataTable` — see 01_AGENTS.md § Table Rules
 * ("Skeleton") and § Loading Rules ("Every Table → Skeleton").
 */
export function TableSkeleton({ columnCount, rowCount = 5 }: TableSkeletonProps): JSX.Element {
  return (
    <Fragment>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: columnCount }, (_, columnIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${columnIndex}`}>
              <Skeleton variant="text" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </Fragment>
  );
}
