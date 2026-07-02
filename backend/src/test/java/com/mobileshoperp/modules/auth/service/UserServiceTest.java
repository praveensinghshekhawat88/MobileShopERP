package com.mobileshoperp.modules.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.auth.dto.CreateUserRequest;
import com.mobileshoperp.modules.auth.dto.UserResponse;
import com.mobileshoperp.modules.auth.entity.Role;
import com.mobileshoperp.modules.auth.entity.User;
import com.mobileshoperp.modules.auth.exception.UserNotFoundException;
import com.mobileshoperp.modules.auth.mapper.UserMapper;
import com.mobileshoperp.modules.auth.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private RoleService roleService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void findAllShouldReturnOnlyActiveUsersPage() {
        User user = activeUser();
        UserResponse response = userResponse(user);
        Page<User> page = new PageImpl<>(List.of(user));
        when(userRepository.findByDeletedAtIsNullOrderByCreatedAtDesc(PageRequest.of(0, 10)))
                .thenReturn(page);
        when(userMapper.toResponse(user)).thenReturn(response);

        Page<UserResponse> result = userService.findAll(PageRequest.of(0, 10));

        assertThat(result.getContent()).hasSize(1);
        verify(userRepository).findByDeletedAtIsNullOrderByCreatedAtDesc(PageRequest.of(0, 10));
    }

    @Test
    void getUserOrThrowShouldRejectSoftDeletedUser() {
        UUID id = UUID.randomUUID();
        when(userRepository.findByIdAndDeletedAtIsNull(id)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserOrThrow(id)).isInstanceOf(UserNotFoundException.class);
    }

    @Test
    void createShouldPersistEncodedPassword() {
        Role role = new Role();
        role.setId(1L);
        role.setName("ADMIN");

        CreateUserRequest request =
                new CreateUserRequest(1L, "Jane", "Doe", "8888888888", "jane@test.com", "Password1!");
        User saved = activeUser();
        saved.setMobile("8888888888");

        when(userRepository.findByMobile("8888888888")).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase("jane@test.com")).thenReturn(Optional.empty());
        when(roleService.getActiveRoleOrThrow(1L)).thenReturn(role);
        when(passwordEncoder.encode("Password1!")).thenReturn("encoded");
        when(userRepository.save(any(User.class))).thenReturn(saved);
        when(userMapper.toResponse(saved)).thenReturn(userResponse(saved));

        userService.create(request);

        verify(passwordEncoder).encode("Password1!");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void softDeletedMobileShouldNotBlockRecreateValidation() {
        User deleted = activeUser();
        deleted.setDeletedAt(Instant.now());

        when(userRepository.findByMobile("7777777777")).thenReturn(Optional.of(deleted));

        Role role = new Role();
        role.setId(1L);
        CreateUserRequest request =
                new CreateUserRequest(1L, "New", "User", "7777777777", null, "Password1!");
        when(roleService.getActiveRoleOrThrow(1L)).thenReturn(role);
        when(passwordEncoder.encode(any())).thenReturn("encoded");
        User saved = activeUser();
        saved.setMobile("7777777777");
        when(userRepository.save(any(User.class))).thenReturn(saved);
        when(userMapper.toResponse(saved)).thenReturn(userResponse(saved));

        userService.create(request);

        verify(userRepository).save(any(User.class));
    }

    private User activeUser() {
        Role role = new Role();
        role.setId(1L);
        role.setName("ADMIN");
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setRole(role);
        user.setFirstName("System");
        user.setLastName("Admin");
        user.setMobile("9999999999");
        user.setActive(true);
        return user;
    }

    private UserResponse userResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getRole().getId(),
                user.getRole().getName(),
                user.getFirstName(),
                user.getLastName(),
                user.getMobile(),
                user.getEmail(),
                user.isActive(),
                null);
    }
}
