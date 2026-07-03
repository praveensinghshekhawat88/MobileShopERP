import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import type { ComponentType } from 'react';

import { ROLES, type RoleName } from '@/common/constants/roles';
import { ROUTE_PATHS } from '@/routes/routePaths';

export interface NavigationItem {
  readonly label: string;
  readonly path: string;
  readonly icon: ComponentType<{ fontSize?: 'small' | 'medium' | 'large' }>;
  /** Roles allowed to see this item — see 01_AGENTS.md § Role & Permission Rules. */
  readonly roles: readonly RoleName[];
}

/**
 * Sidebar navigation registry — see 05_UI_STANDARDS.md § Sidebar: "Role Based
 * Menu." Each ERP module appends its own entry here when it is implemented
 * (see 04_TASKS.md). Brands, Categories and Attributes were added in Phase 03
 * (Masters); list/read is available to both roles, create/edit/delete
 * actions are further hidden per-button via `useAuth().isAdmin` (see
 * 08_SECURITY.md § Role Rules).
 */
export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  {
    label: 'Dashboard',
    path: ROUTE_PATHS.dashboard,
    icon: DashboardOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Brands',
    path: ROUTE_PATHS.brands,
    icon: LocalOfferOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Categories',
    path: ROUTE_PATHS.categories,
    icon: CategoryOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Attributes',
    path: ROUTE_PATHS.attributes,
    icon: TuneOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Products',
    path: ROUTE_PATHS.products,
    icon: Inventory2OutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Customers',
    path: ROUTE_PATHS.customers,
    icon: PeopleOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Suppliers',
    path: ROUTE_PATHS.suppliers,
    icon: LocalShippingOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Purchases',
    path: ROUTE_PATHS.purchases,
    icon: ReceiptLongOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Stock',
    path: ROUTE_PATHS.stock,
    icon: WarehouseOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Stock Movements',
    path: ROUTE_PATHS.stockMovements,
    icon: HistoryOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Sales',
    path: ROUTE_PATHS.sales,
    icon: ShoppingCartOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Repairs',
    path: ROUTE_PATHS.repairs,
    icon: BuildOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Warranties',
    path: ROUTE_PATHS.warranties,
    icon: VerifiedUserOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Expenses',
    path: ROUTE_PATHS.expenses,
    icon: MonetizationOnOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Reports',
    path: ROUTE_PATHS.reports,
    icon: AssessmentOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Users',
    path: ROUTE_PATHS.users,
    icon: ManageAccountsOutlinedIcon,
    roles: [ROLES.ADMIN],
  },
  {
    label: 'Roles',
    path: ROUTE_PATHS.roles,
    icon: AdminPanelSettingsOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
  {
    label: 'Shop Settings',
    path: ROUTE_PATHS.shopSettings,
    icon: SettingsOutlinedIcon,
    roles: [ROLES.ADMIN, ROLES.STAFF],
  },
];
