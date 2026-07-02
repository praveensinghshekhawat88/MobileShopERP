package com.mobileshoperp.modules.utility.controller;

import com.mobileshoperp.common.constants.ApiConstants;
import com.mobileshoperp.common.dto.ApiResponse;
import com.mobileshoperp.common.enums.ReferenceType;
import com.mobileshoperp.modules.utility.dto.CreatePaymentRequest;
import com.mobileshoperp.modules.utility.dto.PaymentBalanceResponse;
import com.mobileshoperp.modules.utility.dto.PaymentResponse;
import com.mobileshoperp.modules.utility.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Payments")
@RestController
@RequestMapping(ApiConstants.API_V1 + "/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Operation(summary = "Record a payment against a sale, purchase, or other reference")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<PaymentResponse> create(@Valid @RequestBody CreatePaymentRequest request) {
        return ApiResponse.success("Payment recorded", paymentService.recordPayment(request.toRecordPaymentRequest()));
    }

    @Operation(summary = "Get payment history for a reference")
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<List<PaymentResponse>> getHistory(
            @RequestParam ReferenceType referenceType, @RequestParam UUID referenceId) {
        return ApiResponse.success(paymentService.getHistory(referenceType, referenceId));
    }

    @Operation(summary = "Get pending balance for a reference")
    @GetMapping("/balance")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<PaymentBalanceResponse> getBalance(
            @RequestParam ReferenceType referenceType, @RequestParam UUID referenceId) {
        return ApiResponse.success(paymentService.getBalance(referenceType, referenceId));
    }

    @Operation(summary = "Get payment by id")
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STAFF')")
    public ApiResponse<PaymentResponse> findById(@PathVariable UUID id) {
        return ApiResponse.success(paymentService.findById(id));
    }
}
