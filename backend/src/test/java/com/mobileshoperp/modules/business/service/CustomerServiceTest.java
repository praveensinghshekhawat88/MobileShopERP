package com.mobileshoperp.modules.business.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.business.dto.CreateCustomerRequest;
import com.mobileshoperp.modules.business.entity.Customer;
import com.mobileshoperp.modules.business.exception.DuplicateCustomerMobileException;
import com.mobileshoperp.modules.business.mapper.CustomerMapper;
import com.mobileshoperp.modules.business.repository.CustomerRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private CustomerMapper customerMapper;

    @InjectMocks
    private CustomerService customerService;

    @Test
    void createShouldRejectDuplicateMobile() {
        CreateCustomerRequest request = new CreateCustomerRequest(
                "John Doe", "9876543210", "john@example.com", "Address", null);
        when(customerRepository.findByMobile("9876543210")).thenReturn(Optional.of(new Customer()));

        assertThatThrownBy(() -> customerService.create(request))
                .isInstanceOf(DuplicateCustomerMobileException.class);
    }

    @Test
    void createShouldRejectInvalidGstNumber() {
        CreateCustomerRequest request = new CreateCustomerRequest(
                "John Doe", "9876543210", null, null, "INVALID-GST");

        assertThatThrownBy(() -> customerService.create(request)).isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void softDeleteShouldSetDeletedAt() {
        UUID id = UUID.randomUUID();
        Customer customer = new Customer();
        customer.setId(id);
        customer.setName("John Doe");
        customer.setMobile("9876543210");
        when(customerRepository.findById(id)).thenReturn(Optional.of(customer));
        when(customerRepository.save(customer)).thenReturn(customer);

        customerService.softDelete(id);

        assertThat(customer.getDeletedAt()).isNotNull();
        verify(customerRepository).save(customer);
    }
}
