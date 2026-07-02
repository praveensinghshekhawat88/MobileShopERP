package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.product.dto.CategoryResponse;
import com.mobileshoperp.modules.product.dto.CategoryTreeNode;
import com.mobileshoperp.modules.product.dto.CreateCategoryRequest;
import com.mobileshoperp.modules.product.dto.UpdateCategoryRequest;
import com.mobileshoperp.modules.product.entity.Category;
import com.mobileshoperp.modules.product.exception.CategoryNotFoundException;
import com.mobileshoperp.modules.product.exception.CircularCategoryReferenceException;
import com.mobileshoperp.modules.product.mapper.CategoryMapper;
import com.mobileshoperp.modules.product.repository.CategoryRepository;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Transactional(readOnly = true)
    public Page<CategoryResponse> findAllActive(Pageable pageable) {
        return categoryRepository.findByActiveTrue(pageable).map(categoryMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<CategoryTreeNode> getTree() {
        List<Category> all = categoryRepository.findByActiveTrueOrderByNameAsc();
        Map<Long, List<Category>> childrenByParent = new HashMap<>();
        List<Category> roots = new ArrayList<>();

        for (Category category : all) {
            if (category.getParentId() == null) {
                roots.add(category);
            } else {
                childrenByParent
                        .computeIfAbsent(category.getParentId(), ignored -> new ArrayList<>())
                        .add(category);
            }
        }

        return roots.stream().map(root -> toTreeNode(root, childrenByParent)).toList();
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        return categoryMapper.toResponse(getCategoryOrThrow(id));
    }

    public CategoryResponse create(CreateCategoryRequest request) {
        validateParent(null, request.parentId());
        Category category = categoryMapper.toEntity(request);
        if (request.active() != null) {
            category.setActive(request.active());
        }
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    public CategoryResponse update(Long id, UpdateCategoryRequest request) {
        Category category = getCategoryOrThrow(id);
        Long newParentId = request.parentId() != null ? request.parentId() : category.getParentId();
        if (request.parentId() != null || request.name() != null || request.description() != null
                || request.active() != null) {
            validateParent(id, newParentId);
        }
        categoryMapper.updateEntity(request, category);
        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    public void deactivate(Long id) {
        Category category = getCategoryOrThrow(id);
        category.setActive(false);
        categoryRepository.save(category);
    }

    @Transactional(readOnly = true)
    public Category getActiveCategoryOrThrow(Long id) {
        Category category = getCategoryOrThrow(id);
        if (!category.isActive()) {
            throw new CategoryNotFoundException(id);
        }
        return category;
    }

    private Category getCategoryOrThrow(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new CategoryNotFoundException(id));
    }

    private void validateParent(Long categoryId, Long parentId) {
        if (parentId == null) {
            return;
        }
        if (categoryId != null && parentId.equals(categoryId)) {
            throw new CircularCategoryReferenceException();
        }
        Category parent = getCategoryOrThrow(parentId);
        if (!parent.isActive()) {
            throw new BusinessRuleException("Parent category is inactive");
        }
        Long ancestorId = parent.getParentId();
        while (ancestorId != null) {
            if (categoryId != null && ancestorId.equals(categoryId)) {
                throw new CircularCategoryReferenceException();
            }
            ancestorId = getCategoryOrThrow(ancestorId).getParentId();
        }
    }

    private CategoryTreeNode toTreeNode(Category category, Map<Long, List<Category>> childrenByParent) {
        List<CategoryTreeNode> children = childrenByParent.getOrDefault(category.getId(), List.of()).stream()
                .map(child -> toTreeNode(child, childrenByParent))
                .toList();
        return new CategoryTreeNode(
                category.getId(),
                category.getParentId(),
                category.getName(),
                category.getDescription(),
                category.isActive(),
                children);
    }
}
