package com.mobileshoperp.modules.business.repository;

import com.mobileshoperp.modules.business.entity.Customer;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerRepository extends JpaRepository<Customer, UUID> {

    Optional<Customer> findByMobile(String mobile);

    Page<Customer> findByNameContainingIgnoreCaseOrderByNameAsc(String name, Pageable pageable);

    Page<Customer> findByMobileContainingOrderByNameAsc(String mobile, Pageable pageable);

    Page<Customer> findAllByOrderByNameAsc(Pageable pageable);
}
