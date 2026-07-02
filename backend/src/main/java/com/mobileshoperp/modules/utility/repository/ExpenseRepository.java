package com.mobileshoperp.modules.utility.repository;

import com.mobileshoperp.modules.utility.entity.Expense;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepository extends JpaRepository<Expense, UUID> {

    Page<Expense> findAllByOrderByExpenseDateDesc(Pageable pageable);

    Page<Expense> findByExpenseDateBetweenOrderByExpenseDateDesc(
            LocalDate from, LocalDate to, Pageable pageable);
}
