package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.common.enums.PriceType;
import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.product.dto.CreateProductPriceRequest;
import com.mobileshoperp.modules.product.dto.ProductPriceResponse;
import com.mobileshoperp.modules.product.entity.ProductPrice;
import com.mobileshoperp.modules.product.exception.ProductPriceNotFoundException;
import com.mobileshoperp.modules.product.mapper.ProductPriceMapper;
import com.mobileshoperp.modules.product.repository.ProductPriceRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductPriceService {

    private final ProductPriceRepository productPriceRepository;
    private final ProductPriceMapper productPriceMapper;
    private final ProductVariantService productVariantService;

    @Transactional(readOnly = true)
    public List<ProductPriceResponse> getHistoryByVariantId(UUID variantId) {
        productVariantService.getActiveProductVariantOrThrow(variantId);
        return productPriceRepository.findByVariantIdOrderByEffectiveFromDescCreatedAtDesc(variantId).stream()
                .map(productPriceMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductPriceResponse getActiveRetailPrice(UUID variantId) {
        productVariantService.getActiveProductVariantOrThrow(variantId);
        return productPriceRepository
                .findFirstByVariantIdAndPriceTypeAndActiveTrueOrderByEffectiveFromDesc(variantId, PriceType.RETAIL)
                .map(productPriceMapper::toResponse)
                .orElseThrow(() -> new ProductPriceNotFoundException(
                        "No active retail price found for variant: " + variantId));
    }

    @Transactional(readOnly = true)
    public ProductPriceResponse findById(UUID id) {
        return productPriceMapper.toResponse(getProductPriceOrThrow(id));
    }

    public ProductPriceResponse create(CreateProductPriceRequest request) {
        productVariantService.getActiveProductVariantOrThrow(request.variantId());
        validatePositivePrice(request.price());
        validateEffectiveDates(request.effectiveFrom(), request.effectiveTo());

        boolean active = request.active() == null || request.active();
        if (active && request.priceType() == PriceType.RETAIL) {
            closeActiveRetailPrices(request.variantId(), request.effectiveFrom());
        }

        ProductPrice productPrice = productPriceMapper.toEntity(request);
        productPrice.setActive(active);
        if (request.effectiveTo() != null) {
            productPrice.setEffectiveTo(request.effectiveTo());
        }
        return productPriceMapper.toResponse(productPriceRepository.save(productPrice));
    }

    @Transactional(readOnly = true)
    public ProductPrice getProductPriceOrThrow(UUID id) {
        return productPriceRepository
                .findById(id)
                .orElseThrow(() -> new ProductPriceNotFoundException(id));
    }

    private void closeActiveRetailPrices(UUID variantId, java.time.LocalDate newEffectiveFrom) {
        List<ProductPrice> activeRetailPrices =
                productPriceRepository.findByVariantIdAndPriceTypeAndActiveTrue(variantId, PriceType.RETAIL);
        java.time.LocalDate closeDate = newEffectiveFrom.minusDays(1);
        for (ProductPrice existing : activeRetailPrices) {
            existing.setActive(false);
            if (existing.getEffectiveTo() == null || existing.getEffectiveTo().isAfter(closeDate)) {
                existing.setEffectiveTo(closeDate);
            }
            productPriceRepository.save(existing);
        }
    }

    private void validatePositivePrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Price must be positive");
        }
    }

    private void validateEffectiveDates(java.time.LocalDate effectiveFrom, java.time.LocalDate effectiveTo) {
        if (effectiveTo != null && effectiveTo.isBefore(effectiveFrom)) {
            throw new BusinessRuleException("effectiveTo must be on or after effectiveFrom");
        }
    }
}
