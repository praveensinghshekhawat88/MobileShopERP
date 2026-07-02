package com.mobileshoperp.modules.sales.repository;

import com.mobileshoperp.modules.sales.entity.Sale;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, UUID> {

    Optional<Sale> findByInvoiceNumberIgnoreCase(String invoiceNumber);

    Page<Sale> findByCustomerIdOrderByInvoiceDateDesc(UUID customerId, Pageable pageable);

    Page<Sale> findAllByOrderByInvoiceDateDesc(Pageable pageable);

    long countByInvoiceNumberStartingWithIgnoreCase(String prefix);
}
