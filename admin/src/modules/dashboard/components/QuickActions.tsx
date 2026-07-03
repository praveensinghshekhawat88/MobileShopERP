import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import { Card, CardContent, Stack, Tooltip, Typography } from '@mui/material';
import type { ComponentType, JSX } from 'react';

import { AppButton } from '@/components/buttons/AppButton';

interface QuickAction {
  readonly label: string;
  readonly icon: ComponentType<{ fontSize?: 'small' }>;
}

const QUICK_ACTIONS: readonly QuickAction[] = [
  { label: 'New Sale', icon: AddShoppingCartOutlinedIcon },
  { label: 'New Purchase', icon: LocalShippingOutlinedIcon },
  { label: 'New Customer', icon: PersonAddAltOutlinedIcon },
  { label: 'New Product', icon: Inventory2OutlinedIcon },
  { label: 'New Expense', icon: ReceiptLongOutlinedIcon },
];

/**
 * See 04_TASKS.md P02-T007 (Quick Actions). The target create screens
 * (Sales, Purchase, Business/Customer, Product, Utility/Expense) ship in
 * later phases per the locked module order (see 01_AGENTS.md § Module
 * Order: "Never skip module order"). Rendering them disabled with an
 * explanatory tooltip avoids routing to a non-existent screen or faking
 * navigation (see 01_AGENTS.md § "Never... Leave Incomplete Methods...
 * Generate Fake Business Logic"). Replace `disabled` with real navigation
 * as each module's create route ships.
 */
export function QuickActions(): JSX.Element {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Quick Actions
        </Typography>
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
            <Tooltip key={label} title="Available once this module is implemented">
              <span>
                <AppButton appVariant="secondary" startIcon={<Icon fontSize="small" />} disabled>
                  {label}
                </AppButton>
              </span>
            </Tooltip>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
