package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.product.dto.CreateProductImageRequest;
import com.mobileshoperp.modules.product.dto.ProductImageResponse;
import com.mobileshoperp.modules.product.dto.UpdateProductImageRequest;
import com.mobileshoperp.modules.product.entity.ProductImage;
import com.mobileshoperp.modules.product.exception.ProductImageNotFoundException;
import com.mobileshoperp.modules.product.mapper.ProductImageMapper;
import com.mobileshoperp.modules.product.repository.ProductImageRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductImageService {

    private static final Pattern ALLOWED_IMAGE_URL =
            Pattern.compile(".*\\.(jpg|jpeg|png|webp)(\\?.*)?$", Pattern.CASE_INSENSITIVE);

    private final ProductImageRepository productImageRepository;
    private final ProductImageMapper productImageMapper;
    private final ProductVariantService productVariantService;

    @Transactional(readOnly = true)
    public List<ProductImageResponse> findByVariantId(UUID variantId) {
        productVariantService.getActiveProductVariantOrThrow(variantId);
        return productImageRepository.findByVariantIdOrderByDisplayOrderAscCreatedAtAsc(variantId).stream()
                .map(productImageMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductImageResponse findById(UUID variantId, UUID imageId) {
        return productImageMapper.toResponse(getImageForVariantOrThrow(variantId, imageId));
    }

    public ProductImageResponse create(UUID variantId, CreateProductImageRequest request) {
        productVariantService.getActiveProductVariantOrThrow(variantId);
        validateImageUrl(request.imageUrl());
        ProductImage productImage = productImageMapper.toEntity(request);
        productImage.setVariantId(variantId);
        if (request.displayOrder() != null) {
            productImage.setDisplayOrder(request.displayOrder());
        }
        return productImageMapper.toResponse(productImageRepository.save(productImage));
    }

    public ProductImageResponse update(UUID variantId, UUID imageId, UpdateProductImageRequest request) {
        ProductImage productImage = getImageForVariantOrThrow(variantId, imageId);
        if (request.imageUrl() != null) {
            validateImageUrl(request.imageUrl());
        }
        productImageMapper.updateEntity(request, productImage);
        return productImageMapper.toResponse(productImageRepository.save(productImage));
    }

    public void softDelete(UUID variantId, UUID imageId) {
        ProductImage productImage = getImageForVariantOrThrow(variantId, imageId);
        productImage.setDeletedAt(Instant.now());
        productImageRepository.save(productImage);
    }

    private ProductImage getImageForVariantOrThrow(UUID variantId, UUID imageId) {
        ProductImage productImage = productImageRepository
                .findById(imageId)
                .orElseThrow(() -> new ProductImageNotFoundException(imageId));
        if (!productImage.getVariantId().equals(variantId)) {
            throw new ProductImageNotFoundException(imageId);
        }
        return productImage;
    }

    private void validateImageUrl(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new BusinessRuleException("Image URL is required");
        }
        if (!ALLOWED_IMAGE_URL.matcher(imageUrl.trim()).matches()) {
            throw new BusinessRuleException("Image URL must use jpg, jpeg, png, or webp format");
        }
    }
}
