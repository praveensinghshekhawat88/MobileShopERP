package com.mobileshoperp.modules.auth.repository;

import com.mobileshoperp.modules.auth.entity.Role;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCase(String name);

    List<Role> findByActiveTrueOrderByNameAsc();
}
