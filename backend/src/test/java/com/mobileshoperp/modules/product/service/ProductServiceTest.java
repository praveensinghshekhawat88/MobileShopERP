package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.product.dto.CreateProductRequest;
import com.mobileshoperp.modules.product.entity.Brand;
import com.mobileshoperp.modules.product.entity.Category;
import com.mobileshoperp.modules.product.entity.Product;
import com.mobileshoperp.modules.product.exception.DuplicateProductNameException;
import com.mobileshoperp.modules.product.mapper.ProductMapper;
import com.mobileshoperp.modules.product.repository.ProductRepository;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private BrandService brandService;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductService productService;

    @Test
    void createShouldRejectDuplicateNameWithinBrand() {
        CreateProductRequest request =
                new CreateProductRequest(1L, 2L, "Galaxy S25", "S25", "8517", null, true);
        when(brandService.getActiveBrandOrThrow(1L))
                .thenReturn(Brand.builder().id(1L).name("Samsung").active(true).build());
        when(categoryService.getActiveCategoryOrThrow(2L))
                .thenReturn(Category.builder().id(2L).name("Mobiles").active(true).build());
        when(productRepository.findByBrandIdAndNameIgnoreCase(1L, "Galaxy S25"))
                .thenReturn(Optional.of(new Product()));

        assertThatThrownBy(() -> productService.create(request))
                .isInstanceOf(DuplicateProductNameException.class);
    }

    @Test
    void softDeleteShouldSetDeletedAtAndInactive() {
        UUID id = UUID.randomUUID();
        Product product = new Product();
        product.setId(id);
        product.setBrandId(1L);
        product.setCategoryId(2L);
        product.setName("Galaxy S25");
        product.setActive(true);
        when(productRepository.findById(id)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);

        productService.softDelete(id);

        assertThat(product.getDeletedAt()).isNotNull();
        assertThat(product.isActive()).isFalse();
        verify(productRepository).save(product);
    }
}
