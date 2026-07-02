package com.mobileshoperp.modules.product.repository;

import com.mobileshoperp.modules.product.entity.Category;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Page<Category> findByActiveTrue(Pageable pageable);

    List<Category> findByActiveTrueOrderByNameAsc();
}
