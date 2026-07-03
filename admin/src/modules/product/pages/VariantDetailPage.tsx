import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Box, Card, CardContent, Chip, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState, type JSX, type SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/loading/PageLoader';
import { useAuth } from '@/modules/auth';
import { ProductVariantFormDialog } from '@/modules/product/components/ProductVariantFormDialog';
import { VariantAttributesPanel } from '@/modules/product/components/VariantAttributesPanel';
import { VariantImagesPanel } from '@/modules/product/components/VariantImagesPanel';
import { VariantPricesPanel } from '@/modules/product/components/VariantPricesPanel';
import { useProduct } from '@/modules/product/hooks/useProducts';
import { useProductVariant } from '@/modules/product/hooks/useProductVariants';
import { buildProductDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';

type VariantTab = 'images' | 'prices' | 'attributes';

interface TabPanelProps {
  readonly activeTab: VariantTab;
  readonly tab: VariantTab;
  readonly children: JSX.Element;
}

function TabPanel({ activeTab, tab, children }: TabPanelProps): JSX.Element | null {
  return activeTab === tab ? <Box pt={3}>{children}</Box> : null;
}

/**
 * Variant detail screen — see 04_TASKS.md P04-T003..T005 and AGENTS.md §
 * Product Structure: "Variant → Attributes → Prices → Stock." Images, Price
 * History, and Dynamic Attributes are combined into one tabbed page (same
 * rationale as the Phase 03 Attribute module) since all three are always
 * scoped to a single variant and form one workflow when preparing a variant
 * for sale.
 */
export function VariantDetailPage(): JSX.Element {
  const { productId, variantId } = useParams<{ productId: string; variantId: string }>();
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<VariantTab>('images');
  const [editVariant, setEditVariant] = useState(false);

  const productQuery = useProduct(productId);
  const variantQuery = useProductVariant(variantId);

  const handleChange = (_event: SyntheticEvent, value: VariantTab): void => {
    setActiveTab(value);
  };

  if (!productId || !variantId) {
    return <ErrorState message="No variant was specified." />;
  }

  if (productQuery.isLoading || variantQuery.isLoading) {
    return <PageLoader />;
  }

  if (productQuery.isError || variantQuery.isError || !productQuery.data || !variantQuery.data) {
    const error = productQuery.error ?? variantQuery.error;
    return (
      <ErrorState
        message={error ? getApiErrorMessage(error) : 'Variant not found.'}
        onRetry={() => {
          void productQuery.refetch();
          void variantQuery.refetch();
        }}
      />
    );
  }

  const product = productQuery.data;
  const variant = variantQuery.data;

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
          { label: 'Products', to: ROUTE_PATHS.products },
          { label: product.name, to: buildProductDetailPath(product.id) },
          { label: variant.sku },
        ]}
      />

      <Card variant="outlined">
        <CardContent>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Stack spacing={0.5}>
              <Typography variant="h5" fontWeight={700}>
                {variant.sku}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Barcode: {variant.barcode ?? '—'}
              </Typography>
              <Chip
                label={variant.active ? 'Active' : 'Inactive'}
                color={variant.active ? 'success' : 'default'}
                size="small"
                variant="outlined"
                sx={{ width: 'fit-content' }}
              />
            </Stack>
            {isAdmin ? (
              <AppButton
                appVariant="secondary"
                startIcon={<EditOutlinedIcon />}
                onClick={() => setEditVariant(true)}
              >
                Edit Variant
              </AppButton>
            ) : null}
          </Stack>
        </CardContent>
      </Card>

      <Box borderBottom={1} borderColor="divider">
        <Tabs value={activeTab} onChange={handleChange} aria-label="Variant detail tabs">
          <Tab label="Images" value="images" id="variant-tab-images" />
          <Tab label="Price History" value="prices" id="variant-tab-prices" />
          <Tab label="Attributes" value="attributes" id="variant-tab-attributes" />
        </Tabs>
      </Box>

      <TabPanel activeTab={activeTab} tab="images">
        <VariantImagesPanel variantId={variantId} isAdmin={isAdmin} />
      </TabPanel>
      <TabPanel activeTab={activeTab} tab="prices">
        <VariantPricesPanel variantId={variantId} isAdmin={isAdmin} />
      </TabPanel>
      <TabPanel activeTab={activeTab} tab="attributes">
        <VariantAttributesPanel variantId={variantId} isAdmin={isAdmin} />
      </TabPanel>

      {isAdmin && editVariant ? (
        <ProductVariantFormDialog
          open
          productId={productId}
          variant={variant}
          onClose={() => setEditVariant(false)}
        />
      ) : null}
    </Stack>
  );
}
