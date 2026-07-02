package com.mobileshoperp.modules.auth.service;

import com.mobileshoperp.modules.auth.dto.CreateRoleRequest;
import com.mobileshoperp.modules.auth.dto.RoleResponse;
import com.mobileshoperp.modules.auth.dto.UpdateRoleRequest;
import com.mobileshoperp.modules.auth.entity.Role;
import com.mobileshoperp.modules.auth.exception.DuplicateRoleNameException;
import com.mobileshoperp.modules.auth.exception.RoleNotFoundException;
import com.mobileshoperp.modules.auth.mapper.RoleMapper;
import com.mobileshoperp.modules.auth.repository.RoleRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Transactional(readOnly = true)
    public List<RoleResponse> findAllActive() {
        return roleRepository.findByActiveTrueOrderByNameAsc().stream()
                .map(roleMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public RoleResponse findById(Long id) {
        return roleMapper.toResponse(getRoleOrThrow(id));
    }

    public RoleResponse create(CreateRoleRequest request) {
        if (roleRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateRoleNameException(request.name());
        }
        Role role = roleMapper.toEntity(request);
        if (request.active() != null) {
            role.setActive(request.active());
        }
        return roleMapper.toResponse(roleRepository.save(role));
    }

    public RoleResponse update(Long id, UpdateRoleRequest request) {
        Role role = getRoleOrThrow(id);
        if (request.name() != null && !request.name().equalsIgnoreCase(role.getName())
                && roleRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateRoleNameException(request.name());
        }
        roleMapper.updateEntity(request, role);
        return roleMapper.toResponse(roleRepository.save(role));
    }

    public void deactivate(Long id) {
        Role role = getRoleOrThrow(id);
        role.setActive(false);
        roleRepository.save(role);
    }

    @Transactional(readOnly = true)
    public Role getActiveRoleOrThrow(Long id) {
        Role role = getRoleOrThrow(id);
        if (!role.isActive()) {
            throw new RoleNotFoundException(id);
        }
        return role;
    }

    private Role getRoleOrThrow(Long id) {
        return roleRepository.findById(id).orElseThrow(() -> new RoleNotFoundException(id));
    }
}
