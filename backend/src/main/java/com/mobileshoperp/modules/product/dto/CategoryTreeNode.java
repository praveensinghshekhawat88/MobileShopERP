package com.mobileshoperp.modules.product.dto;

import java.util.List;

public record CategoryTreeNode(
        Long id,
        Long parentId,
        String name,
        String description,
        boolean active,
        List<CategoryTreeNode> children) {
}
