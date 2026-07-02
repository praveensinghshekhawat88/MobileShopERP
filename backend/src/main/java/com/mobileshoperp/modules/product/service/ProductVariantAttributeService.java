package com.mobileshoperp.modules.product.service;

import com.mobileshoperp.modules.product.dto.CreateVariantAttributeRequest;
import com.mobileshoperp.modules.product.dto.ReplaceVariantAttributesRequest;
import com.mobileshoperp.modules.product.dto.VariantAttributeDetailResponse;
import com.mobileshoperp.modules.product.entity.Attribute;
import com.mobileshoperp.modules.product.entity.AttributeGroup;
import com.mobileshoperp.modules.product.entity.AttributeValue;
import com.mobileshoperp.modules.product.entity.ProductVariantAttribute;
import com.mobileshoperp.modules.product.exception.DuplicateVariantAttributeException;
import com.mobileshoperp.modules.product.exception.VariantAttributeNotFoundException;
import com.mobileshoperp.modules.product.repository.AttributeValueRepository;
import com.mobileshoperp.modules.product.repository.ProductVariantAttributeRepository;
import com.mobileshoperp.exception.BusinessRuleException;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductVariantAttributeService {

    private final ProductVariantAttributeRepository variantAttributeRepository;
    private final AttributeValueRepository attributeValueRepository;
    private final ProductVariantService productVariantService;
    private final AttributeService attributeService;
    private final AttributeGroupService attributeGroupService;

    @Transactional(readOnly = true)
    public List<VariantAttributeDetailResponse> findByVariantId(UUID variantId) {
        productVariantService.getActiveProductVariantOrThrow(variantId);
        return variantAttributeRepository.findByVariantIdOrderByCreatedAtAsc(variantId).stream()
                .map(this::toDetailResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public VariantAttributeDetailResponse findById(UUID id) {
        return toDetailResponse(getAssignmentOrThrow(id));
    }

    public VariantAttributeDetailResponse assign(CreateVariantAttributeRequest request) {
        productVariantService.getActiveProductVariantOrThrow(request.variantId());
        AttributeValue attributeValue =
                attributeValueRepository
                        .findById(request.attributeValueId())
                        .filter(AttributeValue::isActive)
                        .orElseThrow(() -> new BusinessRuleException(
                                "Attribute value is not active or does not exist: " + request.attributeValueId()));

        if (variantAttributeRepository
                .findByVariantIdAndAttributeValueId(request.variantId(), request.attributeValueId())
                .isPresent()) {
            throw new BusinessRuleException("Attribute value is already assigned to this variant");
        }

        validateNoConflictingAttribute(request.variantId(), attributeValue.getAttributeId(), null);

        ProductVariantAttribute assignment = new ProductVariantAttribute();
        assignment.setVariantId(request.variantId());
        assignment.setAttributeValueId(request.attributeValueId());
        return toDetailResponse(variantAttributeRepository.save(assignment));
    }

    public List<VariantAttributeDetailResponse> replace(ReplaceVariantAttributesRequest request) {
        productVariantService.getActiveProductVariantOrThrow(request.variantId());
        List<AttributeValue> attributeValues = resolveActiveAttributeValues(request.attributeValueIds());
        validateUniqueAttributesInSet(attributeValues);

        variantAttributeRepository.deleteAllByVariantId(request.variantId());

        List<ProductVariantAttribute> assignments = attributeValues.stream()
                .map(attributeValue -> {
                    ProductVariantAttribute assignment = new ProductVariantAttribute();
                    assignment.setVariantId(request.variantId());
                    assignment.setAttributeValueId(attributeValue.getId());
                    return assignment;
                })
                .toList();

        return variantAttributeRepository.saveAll(assignments).stream()
                .map(this::toDetailResponse)
                .toList();
    }

    public void remove(UUID id) {
        ProductVariantAttribute assignment = getAssignmentOrThrow(id);
        variantAttributeRepository.delete(assignment);
    }

    private ProductVariantAttribute getAssignmentOrThrow(UUID id) {
        return variantAttributeRepository
                .findById(id)
                .orElseThrow(() -> new VariantAttributeNotFoundException(id));
    }

    private List<AttributeValue> resolveActiveAttributeValues(List<Long> attributeValueIds) {
        return attributeValueIds.stream()
                .map(attributeValueId -> attributeValueRepository
                        .findById(attributeValueId)
                        .filter(AttributeValue::isActive)
                        .orElseThrow(() -> new BusinessRuleException(
                                "Attribute value is not active or does not exist: " + attributeValueId)))
                .toList();
    }

    private void validateUniqueAttributesInSet(List<AttributeValue> attributeValues) {
        Set<Long> attributeIds = new HashSet<>();
        for (AttributeValue attributeValue : attributeValues) {
            if (!attributeIds.add(attributeValue.getAttributeId())) {
                Attribute attribute = attributeService.getAttributeOrThrow(attributeValue.getAttributeId());
                throw new BusinessRuleException(
                        "Multiple values for the same attribute are not allowed: " + attribute.getName());
            }
        }
    }

    private void validateNoConflictingAttribute(UUID variantId, Long attributeId, UUID excludeAssignmentId) {
        for (ProductVariantAttribute existing : variantAttributeRepository.findByVariantIdOrderByCreatedAtAsc(
                variantId)) {
            if (excludeAssignmentId != null && excludeAssignmentId.equals(existing.getId())) {
                continue;
            }
            AttributeValue existingValue = attributeValueRepository
                    .findById(existing.getAttributeValueId())
                    .orElseThrow();
            if (existingValue.getAttributeId().equals(attributeId)) {
                Attribute attribute = attributeService.getAttributeOrThrow(attributeId);
                throw new DuplicateVariantAttributeException(attribute.getName());
            }
        }
    }

    private VariantAttributeDetailResponse toDetailResponse(ProductVariantAttribute assignment) {
        AttributeValue attributeValue = attributeValueRepository
                .findById(assignment.getAttributeValueId())
                .orElseThrow(() -> new BusinessRuleException(
                        "Attribute value not found: " + assignment.getAttributeValueId()));
        Attribute attribute = attributeService.getAttributeOrThrow(attributeValue.getAttributeId());
        AttributeGroup attributeGroup = attributeGroupService.getAttributeGroupOrThrow(attribute.getAttributeGroupId());

        return new VariantAttributeDetailResponse(
                assignment.getId(),
                assignment.getVariantId(),
                assignment.getAttributeValueId(),
                attribute.getId(),
                attribute.getName(),
                attributeGroup.getId(),
                attributeGroup.getName(),
                attribute.getAttributeType(),
                attributeValue.getValue());
    }
}
