package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.modules.product.dto.BrandResponse;
import com.mobileshoperp.modules.product.dto.CreateBrandRequest;
import com.mobileshoperp.modules.product.dto.UpdateBrandRequest;
import com.mobileshoperp.modules.product.entity.Brand;
import com.mobileshoperp.modules.product.exception.BrandNotFoundException;
import com.mobileshoperp.modules.product.exception.DuplicateBrandNameException;
import com.mobileshoperp.modules.product.mapper.BrandMapper;
import com.mobileshoperp.modules.product.repository.BrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class BrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Transactional(readOnly = true)
    public Page<BrandResponse> findAllActive(Pageable pageable) {
        return brandRepository.findByActiveTrue(pageable).map(brandMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public BrandResponse findById(Long id) {
        return brandMapper.toResponse(getBrandOrThrow(id));
    }

    public BrandResponse create(CreateBrandRequest request) {
        if (brandRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateBrandNameException(request.name());
        }
        Brand brand = brandMapper.toEntity(request);
        if (request.active() != null) {
            brand.setActive(request.active());
        }
        return brandMapper.toResponse(brandRepository.save(brand));
    }

    public BrandResponse update(Long id, UpdateBrandRequest request) {
        Brand brand = getBrandOrThrow(id);
        if (request.name() != null && !request.name().equalsIgnoreCase(brand.getName())
                && brandRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateBrandNameException(request.name());
        }
        brandMapper.updateEntity(request, brand);
        return brandMapper.toResponse(brandRepository.save(brand));
    }

    public void deactivate(Long id) {
        Brand brand = getBrandOrThrow(id);
        brand.setActive(false);
        brandRepository.save(brand);
    }

    @Transactional(readOnly = true)
    public Brand getActiveBrandOrThrow(Long id) {
        Brand brand = getBrandOrThrow(id);
        if (!brand.isActive()) {
            throw new BrandNotFoundException(id);
        }
        return brand;
    }

    private Brand getBrandOrThrow(Long id) {
        return brandRepository.findById(id).orElseThrow(() -> new BrandNotFoundException(id));
    }
}
