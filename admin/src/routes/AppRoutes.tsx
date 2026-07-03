import { lazy, Suspense, type JSX } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { RequireRole } from '@/auth/RequireRole';
import { ROLES } from '@/common/constants/roles';
import { PageLoader } from '@/components/loading/PageLoader';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthLayout } from '@/layouts/AuthLayout';
import { ROUTE_PATHS } from '@/routes/routePaths';

/**
 * Every route is centralized here — see 01_AGENTS.md § Routing: "No inline
 * route definitions." Every page is lazy loaded — see 09_PERFORMANCE.md
 * § Code Splitting: "Every major page must be lazy loaded."
 */
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const ForgotPasswordPage = lazy(() =>
  import('@/pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const DashboardPage = lazy(() =>
  import('@/pages/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const ProfilePage = lazy(() =>
  import('@/pages/ProfilePage').then((m) => ({ default: m.ProfilePage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const BrandPage = lazy(() => import('@/modules/brand').then((m) => ({ default: m.BrandPage })));
const CategoryPage = lazy(() =>
  import('@/modules/category').then((m) => ({ default: m.CategoryPage }))
);
const AttributePage = lazy(() =>
  import('@/modules/attribute').then((m) => ({ default: m.AttributePage }))
);
const ProductPage = lazy(() => import('@/modules/product').then((m) => ({ default: m.ProductPage })));
const ProductDetailPage = lazy(() =>
  import('@/modules/product').then((m) => ({ default: m.ProductDetailPage }))
);
const VariantDetailPage = lazy(() =>
  import('@/modules/product').then((m) => ({ default: m.VariantDetailPage }))
);
const CustomerPage = lazy(() =>
  import('@/modules/customer').then((m) => ({ default: m.CustomerPage }))
);
const SupplierPage = lazy(() =>
  import('@/modules/supplier').then((m) => ({ default: m.SupplierPage }))
);
const PurchasePage = lazy(() =>
  import('@/modules/purchase').then((m) => ({ default: m.PurchasePage }))
);
const PurchaseDetailPage = lazy(() =>
  import('@/modules/purchase').then((m) => ({ default: m.PurchaseDetailPage }))
);
const StockPage = lazy(() => import('@/modules/inventory').then((m) => ({ default: m.StockPage })));
const StockDetailPage = lazy(() =>
  import('@/modules/inventory').then((m) => ({ default: m.StockDetailPage }))
);
const StockMovementPage = lazy(() =>
  import('@/modules/inventory').then((m) => ({ default: m.StockMovementPage }))
);
const SalePage = lazy(() => import('@/modules/sale').then((m) => ({ default: m.SalePage })));
const SaleDetailPage = lazy(() => import('@/modules/sale').then((m) => ({ default: m.SaleDetailPage })));
const SaleInvoicePage = lazy(() => import('@/modules/sale').then((m) => ({ default: m.SaleInvoicePage })));
const RepairPage = lazy(() => import('@/modules/repair').then((m) => ({ default: m.RepairPage })));
const RepairDetailPage = lazy(() => import('@/modules/repair').then((m) => ({ default: m.RepairDetailPage })));
const WarrantyPage = lazy(() => import('@/modules/warranty').then((m) => ({ default: m.WarrantyPage })));
const ExpensePage = lazy(() => import('@/modules/expense').then((m) => ({ default: m.ExpensePage })));
const ReportsHubPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.ReportsHubPage })));
const SalesReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.SalesReportPage })));
const PurchaseReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.PurchaseReportPage })));
const InventoryReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.InventoryReportPage })));
const CustomerReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.CustomerReportPage })));
const CustomerReportDetailPage = lazy(() =>
  import('@/modules/report').then((m) => ({ default: m.CustomerReportDetailPage }))
);
const SupplierReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.SupplierReportPage })));
const SupplierReportDetailPage = lazy(() =>
  import('@/modules/report').then((m) => ({ default: m.SupplierReportDetailPage }))
);
const RepairReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.RepairReportPage })));
const WarrantyReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.WarrantyReportPage })));
const ExpenseReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.ExpenseReportPage })));
const ProfitReportPage = lazy(() => import('@/modules/report').then((m) => ({ default: m.ProfitReportPage })));
const UserPage = lazy(() => import('@/modules/user').then((m) => ({ default: m.UserPage })));
const RolePage = lazy(() => import('@/modules/role').then((m) => ({ default: m.RolePage })));
const ApplicationSettingsPage = lazy(() =>
  import('@/modules/settings').then((m) => ({ default: m.ApplicationSettingsPage }))
);
const ForbiddenPage = lazy(() =>
  import('@/pages/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage }))
);
const UnauthorizedPage = lazy(() =>
  import('@/pages/UnauthorizedPage').then((m) => ({ default: m.UnauthorizedPage }))
);

export function AppRoutes(): JSX.Element {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route index element={<Navigate to={ROUTE_PATHS.dashboard} replace />} />

        {/* Public routes */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Route>
        <Route path="403" element={<ForbiddenPage />} />
        <Route path="401" element={<UnauthorizedPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="brands" element={<BrandPage />} />
            <Route path="categories" element={<CategoryPage />} />
            <Route path="attributes" element={<AttributePage />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="products/:productId" element={<ProductDetailPage />} />
            <Route path="products/:productId/variants/:variantId" element={<VariantDetailPage />} />
            <Route path="customers" element={<CustomerPage />} />
            <Route path="suppliers" element={<SupplierPage />} />
            <Route path="purchases" element={<PurchasePage />} />
            <Route path="purchases/:purchaseId" element={<PurchaseDetailPage />} />
            <Route path="stock" element={<StockPage />} />
            <Route path="stock/:stockId" element={<StockDetailPage />} />
            <Route path="stock-movements" element={<StockMovementPage />} />
            <Route path="sales" element={<SalePage />} />
            <Route path="sales/:saleId" element={<SaleDetailPage />} />
            <Route path="sales/:saleId/invoice" element={<SaleInvoicePage />} />
            <Route path="repairs" element={<RepairPage />} />
            <Route path="repairs/:repairId" element={<RepairDetailPage />} />
            <Route path="warranties" element={<WarrantyPage />} />
            <Route path="expenses" element={<ExpensePage />} />
            <Route path="reports" element={<ReportsHubPage />} />
            <Route path="reports/sales" element={<SalesReportPage />} />
            <Route path="reports/purchases" element={<PurchaseReportPage />} />
            <Route path="reports/inventory" element={<InventoryReportPage />} />
            <Route path="reports/customers" element={<CustomerReportPage />} />
            <Route path="reports/customers/:customerId" element={<CustomerReportDetailPage />} />
            <Route path="reports/suppliers" element={<SupplierReportPage />} />
            <Route path="reports/suppliers/:supplierId" element={<SupplierReportDetailPage />} />
            <Route path="reports/repairs" element={<RepairReportPage />} />
            <Route path="reports/warranty" element={<WarrantyReportPage />} />
            <Route path="reports/expenses" element={<ExpenseReportPage />} />
            <Route path="reports/profit" element={<ProfitReportPage />} />
            <Route element={<RequireRole allowedRoles={[ROLES.ADMIN]} />}>
              <Route path="users" element={<UserPage />} />
            </Route>
            <Route path="roles" element={<RolePage />} />
            <Route path="shop-settings" element={<ApplicationSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
