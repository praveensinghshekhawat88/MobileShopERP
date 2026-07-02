package com.mobileshoperp.modules.inventory.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.modules.inventory.dto.StockMovementResponse;
import com.mobileshoperp.modules.inventory.service.StockMovementService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Stock Movements")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/stock-movements")
@RequiredArgsConstructor
public class StockMovementController {

    private final StockMovementService stockMovementService;

    @Operation(summary = "List stock movements (paginated; filter by stock, reference, or date range)")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<Page<StockMovementResponse>> findAll(
            @RequestParam(required = false) UUID stockId,
            @RequestParam(required = false) ReferenceType referenceType,
            @RequestParam(required = false) UUID referenceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant to,
            Pageable pageable) {
        return ApiResponse.success(
                stockMovementService.findAll(stockId, referenceType, referenceId, from, to, pageable));
    }

    @Operation(summary = "Get stock movement by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<StockMovementResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(stockMovementService.findById(id));
    }
}
