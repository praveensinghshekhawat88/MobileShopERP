package com.mobileshoperp.modules.auth.repository;

import com.mobileshoperp.modules.auth.entity.User;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, UUID> {

    @EntityGraph(attributePaths = "role")
    Optional<User> findByMobile(String mobile);

    @Query("SELECT u FROM User u JOIN FETCH u.role WHERE u.id = :id")
    Optional<User> findByIdWithRole(@Param("id") UUID id);

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByMobile(String mobile);

    boolean existsByEmailIgnoreCase(String email);

    @EntityGraph(attributePaths = "role")
    Page<User> findByDeletedAtIsNullOrderByCreatedAtDesc(Pageable pageable);

    @EntityGraph(attributePaths = "role")
    Optional<User> findByIdAndDeletedAtIsNull(UUID id);
}
