package com.mobileshoperp.modules.business.repository;

import com.mobileshoperp.modules.business.entity.Supplier;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {

    Optional<Supplier> findByMobile(String mobile);

    Page<Supplier> findBySupplierNameContainingIgnoreCaseOrderBySupplierNameAsc(
            String supplierName, Pageable pageable);

    Page<Supplier> findByMobileContainingOrderBySupplierNameAsc(String mobile, Pageable pageable);

    Page<Supplier> findAllByOrderBySupplierNameAsc(Pageable pageable);
}
