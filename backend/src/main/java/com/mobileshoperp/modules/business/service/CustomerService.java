package com.mobileshoperp.modules.business.service;

import com.mobileshoperp.common.validation.GstValidator;
import com.mobileshoperp.common.validation.MobileValidator;
import com.mobileshoperp.modules.business.dto.CreateCustomerRequest;
import com.mobileshoperp.modules.business.dto.CustomerResponse;
import com.mobileshoperp.modules.business.dto.UpdateCustomerRequest;
import com.mobileshoperp.modules.business.entity.Customer;
import com.mobileshoperp.modules.business.exception.CustomerNotFoundException;
import com.mobileshoperp.modules.business.exception.DuplicateCustomerMobileException;
import com.mobileshoperp.modules.business.mapper.CustomerMapper;
import com.mobileshoperp.modules.business.repository.CustomerRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Transactional(readOnly = true)
    public Page<CustomerResponse> findAll(String name, String mobile, Pageable pageable) {
        if (StringUtils.hasText(mobile)) {
            return customerRepository
                    .findByMobileContainingOrderByNameAsc(mobile.trim(), pageable)
                    .map(customerMapper::toResponse);
        }
        if (StringUtils.hasText(name)) {
            return customerRepository
                    .findByNameContainingIgnoreCaseOrderByNameAsc(name.trim(), pageable)
                    .map(customerMapper::toResponse);
        }
        return customerRepository.findAllByOrderByNameAsc(pageable).map(customerMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public CustomerResponse findById(UUID id) {
        return customerMapper.toResponse(getCustomerOrThrow(id));
    }

    @Transactional(readOnly = true)
    public CustomerResponse findByMobile(String mobile) {
        MobileValidator.validateOrThrow(mobile);
        return customerMapper.toResponse(customerRepository
                .findByMobile(mobile)
                .orElseThrow(() -> new CustomerNotFoundException(mobile)));
    }

    public CustomerResponse create(CreateCustomerRequest request) {
        MobileValidator.validateOrThrow(request.mobile());
        GstValidator.validateOrThrow(request.gstNumber());
        validateUniqueMobile(request.mobile(), null);
        Customer customer = customerMapper.toEntity(request);
        if (StringUtils.hasText(request.gstNumber())) {
            customer.setGstNumber(request.gstNumber().trim().toUpperCase());
        }
        return customerMapper.toResponse(customerRepository.save(customer));
    }

    public CustomerResponse update(UUID id, UpdateCustomerRequest request) {
        Customer customer = getCustomerOrThrow(id);
        if (request.mobile() != null) {
            MobileValidator.validateOrThrow(request.mobile());
            validateUniqueMobile(request.mobile(), id);
        }
        if (request.gstNumber() != null) {
            GstValidator.validateOrThrow(request.gstNumber());
        }
        customerMapper.updateEntity(request, customer);
        if (request.gstNumber() != null) {
            customer.setGstNumber(
                    StringUtils.hasText(request.gstNumber())
                            ? request.gstNumber().trim().toUpperCase()
                            : null);
        }
        return customerMapper.toResponse(customerRepository.save(customer));
    }

    public void softDelete(UUID id) {
        Customer customer = getCustomerOrThrow(id);
        customer.setDeletedAt(Instant.now());
        customerRepository.save(customer);
    }

    @Transactional(readOnly = true)
    public Customer getActiveCustomerOrThrow(UUID id) {
        return getCustomerOrThrow(id);
    }

    @Transactional(readOnly = true)
    public Customer getCustomerOrThrow(UUID id) {
        return customerRepository.findById(id).orElseThrow(() -> new CustomerNotFoundException(id));
    }

    private void validateUniqueMobile(String mobile, UUID excludeId) {
        customerRepository.findByMobile(mobile).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new DuplicateCustomerMobileException(mobile);
            }
        });
    }
}
