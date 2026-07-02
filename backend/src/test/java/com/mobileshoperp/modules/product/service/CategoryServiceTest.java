package com.mobileshoperp.modules.product.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.product.dto.UpdateCategoryRequest;
import com.mobileshoperp.modules.product.entity.Category;
import com.mobileshoperp.modules.product.exception.CircularCategoryReferenceException;
import com.mobileshoperp.modules.product.mapper.CategoryMapper;
import com.mobileshoperp.modules.product.repository.CategoryRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void updateShouldRejectSelfAsParent() {
        Category category = Category.builder().id(1L).name("Electronics").active(true).build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));

        UpdateCategoryRequest request = new UpdateCategoryRequest(1L, null, null, null);

        assertThatThrownBy(() -> categoryService.update(1L, request))
                .isInstanceOf(CircularCategoryReferenceException.class);
    }

    @Test
    void updateShouldRejectCircularParentReference() {
        Category electronics = Category.builder().id(1L).name("Electronics").active(true).build();
        Category mobiles = Category.builder().id(2L).parentId(1L).name("Mobiles").active(true).build();
        Category android = Category.builder().id(3L).parentId(2L).name("Android").active(true).build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(electronics));
        when(categoryRepository.findById(3L)).thenReturn(Optional.of(android));
        when(categoryRepository.findById(2L)).thenReturn(Optional.of(mobiles));

        UpdateCategoryRequest request = new UpdateCategoryRequest(3L, null, null, null);

        assertThatThrownBy(() -> categoryService.update(1L, request))
                .isInstanceOf(CircularCategoryReferenceException.class);
    }

    @Test
    void deactivateShouldSetInactive() {
        Category category = Category.builder().id(1L).name("Electronics").active(true).build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(categoryRepository.save(category)).thenReturn(category);

        categoryService.deactivate(1L);

        assertThat(category.isActive()).isFalse();
        verify(categoryRepository).save(category);
    }
}
