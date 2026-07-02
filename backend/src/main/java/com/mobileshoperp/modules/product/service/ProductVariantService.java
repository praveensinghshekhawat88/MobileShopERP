package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.modules.product.dto.CreateProductVariantRequest;
import com.mobileshoperp.modules.product.dto.ProductVariantResponse;
import com.mobileshoperp.modules.product.dto.UpdateProductVariantRequest;
import com.mobileshoperp.modules.product.entity.ProductVariant;
import com.mobileshoperp.modules.product.exception.DuplicateBarcodeException;
import com.mobileshoperp.modules.product.exception.DuplicateSkuException;
import com.mobileshoperp.modules.product.exception.ProductVariantNotFoundException;
import com.mobileshoperp.modules.product.mapper.ProductVariantMapper;
import com.mobileshoperp.modules.product.repository.ProductVariantRepository;
import java.time.Instant;
import java.util.List;
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
public class ProductVariantService {

    private final ProductVariantRepository productVariantRepository;
    private final ProductVariantMapper productVariantMapper;
    private final ProductService productService;

    @Transactional(readOnly = true)
    public Page<ProductVariantResponse> findAllActive(UUID productId, Pageable pageable) {
        Page<ProductVariant> page = productId == null
                ? productVariantRepository.findByActiveTrueOrderBySkuAsc(pageable)
                : productVariantRepository.findByProductIdAndActiveTrueOrderBySkuAsc(productId, pageable);
        return page.map(productVariantMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<ProductVariantResponse> findAllActiveByProductId(UUID productId) {
        productService.getActiveProductOrThrow(productId);
        return productVariantRepository.findByProductIdAndActiveTrueOrderBySkuAsc(productId).stream()
                .map(productVariantMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductVariantResponse findById(UUID id) {
        return productVariantMapper.toResponse(getProductVariantOrThrow(id));
    }

    public ProductVariantResponse create(CreateProductVariantRequest request) {
        productService.getActiveProductOrThrow(request.productId());
        validateUniqueSku(request.sku(), null);
        validateUniqueBarcode(request.barcode(), null);
        ProductVariant variant = productVariantMapper.toEntity(request);
        if (request.active() != null) {
            variant.setActive(request.active());
        }
        if (!StringUtils.hasText(variant.getBarcode())) {
            variant.setBarcode(null);
        }
        return productVariantMapper.toResponse(productVariantRepository.save(variant));
    }

    public ProductVariantResponse update(UUID id, UpdateProductVariantRequest request) {
        ProductVariant variant = getProductVariantOrThrow(id);
        if (request.sku() != null) {
            validateUniqueSku(request.sku(), id);
        }
        if (request.barcode() != null) {
            validateUniqueBarcode(
                    StringUtils.hasText(request.barcode()) ? request.barcode() : null, id);
        }
        productVariantMapper.updateEntity(request, variant);
        if (request.barcode() != null && !StringUtils.hasText(variant.getBarcode())) {
            variant.setBarcode(null);
        }
        return productVariantMapper.toResponse(productVariantRepository.save(variant));
    }

    public void deactivate(UUID id) {
        ProductVariant variant = getProductVariantOrThrow(id);
        variant.setActive(false);
        productVariantRepository.save(variant);
    }

    public void softDelete(UUID id) {
        ProductVariant variant = getProductVariantOrThrow(id);
        variant.setDeletedAt(Instant.now());
        variant.setActive(false);
        productVariantRepository.save(variant);
    }

    @Transactional(readOnly = true)
    public ProductVariant getActiveProductVariantOrThrow(UUID id) {
        ProductVariant variant = getProductVariantOrThrow(id);
        if (!variant.isActive()) {
            throw new ProductVariantNotFoundException(id);
        }
        return variant;
    }

    @Transactional(readOnly = true)
    public ProductVariant getProductVariantOrThrow(UUID id) {
        return productVariantRepository
                .findById(id)
                .orElseThrow(() -> new ProductVariantNotFoundException(id));
    }

    private void validateUniqueSku(String sku, UUID excludeId) {
        productVariantRepository.findBySkuIgnoreCase(sku).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new DuplicateSkuException(sku);
            }
        });
    }

    private void validateUniqueBarcode(String barcode, UUID excludeId) {
        if (!StringUtils.hasText(barcode)) {
            return;
        }
        productVariantRepository.findByBarcodeIgnoreCase(barcode).ifPresent(existing -> {
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new DuplicateBarcodeException(barcode);
            }
        });
    }
}
