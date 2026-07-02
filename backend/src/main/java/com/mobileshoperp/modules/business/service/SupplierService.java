package com.mobileshoperp.modules.business.service;

import com.mobileshoperp.common.validation.GstValidator;
import com.mobileshoperp.common.validation.MobileValidator;
import com.mobileshoperp.modules.business.dto.CreateSupplierRequest;
import com.mobileshoperp.modules.business.dto.SupplierResponse;
import com.mobileshoperp.modules.business.dto.UpdateSupplierRequest;
import com.mobileshoperp.modules.business.entity.Supplier;
import com.mobileshoperp.modules.business.exception.DuplicateSupplierMobileException;
import com.mobileshoperp.modules.business.exception.SupplierNotFoundException;
import com.mobileshoperp.modules.business.mapper.SupplierMapper;
import com.mobileshoperp.modules.business.repository.SupplierRepository;
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
public class SupplierService {

    private final SupplierRepository supplierRepository;
    private final SupplierMapper supplierMapper;

    @Transactional(readOnly = true)
    public Page<SupplierResponse> findAll(String supplierName, String mobile, Pageable pageable) {
        if (StringUtils.hasText(mobile)) {
            return supplierRepository
                    .findByMobileContainingOrderBySupplierNameAsc(mobile.trim(), pageable)
                    .map(supplierMapper::toResponse);
        }
        if (StringUtils.hasText(supplierName)) {
            return supplierRepository
                    .findBySupplierNameContainingIgnoreCaseOrderBySupplierNameAsc(
                            supplierName.trim(), pageable)
                    .map(supplierMapper::toResponse);
        }
        return supplierRepository.findAllByOrderBySupplierNameAsc(pageable).map(supplierMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public SupplierResponse findById(UUID id) {
        return supplierMapper.toResponse(getSupplierOrThrow(id));
    }

    @Transactional(readOnly = true)
    public SupplierResponse findByMobile(String mobile) {
        MobileValidator.validateOrThrow(mobile);
        return supplierMapper.toResponse(supplierRepository
                .findByMobile(mobile)
                .orElseThrow(() -> new SupplierNotFoundException(mobile)));
    }

    public SupplierResponse create(CreateSupplierRequest request) {
        MobileValidator.validateOrThrow(request.mobile());
        GstValidator.validateOrThrow(request.gstNumber());
        validateUniqueMobile(request.mobile(), null);
        Supplier supplier = supplierMapper.toEntity(request);
        if (StringUtils.hasText(request.gstNumber())) {
            supplier.setGstNumber(request.gstNumber().trim().toUpperCase());
        }
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    public SupplierResponse update(UUID id, UpdateSupplierRequest request) {
        Supplier supplier = getSupplierOrThrow(id);
        if (request.mobile() != null) {
            MobileValidator.validateOrThrow(request.mobile());
            validateUniqueMobile(request.mobile(), id);
        }
        if (request.gstNumber() != null) {
            GstValidator.validateOrThrow(request.gstNumber());
        }
        supplierMapper.updateEntity(request, supplier);
        if (request.gstNumber() != null) {
            supplier.setGstNumber(
                    StringUtils.hasText(request.gstNumber())
                            ? request.gstNumber().trim().toUpperCase()
                            : null);
        }
        return supplierMapper.toResponse(supplierRepository.save(supplier));
    }

    public void softDelete(UUID id) {
        Supplier supplier = getSupplierOrThrow(id);
        supplier.setDeletedAt(Instant.now());
        supplierRepository.save(supplier);
    }

    @Transactional(readOnly = true)
    public Supplier getActiveSupplierOrThrow(UUID id) {
        return getSupplierOrThrow(id);
    }

    @Transactional(readOnly = true)
    public Supplier getSupplierOrThrow(UUID id) {
        return supplierRepository.findById(id).orElseThrow(() -> new SupplierNotFoundException(id));
    }

    private void validateUniqueMobile(String mobile, UUID excludeId) {
        supplierRepository.findByMobile(mobile).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new DuplicateSupplierMobileException(mobile);
            }
        });
    }
}
