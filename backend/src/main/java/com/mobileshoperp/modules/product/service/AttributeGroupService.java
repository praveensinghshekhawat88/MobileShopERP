package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.modules.product.dto.AttributeGroupResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeGroupRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeGroupRequest;
import com.mobileshoperp.modules.product.entity.AttributeGroup;
import com.mobileshoperp.modules.product.exception.AttributeGroupNotFoundException;
import com.mobileshoperp.modules.product.exception.DuplicateAttributeGroupNameException;
import com.mobileshoperp.modules.product.mapper.AttributeGroupMapper;
import com.mobileshoperp.modules.product.repository.AttributeGroupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttributeGroupService {

    private final AttributeGroupRepository attributeGroupRepository;
    private final AttributeGroupMapper attributeGroupMapper;

    @Transactional(readOnly = true)
    public Page<AttributeGroupResponse> findAll(Pageable pageable) {
        return attributeGroupRepository.findAllByOrderByNameAsc(pageable).map(attributeGroupMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public AttributeGroupResponse findById(Long id) {
        return attributeGroupMapper.toResponse(getAttributeGroupOrThrow(id));
    }

    public AttributeGroupResponse create(CreateAttributeGroupRequest request) {
        if (attributeGroupRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateAttributeGroupNameException(request.name());
        }
        AttributeGroup attributeGroup = attributeGroupMapper.toEntity(request);
        return attributeGroupMapper.toResponse(attributeGroupRepository.save(attributeGroup));
    }

    public AttributeGroupResponse update(Long id, UpdateAttributeGroupRequest request) {
        AttributeGroup attributeGroup = getAttributeGroupOrThrow(id);
        if (request.name() != null
                && !request.name().equalsIgnoreCase(attributeGroup.getName())
                && attributeGroupRepository.existsByNameIgnoreCase(request.name())) {
            throw new DuplicateAttributeGroupNameException(request.name());
        }
        attributeGroupMapper.updateEntity(request, attributeGroup);
        return attributeGroupMapper.toResponse(attributeGroupRepository.save(attributeGroup));
    }

    public void delete(Long id) {
        AttributeGroup attributeGroup = getAttributeGroupOrThrow(id);
        attributeGroupRepository.delete(attributeGroup);
    }

    @Transactional(readOnly = true)
    public AttributeGroup getAttributeGroupOrThrow(Long id) {
        return attributeGroupRepository
                .findById(id)
                .orElseThrow(() -> new AttributeGroupNotFoundException(id));
    }
}
