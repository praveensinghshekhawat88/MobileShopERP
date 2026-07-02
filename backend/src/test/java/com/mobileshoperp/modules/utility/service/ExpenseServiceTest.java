package com.mobileshoperp.modules.utility.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.exception.BusinessRuleException;
import com.mobileshoperp.modules.utility.dto.CreateExpenseRequest;
import com.mobileshoperp.modules.utility.dto.ExpenseResponse;
import com.mobileshoperp.modules.utility.entity.Expense;
import com.mobileshoperp.modules.utility.exception.ExpenseNotFoundException;
import com.mobileshoperp.modules.utility.mapper.ExpenseMapper;
import com.mobileshoperp.modules.utility.repository.ExpenseRepository;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private ExpenseMapper expenseMapper;

    @InjectMocks
    private ExpenseService expenseService;

    @Test
    void create_persistsPositiveAmount() {
        CreateExpenseRequest request =
                new CreateExpenseRequest("Shop rent", new BigDecimal("15000.00"), LocalDate.of(2025, 6, 1), "June");
        Expense expense = new Expense();
        expense.setId(UUID.randomUUID());

        when(expenseMapper.toEntity(request)).thenReturn(new Expense());
        when(expenseRepository.save(any(Expense.class))).thenReturn(expense);
        when(expenseMapper.toResponse(expense))
                .thenReturn(new ExpenseResponse(
                        expense.getId(), "Shop rent", new BigDecimal("15000.00"), LocalDate.of(2025, 6, 1), "June"));

        ExpenseResponse response = expenseService.create(request);

        assertThat(response.amount()).isEqualByComparingTo("15000.00");
        verify(expenseRepository).save(any(Expense.class));
    }

    @Test
    void create_rejectsNonPositiveAmount() {
        CreateExpenseRequest request =
                new CreateExpenseRequest("Invalid", BigDecimal.ZERO, LocalDate.now(), null);

        assertThatThrownBy(() -> expenseService.create(request)).isInstanceOf(BusinessRuleException.class);
    }

    @Test
    void softDelete_setsDeletedAt() {
        UUID id = UUID.randomUUID();
        Expense expense = new Expense();
        expense.setId(id);

        when(expenseRepository.findById(id)).thenReturn(Optional.of(expense));
        when(expenseRepository.save(expense)).thenReturn(expense);

        expenseService.softDelete(id);

        assertThat(expense.getDeletedAt()).isNotNull();
    }

    @Test
    void getExpenseOrThrow_whenMissing_raises() {
        UUID id = UUID.randomUUID();
        when(expenseRepository.findById(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> expenseService.getExpenseOrThrow(id)).isInstanceOf(ExpenseNotFoundException.class);
    }
}
