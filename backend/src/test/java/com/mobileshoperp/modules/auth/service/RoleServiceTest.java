package com.mobileshoperp.modules.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.mobileshoperp.modules.auth.dto.CreateRoleRequest;
import com.mobileshoperp.modules.auth.dto.RoleResponse;
import com.mobileshoperp.modules.auth.entity.Role;
import com.mobileshoperp.modules.auth.exception.DuplicateRoleNameException;
import com.mobileshoperp.modules.auth.mapper.RoleMapper;
import com.mobileshoperp.modules.auth.repository.RoleRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class RoleServiceTest {

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private RoleMapper roleMapper;

    @InjectMocks
    private RoleService roleService;

    @Test
    void createShouldPersistRoleWhenNameIsUnique() {
        CreateRoleRequest request = new CreateRoleRequest("MANAGER", "Store manager", true);
        Role entity = Role.builder().id(3L).name("MANAGER").description("Store manager").active(true).build();
        RoleResponse response = new RoleResponse(3L, "MANAGER", "Store manager", true);

        when(roleRepository.existsByNameIgnoreCase("MANAGER")).thenReturn(false);
        when(roleMapper.toEntity(request)).thenReturn(entity);
        when(roleRepository.save(entity)).thenReturn(entity);
        when(roleMapper.toResponse(entity)).thenReturn(response);

        RoleResponse result = roleService.create(request);

        assertThat(result.name()).isEqualTo("MANAGER");
        verify(roleRepository).save(entity);
    }

    @Test
    void createShouldRejectDuplicateName() {
        CreateRoleRequest request = new CreateRoleRequest("ADMIN", "Duplicate", true);
        when(roleRepository.existsByNameIgnoreCase("ADMIN")).thenReturn(true);

        assertThatThrownBy(() -> roleService.create(request))
                .isInstanceOf(DuplicateRoleNameException.class);
    }
}
