package com.mobileshoperp.modules.purchase.repository;

import com.mobileshoperp.modules.purchase.entity.Purchase;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseRepository extends JpaRepository<Purchase, UUID> {

    Optional<Purchase> findByInvoiceNumberIgnoreCase(String invoiceNumber);

    Page<Purchase> findBySupplierIdOrderByInvoiceDateDesc(UUID supplierId, Pageable pageable);

    Page<Purchase> findAllByOrderByInvoiceDateDesc(Pageable pageable);
}
