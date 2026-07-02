package com.mobileshoperp.modules.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.auth.dto.LoginRequest;
import com.mobileshoperp.modules.auth.dto.LoginResponse;
import com.mobileshoperp.modules.auth.entity.Role;
import com.mobileshoperp.modules.auth.entity.User;
import com.mobileshoperp.modules.auth.exception.InvalidCredentialsException;
import com.mobileshoperp.modules.auth.repository.UserRepository;
import com.mobileshoperp.modules.utility.service.AuditLogService;
import com.mobileshoperp.security.JwtProperties;
import com.mobileshoperp.security.JwtUtil;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private JwtProperties jwtProperties;

    @Mock
    private AuditLogService auditLogService;

    @InjectMocks
    private AuthService authService;

    private User activeUser;

    @BeforeEach
    void setUp() {
        Role adminRole = Role.builder().id(1L).name("ADMIN").active(true).build();
        activeUser = new User();
        activeUser.setId(UUID.randomUUID());
        activeUser.setRole(adminRole);
        activeUser.setFirstName("System");
        activeUser.setLastName("Admin");
        activeUser.setMobile("9999999999");
        activeUser.setPassword("encoded");
        activeUser.setActive(true);
    }

    @Test
    void loginShouldReturnTokensForValidCredentials() {
        LoginRequest request = new LoginRequest("9999999999", "Admin@123456");

        when(userRepository.findByMobile("9999999999")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("Admin@123456", "encoded")).thenReturn(true);
        when(jwtUtil.generateAccessToken("9999999999", activeUser.getId(), "ADMIN")).thenReturn("access");
        when(jwtUtil.generateRefreshToken("9999999999", activeUser.getId())).thenReturn("refresh");
        when(jwtProperties.getExpirationMs()).thenReturn(28800000L);
        when(userRepository.save(activeUser)).thenReturn(activeUser);

        LoginResponse response = authService.login(request, "127.0.0.1");

        assertThat(response.accessToken()).isEqualTo("access");
        assertThat(response.refreshToken()).isEqualTo("refresh");
        assertThat(response.user().roleName()).isEqualTo("ADMIN");
        verify(auditLogService).recordLogin(activeUser.getId(), "127.0.0.1");
    }

    @Test
    void loginShouldRejectInvalidPassword() {
        LoginRequest request = new LoginRequest("9999999999", "wrong");

        when(userRepository.findByMobile("9999999999")).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches("wrong", "encoded")).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request, "127.0.0.1"))
                .isInstanceOf(InvalidCredentialsException.class);

        verify(userRepository, never()).save(any());
    }
}
