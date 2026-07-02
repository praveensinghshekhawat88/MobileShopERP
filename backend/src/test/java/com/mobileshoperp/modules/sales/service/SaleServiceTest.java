package com.mobileshoperp.modules.sales.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.auth.service.SettingsService;
import com.mobileshoperp.modules.business.entity.Customer;
import com.mobileshoperp.modules.business.service.CustomerService;
import com.mobileshoperp.modules.sales.dto.CreateSaleRequest;
import com.mobileshoperp.modules.sales.dto.SaleResponse;
import com.mobileshoperp.modules.sales.entity.Sale;
import com.mobileshoperp.modules.sales.exception.DuplicateSaleInvoiceNumberException;
import com.mobileshoperp.modules.sales.mapper.SaleMapper;
import com.mobileshoperp.modules.sales.repository.SaleRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SaleServiceTest {

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private SaleMapper saleMapper;

    @Mock
    private CustomerService customerService;

    @Mock
    private SettingsService settingsService;

    @InjectMocks
    private SaleService saleService;

    @Test
    void createShouldRejectDuplicateInvoiceNumber() {
        UUID customerId = UUID.randomUUID();
        CreateSaleRequest request = new CreateSaleRequest(
                customerId, "INV-202506-0001", LocalDate.of(2025, 6, 30), BigDecimal.ZERO, null);
        when(customerService.getActiveCustomerOrThrow(customerId)).thenReturn(new Customer());
        when(saleRepository.findByInvoiceNumberIgnoreCase("INV-202506-0001"))
                .thenReturn(Optional.of(new Sale()));

        assertThatThrownBy(() -> saleService.create(request))
                .isInstanceOf(DuplicateSaleInvoiceNumberException.class);
    }

    @Test
    void createShouldAutoGenerateInvoiceNumberWhenOmitted() {
        UUID customerId = UUID.randomUUID();
        LocalDate invoiceDate = LocalDate.of(2025, 6, 30);
        CreateSaleRequest request =
                new CreateSaleRequest(customerId, null, invoiceDate, BigDecimal.ZERO, null);
        Sale sale = new Sale();
        sale.setId(UUID.randomUUID());
        sale.setCustomerId(customerId);
        sale.setInvoiceNumber("INV-202506-0001");
        sale.setInvoiceDate(invoiceDate);

        when(customerService.getActiveCustomerOrThrow(customerId)).thenReturn(new Customer());
        when(settingsService.getInvoicePrefixOrDefault()).thenReturn("INV");
        when(saleRepository.countByInvoiceNumberStartingWithIgnoreCase("INV-202506-"))
                .thenReturn(0L);
        when(saleRepository.findByInvoiceNumberIgnoreCase("INV-202506-0001")).thenReturn(Optional.empty());
        when(saleMapper.toEntity(request)).thenReturn(new Sale());
        when(saleRepository.save(any(Sale.class))).thenReturn(sale);
        when(saleMapper.toResponse(sale)).thenReturn(new SaleResponse(
                sale.getId(), customerId, "INV-202506-0001", invoiceDate, BigDecimal.ZERO, null));

        SaleResponse response = saleService.create(request);

        assertThat(response.invoiceNumber()).isEqualTo("INV-202506-0001");
        verify(saleRepository).save(any(Sale.class));
    }

    @Test
    void createShouldValidateCustomerExists() {
        UUID customerId = UUID.randomUUID();
        CreateSaleRequest request = new CreateSaleRequest(
                customerId, "INV-001", LocalDate.now(), BigDecimal.ZERO, null);
        when(customerService.getActiveCustomerOrThrow(customerId))
                .thenThrow(new com.mobileshoperp.modules.business.exception.CustomerNotFoundException(customerId));

        assertThatThrownBy(() -> saleService.create(request))
                .isInstanceOf(com.mobileshoperp.modules.business.exception.CustomerNotFoundException.class);
        verify(saleRepository, never()).save(any());
    }
}
