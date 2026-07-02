package com.mobileshoperp.modules.business.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.business.dto.CreateSupplierRequest;
import com.mobileshoperp.modules.business.entity.Supplier;
import com.mobileshoperp.modules.business.exception.DuplicateSupplierMobileException;
import com.mobileshoperp.modules.business.mapper.SupplierMapper;
import com.mobileshoperp.modules.business.repository.SupplierRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private SupplierMapper supplierMapper;

    @InjectMocks
    private SupplierService supplierService;

    @Test
    void createShouldRejectDuplicateMobile() {
        CreateSupplierRequest request = new CreateSupplierRequest(
                "ABC Traders", "Raj", "9876543210", "abc@example.com", null, "Address");
        when(supplierRepository.findByMobile("9876543210")).thenReturn(Optional.of(new Supplier()));

        assertThatThrownBy(() -> supplierService.create(request))
                .isInstanceOf(DuplicateSupplierMobileException.class);
    }

    @Test
    void softDeleteShouldSetDeletedAt() {
        UUID id = UUID.randomUUID();
        Supplier supplier = new Supplier();
        supplier.setId(id);
        supplier.setSupplierName("ABC Traders");
        supplier.setMobile("9876543210");
        when(supplierRepository.findById(id)).thenReturn(Optional.of(supplier));
        when(supplierRepository.save(supplier)).thenReturn(supplier);

        supplierService.softDelete(id);

        assertThat(supplier.getDeletedAt()).isNotNull();
        verify(supplierRepository).save(supplier);
    }
}
