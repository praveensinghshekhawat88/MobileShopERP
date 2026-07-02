package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.modules.product.dto.AttributeResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeRequest;
import com.mobileshoperp.modules.product.entity.Attribute;
import com.mobileshoperp.modules.product.exception.AttributeNotFoundException;
import com.mobileshoperp.modules.product.exception.DuplicateAttributeNameException;
import com.mobileshoperp.modules.product.mapper.AttributeMapper;
import com.mobileshoperp.modules.product.repository.AttributeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttributeService {

    private final AttributeRepository attributeRepository;
    private final AttributeMapper attributeMapper;
    private final AttributeGroupService attributeGroupService;

    @Transactional(readOnly = true)
    public Page<AttributeResponse> findAll(Long attributeGroupId, Pageable pageable) {
        Page<Attribute> page = attributeGroupId == null
                ? attributeRepository.findAllByOrderByNameAsc(pageable)
                : attributeRepository.findByAttributeGroupIdOrderByNameAsc(attributeGroupId, pageable);
        return page.map(attributeMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public AttributeResponse findById(Long id) {
        return attributeMapper.toResponse(getAttributeOrThrow(id));
    }

    public AttributeResponse create(CreateAttributeRequest request) {
        attributeGroupService.getAttributeGroupOrThrow(request.attributeGroupId());
        validateUniqueName(request.attributeGroupId(), request.name(), null);
        Attribute attribute = attributeMapper.toEntity(request);
        return attributeMapper.toResponse(attributeRepository.save(attribute));
    }

    public AttributeResponse update(Long id, UpdateAttributeRequest request) {
        Attribute attribute = getAttributeOrThrow(id);
        Long groupId = request.attributeGroupId() != null
                ? request.attributeGroupId()
                : attribute.getAttributeGroupId();
        if (request.attributeGroupId() != null) {
            attributeGroupService.getAttributeGroupOrThrow(request.attributeGroupId());
        }
        if (request.name() != null || request.attributeGroupId() != null) {
            String nameToCheck = request.name() != null ? request.name() : attribute.getName();
            validateUniqueName(groupId, nameToCheck, id);
        }
        attributeMapper.updateEntity(request, attribute);
        return attributeMapper.toResponse(attributeRepository.save(attribute));
    }

    public void delete(Long id) {
        Attribute attribute = getAttributeOrThrow(id);
        attributeRepository.delete(attribute);
    }

    @Transactional(readOnly = true)
    public Attribute getAttributeOrThrow(Long id) {
        return attributeRepository.findById(id).orElseThrow(() -> new AttributeNotFoundException(id));
    }

    private void validateUniqueName(Long attributeGroupId, String name, Long excludeId) {
        attributeRepository
                .findByAttributeGroupIdAndNameIgnoreCase(attributeGroupId, name)
                .ifPresent(existing -> {
                    if (excludeId == null || !existing.getId().equals(excludeId)) {
                        throw new DuplicateAttributeNameException(name, attributeGroupId);
                    }
                });
    }
}
