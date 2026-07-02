package com.mobileshoperp.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.mobileshoperp.modules.auth.entity.Role;
import com.mobileshoperp.modules.auth.entity.User;
import com.mobileshoperp.modules.auth.repository.UserRepository;
import jakarta.servlet.FilterChain;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterTest {

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private UserRepository userRepository;

    @Mock
    private FilterChain filterChain;

    private JwtAuthenticationFilter filter;

    @BeforeEach
    void setUp() {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        filter = new JwtAuthenticationFilter(jwtUtil, userRepository, objectMapper);
        SecurityContextHolder.clearContext();
    }

    @Test
    void shouldRejectRefreshTokenUsedAsBearer() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer refresh-token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        when(jwtUtil.isTokenValid("refresh-token")).thenReturn(true);
        when(jwtUtil.isRefreshToken("refresh-token")).thenReturn(true);

        filter.doFilterInternal(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(401);
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldRejectInactiveUser() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer access-token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        User user = new User();
        user.setMobile("9999999999");
        user.setActive(false);
        Role role = new Role();
        role.setName("ADMIN");
        user.setRole(role);

        when(jwtUtil.isTokenValid("access-token")).thenReturn(true);
        when(jwtUtil.isRefreshToken("access-token")).thenReturn(false);
        when(jwtUtil.isAccessToken("access-token")).thenReturn(true);
        when(jwtUtil.extractUsername("access-token")).thenReturn("9999999999");
        when(userRepository.findByMobile("9999999999")).thenReturn(Optional.of(user));

        filter.doFilterInternal(request, response, filterChain);

        assertThat(response.getStatus()).isEqualTo(401);
        verify(filterChain, never()).doFilter(any(), any());
    }

    @Test
    void shouldAuthenticateActiveUser() throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer access-token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        UUID userId = UUID.randomUUID();
        User user = new User();
        user.setId(userId);
        user.setMobile("9999999999");
        user.setActive(true);
        Role role = new Role();
        role.setName("ADMIN");
        user.setRole(role);

        when(jwtUtil.isTokenValid("access-token")).thenReturn(true);
        when(jwtUtil.isRefreshToken("access-token")).thenReturn(false);
        when(jwtUtil.isAccessToken("access-token")).thenReturn(true);
        when(jwtUtil.extractUsername("access-token")).thenReturn("9999999999");
        when(jwtUtil.extractUserId("access-token")).thenReturn(userId);
        when(jwtUtil.extractRole("access-token")).thenReturn("ADMIN");
        when(userRepository.findByMobile("9999999999")).thenReturn(Optional.of(user));

        filter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertThat(SecurityContextHolder.getContext().getAuthentication()).isNotNull();
        assertThat(SecurityContextHolder.getContext().getAuthentication().getPrincipal())
                .isInstanceOf(AuthenticatedUser.class);
    }
}
