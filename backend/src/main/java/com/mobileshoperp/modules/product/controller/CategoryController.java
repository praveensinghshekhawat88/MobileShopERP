package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.CategoryResponse;
import com.mobileshoperp.modules.product.dto.CategoryTreeNode;
import com.mobileshoperp.modules.product.dto.CreateCategoryRequest;
import com.mobileshoperp.modules.product.dto.UpdateCategoryRequest;
import com.mobileshoperp.modules.product.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Categories")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "List active categories (paginated, flat)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<CategoryResponse>> findAllActive(Pageable pageable) {
        return ApiResponse.success(categoryService.findAllActive(pageable));
    }

    @Operation(summary = "Get active category hierarchy as a tree")
    @GetMapping("/tree")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<CategoryTreeNode>> getTree() {
        return ApiResponse.success(categoryService.getTree());
    }

    @Operation(summary = "Get category by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<CategoryResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(categoryService.findById(id));
    }

    @Operation(summary = "Create category")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CategoryResponse> create(@Valid @RequestBody CreateCategoryRequest request) {
        return ApiResponse.success("Category created", categoryService.create(request));
    }

    @Operation(summary = "Update category")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<CategoryResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateCategoryRequest request) {
        return ApiResponse.success("Category updated", categoryService.update(id, request));
    }

    @Operation(summary = "Deactivate category")
    @PatchMapping("/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> deactivate(@PathVariable Long id) {
        categoryService.deactivate(id);
        return ApiResponse.success("Category deactivated", null);
    }
}
