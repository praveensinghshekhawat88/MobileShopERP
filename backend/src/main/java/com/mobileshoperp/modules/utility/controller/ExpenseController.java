package com.mobileshoperp.modules.utility.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.modules.utility.dto.CreateExpenseRequest;
import com.mobileshoperp.modules.utility.dto.ExpenseResponse;
import com.mobileshoperp.modules.utility.dto.UpdateExpenseRequest;
import com.mobileshoperp.modules.utility.service.ExpenseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Expenses")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;

    @Operation(summary = "List expenses (paginated, optional date range filter)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<ExpenseResponse>> findAll(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            Pageable pageable) {
        return ApiResponse.success(expenseService.findAll(from, to, pageable));
    }

    @Operation(summary = "Get expense by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<ExpenseResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(expenseService.findById(id));
    }

    @Operation(summary = "Create expense")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ExpenseResponse> create(@Valid @RequestBody CreateExpenseRequest request) {
        return ApiResponse.success("Expense created", expenseService.create(request));
    }

    @Operation(summary = "Update expense")
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<ExpenseResponse> update(
            @PathVariable UUID id, @Valid @RequestBody UpdateExpenseRequest request) {
        return ApiResponse.success("Expense updated", expenseService.update(id, request));
    }

    @Operation(summary = "Soft delete expense")
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable UUID id) {
        expenseService.softDelete(id);
        return ApiResponse.success("Expense deleted", null);
    }
}
