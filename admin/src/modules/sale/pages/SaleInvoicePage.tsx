import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useMemo, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { PAYMENT_MODE_LABELS } from '@/common/constants/paymentMode';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { AppButton } from '@/components/buttons/AppButton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/loading/PageLoader';
import { PaymentStatusChip } from '@/components/PaymentStatusChip';
import { useCustomer } from '@/modules/customer';
import { useAvailableStockOptions } from '@/modules/inventory';
import { useSalePaymentBalance, useSalePayments } from '@/modules/sale/hooks/usePayments';
import { useSaleItems } from '@/modules/sale/hooks/useSaleItems';
import { useSale } from '@/modules/sale/hooks/useSales';
import { useSettings } from '@/modules/settings';
import { buildSaleDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate, formatDateTime } from '@/utils/formatDate';

/**
 * Read-only invoice view — see 04_TASKS.md P07-T004. Composed from Sale,
 * Customer, Settings, line items and payments. No PDF backend; browser print only.
 */
export function SaleInvoicePage(): JSX.Element {
  const { saleId } = useParams<{ saleId: string }>();
  const navigate = useNavigate();

  const saleQuery = useSale(saleId);
  const itemsQuery = useSaleItems(saleId);
  const paymentsQuery = useSalePayments(saleId);
  const balanceQuery = useSalePaymentBalance(saleId);
  const settingsQuery = useSettings();
  const customerQuery = useCustomer(saleQuery.data?.customerId);
  const { stockById } = useAvailableStockOptions();

  const subtotal = useMemo(
    () => (itemsQuery.data ?? []).reduce((sum, item) => sum + item.sellingPrice - item.discount, 0),
    [itemsQuery.data]
  );
  const taxTotal = useMemo(
    () => (itemsQuery.data ?? []).reduce((sum, item) => sum + item.taxAmount, 0),
    [itemsQuery.data]
  );

  if (!saleId) {
    return <ErrorState message="No sale was specified." />;
  }

  if (saleQuery.isLoading || settingsQuery.isLoading) {
    return <PageLoader />;
  }

  if (saleQuery.isError || !saleQuery.data) {
    return (
      <ErrorState
        message={saleQuery.isError ? getApiErrorMessage(saleQuery.error) : 'Sale not found.'}
        onRetry={() => void saleQuery.refetch()}
      />
    );
  }

  const sale = saleQuery.data;
  const settings = settingsQuery.data;
  const customer = customerQuery.data;
  const balance = balanceQuery.data;

  const handlePrint = (): void => {
    window.print();
  };

  return (
    <Stack spacing={3} className="sale-invoice-page">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ '@media print': { display: 'none' } }}
      >
        <Breadcrumbs
          items={[
            { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
            { label: 'Sales', to: ROUTE_PATHS.sales },
            { label: sale.invoiceNumber, to: buildSaleDetailPath(saleId) },
            { label: 'Invoice' },
          ]}
        />
        <Stack direction="row" spacing={1}>
          <AppButton
            appVariant="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(buildSaleDetailPath(saleId))}
          >
            Back to Sale
          </AppButton>
          <AppButton appVariant="primary" startIcon={<PrintOutlinedIcon />} onClick={handlePrint}>
            Print
          </AppButton>
        </Stack>
      </Stack>

      <Card
        sx={{
          maxWidth: 900,
          mx: 'auto',
          width: '100%',
          '@media print': { boxShadow: 'none', border: 'none' },
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {settings?.companyName ?? 'Mobile Shop ERP'}
                </Typography>
                {settings?.ownerName ? (
                  <Typography variant="body2" color="text.secondary">
                    {settings.ownerName}
                  </Typography>
                ) : null}
                {settings?.address ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                    {settings.address}
                  </Typography>
                ) : null}
                {settings?.mobile ? (
                  <Typography variant="body2" color="text.secondary">
                    {settings.mobile}
                  </Typography>
                ) : null}
                {settings?.email ? (
                  <Typography variant="body2" color="text.secondary">
                    {settings.email}
                  </Typography>
                ) : null}
                {settings?.gstNumber ? (
                  <Typography variant="body2" color="text.secondary">
                    GST: {settings.gstNumber}
                  </Typography>
                ) : null}
              </Box>
              <Box textAlign={{ xs: 'left', sm: 'right' }}>
                <Typography variant="h4" fontWeight={700}>
                  INVOICE
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {sale.invoiceNumber}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Date: {formatDate(sale.invoiceDate)}
                </Typography>
                <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', sm: 'flex-end' }} mt={1}>
                  <PaymentStatusChip status={sale.paymentStatus} />
                </Stack>
              </Box>
            </Stack>

            <Divider />

            <Box>
              <Typography variant="overline" color="text.secondary">
                Bill To
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {customer?.name ?? '—'}
              </Typography>
              {customer?.mobile ? (
                <Typography variant="body2" color="text.secondary">
                  {customer.mobile}
                </Typography>
              ) : null}
              {customer?.email ? (
                <Typography variant="body2" color="text.secondary">
                  {customer.email}
                </Typography>
              ) : null}
              {customer?.address ? (
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-line' }}>
                  {customer.address}
                </Typography>
              ) : null}
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Item (IMEI / Stock)</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Discount</TableCell>
                    <TableCell align="right">Tax</TableCell>
                    <TableCell align="right">Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(itemsQuery.data ?? []).map((item, index) => {
                    const stock = stockById.get(item.stockId);
                    const itemLabel = stock?.imei ?? item.stockId.slice(0, 8);
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{itemLabel}</TableCell>
                        <TableCell align="right">{formatCurrency(item.sellingPrice)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.discount)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.taxAmount)}</TableCell>
                        <TableCell align="right">{formatCurrency(item.lineTotal)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" spacing={4}>
              <Box minWidth={240}>
                <Stack spacing={0.5}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">{formatCurrency(subtotal)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Tax</Typography>
                    <Typography variant="body2">{formatCurrency(taxTotal)}</Typography>
                  </Stack>
                  <Divider sx={{ my: 1 }} />
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body1" fontWeight={700}>
                      Total
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                      {formatCurrency(sale.totalAmount)}
                    </Typography>
                  </Stack>
                  {balance ? (
                    <>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2">Paid</Typography>
                        <Typography variant="body2">{formatCurrency(balance.amountPaid)}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" fontWeight={600}>
                          Balance Due
                        </Typography>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(balance.pendingBalance)}
                        </Typography>
                      </Stack>
                    </>
                  ) : null}
                </Stack>
              </Box>
            </Stack>

            {(paymentsQuery.data?.length ?? 0) > 0 ? (
              <>
                <Divider />
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                    Payment History
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Mode</TableCell>
                          <TableCell>Transaction #</TableCell>
                          <TableCell align="right">Amount</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(paymentsQuery.data ?? []).map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDateTime(payment.paymentDate)}</TableCell>
                            <TableCell>{PAYMENT_MODE_LABELS[payment.paymentMode]}</TableCell>
                            <TableCell>{payment.transactionNumber ?? '—'}</TableCell>
                            <TableCell align="right">{formatCurrency(payment.amount)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </>
            ) : null}

            <Typography variant="caption" color="text.secondary" textAlign="center" sx={{ pt: 2 }}>
              Thank you for your business.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
