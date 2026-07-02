package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.product.dto.CreateBrandRequest;
import com.mobileshoperp.modules.product.entity.Brand;
import com.mobileshoperp.modules.product.exception.DuplicateBrandNameException;
import com.mobileshoperp.modules.product.mapper.BrandMapper;
import com.mobileshoperp.modules.product.repository.BrandRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BrandServiceTest {

    @Mock
    private BrandRepository brandRepository;

    @Mock
    private BrandMapper brandMapper;

    @InjectMocks
    private BrandService brandService;

    @Test
    void createShouldRejectDuplicateName() {
        CreateBrandRequest request = new CreateBrandRequest("Samsung", "Phones", true);
        when(brandRepository.existsByNameIgnoreCase("Samsung")).thenReturn(true);

        assertThatThrownBy(() -> brandService.create(request))
                .isInstanceOf(DuplicateBrandNameException.class);
    }

    @Test
    void deactivateShouldSetInactive() {
        Brand brand = Brand.builder().id(1L).name("Samsung").active(true).build();
        when(brandRepository.findById(1L)).thenReturn(java.util.Optional.of(brand));
        when(brandRepository.save(brand)).thenReturn(brand);

        brandService.deactivate(1L);

        assertThat(brand.isActive()).isFalse();
        verify(brandRepository).save(brand);
    }
}
