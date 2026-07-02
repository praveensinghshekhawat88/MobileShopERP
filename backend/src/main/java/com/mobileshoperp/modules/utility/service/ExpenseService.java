package com.mobileshoperp.modules.utility.service;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.utility.dto.CreateExpenseRequest;
import com.mobileshoperp.modules.utility.dto.ExpenseResponse;
import com.mobileshoperp.modules.utility.dto.UpdateExpenseRequest;
import com.mobileshoperp.modules.utility.entity.Expense;
import com.mobileshoperp.modules.utility.exception.ExpenseNotFoundException;
import com.mobileshoperp.modules.utility.mapper.ExpenseMapper;
import com.mobileshoperp.modules.utility.repository.ExpenseRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    @Transactional(readOnly = true)
    public Page<ExpenseResponse> findAll(LocalDate from, LocalDate to, Pageable pageable) {
        validateDateRange(from, to);
        Page<Expense> page = from != null && to != null
                ? expenseRepository.findByExpenseDateBetweenOrderByExpenseDateDesc(from, to, pageable)
                : expenseRepository.findAllByOrderByExpenseDateDesc(pageable);
        return page.map(expenseMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public ExpenseResponse findById(UUID id) {
        return expenseMapper.toResponse(getExpenseOrThrow(id));
    }

    public ExpenseResponse create(CreateExpenseRequest request) {
        validatePositiveAmount(request.amount());
        Expense expense = expenseMapper.toEntity(request);
        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    public ExpenseResponse update(UUID id, UpdateExpenseRequest request) {
        Expense expense = getExpenseOrThrow(id);
        if (request.amount() != null) {
            validatePositiveAmount(request.amount());
        }
        expenseMapper.updateEntity(request, expense);
        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    public void softDelete(UUID id) {
        Expense expense = getExpenseOrThrow(id);
        expense.setDeletedAt(Instant.now());
        expenseRepository.save(expense);
    }

    @Transactional(readOnly = true)
    public Expense getExpenseOrThrow(UUID id) {
        return expenseRepository.findById(id).orElseThrow(() -> new ExpenseNotFoundException(id));
    }

    private void validatePositiveAmount(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Expense amount must be positive");
        }
    }

    private void validateDateRange(LocalDate from, LocalDate to) {
        if (from == null && to == null) {
            return;
        }
        if (from == null || to == null) {
            throw new BusinessRuleException("Both from and to are required for date range filter");
        }
        if (from.isAfter(to)) {
            throw new BusinessRuleException("'from' must be before or equal to 'to'");
        }
    }
}
