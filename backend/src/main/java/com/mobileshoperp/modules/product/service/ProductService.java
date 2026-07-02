package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.modules.product.dto.CreateProductRequest;
import com.mobileshoperp.modules.product.dto.ProductResponse;
import com.mobileshoperp.modules.product.dto.UpdateProductRequest;
import com.mobileshoperp.modules.product.entity.Product;
import com.mobileshoperp.modules.product.exception.DuplicateProductNameException;
import com.mobileshoperp.modules.product.exception.ProductNotFoundException;
import com.mobileshoperp.modules.product.mapper.ProductMapper;
import com.mobileshoperp.modules.product.repository.ProductRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final BrandService brandService;
    private final CategoryService categoryService;

    @Transactional(readOnly = true)
    public Page<ProductResponse> findAllActive(Long brandId, Long categoryId, Pageable pageable) {
        Page<Product> page;
        if (brandId != null && categoryId != null) {
            page = productRepository.findByBrandIdAndCategoryIdAndActiveTrueOrderByNameAsc(
                    brandId, categoryId, pageable);
        } else if (brandId != null) {
            page = productRepository.findByBrandIdAndActiveTrueOrderByNameAsc(brandId, pageable);
        } else if (categoryId != null) {
            page = productRepository.findByCategoryIdAndActiveTrueOrderByNameAsc(categoryId, pageable);
        } else {
            page = productRepository.findByActiveTrueOrderByNameAsc(pageable);
        }
        return page.map(productMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ProductResponse findById(UUID id) {
        return productMapper.toResponse(getProductOrThrow(id));
    }

    public ProductResponse create(CreateProductRequest request) {
        brandService.getActiveBrandOrThrow(request.brandId());
        categoryService.getActiveCategoryOrThrow(request.categoryId());
        validateUniqueName(request.brandId(), request.name(), null);
        Product product = productMapper.toEntity(request);
        if (request.active() != null) {
            product.setActive(request.active());
        }
        return productMapper.toResponse(productRepository.save(product));
    }

    public ProductResponse update(UUID id, UpdateProductRequest request) {
        Product product = getProductOrThrow(id);
        Long brandId = request.brandId() != null ? request.brandId() : product.getBrandId();
        if (request.brandId() != null) {
            brandService.getActiveBrandOrThrow(request.brandId());
        }
        if (request.categoryId() != null) {
            categoryService.getActiveCategoryOrThrow(request.categoryId());
        }
        if (request.name() != null || request.brandId() != null) {
            String nameToCheck = request.name() != null ? request.name() : product.getName();
            validateUniqueName(brandId, nameToCheck, id);
        }
        productMapper.updateEntity(request, product);
        return productMapper.toResponse(productRepository.save(product));
    }

    public void deactivate(UUID id) {
        Product product = getProductOrThrow(id);
        product.setActive(false);
        productRepository.save(product);
    }

    public void softDelete(UUID id) {
        Product product = getProductOrThrow(id);
        product.setDeletedAt(Instant.now());
        product.setActive(false);
        productRepository.save(product);
    }

    @Transactional(readOnly = true)
    public Product getActiveProductOrThrow(UUID id) {
        Product product = getProductOrThrow(id);
        if (!product.isActive()) {
            throw new ProductNotFoundException(id);
        }
        return product;
    }

    @Transactional(readOnly = true)
    public Product getProductOrThrow(UUID id) {
        return productRepository.findById(id).orElseThrow(() -> new ProductNotFoundException(id));
    }

    private void validateUniqueName(Long brandId, String name, UUID excludeId) {
        productRepository
                .findByBrandIdAndNameIgnoreCase(brandId, name)
                .ifPresent(existing -> {
                    if (excludeId == null || !existing.getId().equals(excludeId)) {
                        throw new DuplicateProductNameException(name, brandId);
                    }
                });
    }
}
