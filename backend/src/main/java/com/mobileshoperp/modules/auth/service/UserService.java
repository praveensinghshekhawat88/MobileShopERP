package com.mobileshoperp.modules.auth.service;

import com.mobileshoperp.modules.auth.dto.CreateUserRequest;
import com.mobileshoperp.modules.auth.dto.UpdateUserRequest;
import com.mobileshoperp.modules.auth.dto.UserResponse;
import com.mobileshoperp.modules.auth.entity.Role;
import com.mobileshoperp.modules.auth.entity.User;
import com.mobileshoperp.modules.auth.exception.DuplicateEmailException;
import com.mobileshoperp.modules.auth.exception.DuplicateMobileException;
import com.mobileshoperp.modules.auth.exception.UserNotFoundException;
import com.mobileshoperp.modules.auth.mapper.UserMapper;
import com.mobileshoperp.modules.auth.repository.UserRepository;
import java.time.Instant;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public Page<UserResponse> findAll(Pageable pageable) {
        return userRepository.findByDeletedAtIsNullOrderByCreatedAtDesc(pageable).map(userMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public UserResponse findById(UUID id) {
        return userMapper.toResponse(getUserOrThrow(id));
    }

    public UserResponse create(CreateUserRequest request) {
        validateUniqueMobile(request.mobile(), null);
        validateUniqueEmail(request.email(), null);

        Role role = roleService.getActiveRoleOrThrow(request.roleId());
        User user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setMobile(request.mobile());
        user.setEmail(request.email());
        user.setRole(role);
        user.setActive(true);
        user.setPassword(passwordEncoder.encode(request.password()));
        return userMapper.toResponse(userRepository.save(user));
    }

    public UserResponse update(UUID id, UpdateUserRequest request) {
        User user = getUserOrThrow(id);

        if (request.mobile() != null) {
            validateUniqueMobile(request.mobile(), id);
        }
        if (request.email() != null) {
            validateUniqueEmail(request.email(), id);
        }
        if (request.roleId() != null) {
            user.setRole(roleService.getActiveRoleOrThrow(request.roleId()));
        }
        userMapper.updateEntity(request, user);
        if (request.password() != null && !request.password().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }
        if (request.active() != null) {
            user.setActive(request.active());
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    public void softDelete(UUID id) {
        User user = getUserOrThrow(id);
        user.setDeletedAt(Instant.now());
        user.setActive(false);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User getUserOrThrow(UUID id) {
        return userRepository
                .findByIdAndDeletedAtIsNull(id)
                .orElseThrow(() -> new UserNotFoundException(id.toString()));
    }

    @Transactional(readOnly = true)
    public User getByMobileOrThrow(String mobile) {
        return userRepository.findByMobile(mobile)
                .filter(user -> user.getDeletedAt() == null)
                .orElseThrow(() -> new UserNotFoundException(mobile));
    }

    private void validateUniqueMobile(String mobile, UUID excludeId) {
        userRepository.findByMobile(mobile).ifPresent(existing -> {
            if (existing.getDeletedAt() != null) {
                return;
            }
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new DuplicateMobileException(mobile);
            }
        });
    }

    private void validateUniqueEmail(String email, UUID excludeId) {
        if (email == null || email.isBlank()) {
            return;
        }
        userRepository.findByEmailIgnoreCase(email).ifPresent(existing -> {
            if (existing.getDeletedAt() != null) {
                return;
            }
            if (excludeId == null || !existing.getId().equals(excludeId)) {
                throw new DuplicateEmailException(email);
            }
        });
    }
}
