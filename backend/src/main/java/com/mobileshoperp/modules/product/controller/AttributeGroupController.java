package com.mobileshoperp.modules.product.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.product.dto.AttributeGroupResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeGroupRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeGroupRequest;
import com.mobileshoperp.modules.product.service.AttributeGroupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Attribute Groups")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/attribute-groups")
@RequiredArgsConstructor
public class AttributeGroupController {

    private final AttributeGroupService attributeGroupService;

    @Operation(summary = "List attribute groups (paginated)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<AttributeGroupResponse>> findAll(Pageable pageable) {
        return ApiResponse.success(attributeGroupService.findAll(pageable));
    }

    @Operation(summary = "Get attribute group by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<AttributeGroupResponse> findById(@PathVariable Long id) {
        return ApiResponse.success(attributeGroupService.findById(id));
    }

    @Operation(summary = "Create attribute group")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AttributeGroupResponse> create(@Valid @RequestBody CreateAttributeGroupRequest request) {
        return ApiResponse.success("Attribute group created", attributeGroupService.create(request));
    }

    @Operation(summary = "Update attribute group")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<AttributeGroupResponse> update(
            @PathVariable Long id, @Valid @RequestBody UpdateAttributeGroupRequest request) {
        return ApiResponse.success("Attribute group updated", attributeGroupService.update(id, request));
    }

    @Operation(summary = "Delete attribute group")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        attributeGroupService.delete(id);
        return ApiResponse.success("Attribute group deleted", null);
    }
}
