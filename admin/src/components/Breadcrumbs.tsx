import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import type { JSX } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export interface BreadcrumbItem {
  readonly label: string;
  readonly to?: string;
}

interface BreadcrumbsProps {
  readonly items: readonly BreadcrumbItem[];
}

/**
 * Reusable breadcrumb trail — see 01_AGENTS.md § Page Structure ("Topbar →
 * Breadcrumb → Toolbar...") and 05_UI_STANDARDS.md § Breadcrumb: "Every page
 * must display breadcrumb." Example: Dashboard → Products → Create Product.
 */
export function Breadcrumbs({ items }: BreadcrumbsProps): JSX.Element {
  return (
    <MuiBreadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        if (isLast || !item.to) {
          return (
            <Typography key={item.label} color="text.primary" variant="body2">
              {item.label}
            </Typography>
          );
        }
        return (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.to}
            underline="hover"
            color="inherit"
            variant="body2"
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
}
