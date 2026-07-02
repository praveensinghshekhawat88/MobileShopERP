package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.modules.product.dto.AttributeValueResponse;
import com.mobileshoperp.modules.product.dto.CreateAttributeValueRequest;
import com.mobileshoperp.modules.product.dto.UpdateAttributeValueRequest;
import com.mobileshoperp.modules.product.entity.AttributeValue;
import com.mobileshoperp.modules.product.exception.AttributeValueNotFoundException;
import com.mobileshoperp.modules.product.exception.DuplicateAttributeValueException;
import com.mobileshoperp.modules.product.mapper.AttributeValueMapper;
import com.mobileshoperp.modules.product.repository.AttributeValueRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttributeValueService {

    private final AttributeValueRepository attributeValueRepository;
    private final AttributeValueMapper attributeValueMapper;
    private final AttributeService attributeService;

    @Transactional(readOnly = true)
    public Page<AttributeValueResponse> findAllActive(Long attributeId, Pageable pageable) {
        Page<AttributeValue> page = attributeId == null
                ? attributeValueRepository.findByActiveTrueOrderByDisplayOrderAscValueAsc(pageable)
                : attributeValueRepository.findByAttributeIdAndActiveTrueOrderByDisplayOrderAscValueAsc(
                        attributeId, pageable);
        return page.map(attributeValueMapper::toResponse);
    }

    @Transactional(readOnly = true)
    public List<AttributeValueResponse> findAllActiveByAttributeId(Long attributeId) {
        attributeService.getAttributeOrThrow(attributeId);
        return attributeValueRepository
                .findByAttributeIdAndActiveTrueOrderByDisplayOrderAscValueAsc(attributeId)
                .stream()
                .map(attributeValueMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public AttributeValueResponse findById(Long id) {
        return attributeValueMapper.toResponse(getAttributeValueOrThrow(id));
    }

    public AttributeValueResponse create(CreateAttributeValueRequest request) {
        attributeService.getAttributeOrThrow(request.attributeId());
        validateUniqueValue(request.attributeId(), request.value(), null);
        AttributeValue attributeValue = attributeValueMapper.toEntity(request);
        if (request.displayOrder() != null) {
            attributeValue.setDisplayOrder(request.displayOrder());
        }
        if (request.active() != null) {
            attributeValue.setActive(request.active());
        }
        return attributeValueMapper.toResponse(attributeValueRepository.save(attributeValue));
    }

    public AttributeValueResponse update(Long id, UpdateAttributeValueRequest request) {
        AttributeValue attributeValue = getAttributeValueOrThrow(id);
        if (request.value() != null) {
            validateUniqueValue(attributeValue.getAttributeId(), request.value(), id);
        }
        attributeValueMapper.updateEntity(request, attributeValue);
        return attributeValueMapper.toResponse(attributeValueRepository.save(attributeValue));
    }

    public void deactivate(Long id) {
        AttributeValue attributeValue = getAttributeValueOrThrow(id);
        attributeValue.setActive(false);
        attributeValueRepository.save(attributeValue);
    }

    @Transactional(readOnly = true)
    public AttributeValue getActiveAttributeValueOrThrow(Long id) {
        AttributeValue attributeValue = getAttributeValueOrThrow(id);
        if (!attributeValue.isActive()) {
            throw new AttributeValueNotFoundException(id);
        }
        return attributeValue;
    }

    private AttributeValue getAttributeValueOrThrow(Long id) {
        return attributeValueRepository
                .findById(id)
                .orElseThrow(() -> new AttributeValueNotFoundException(id));
    }

    private void validateUniqueValue(Long attributeId, String value, Long excludeId) {
        attributeValueRepository
                .findByAttributeIdAndValueIgnoreCase(attributeId, value)
                .ifPresent(existing -> {
                    if (excludeId == null || !existing.getId().equals(excludeId)) {
                        throw new DuplicateAttributeValueException(value, attributeId);
                    }
                });
    }
}
