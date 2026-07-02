package com.mobileshoperp.modules.product.entity;

import com.mobileshoperp.common.entity.BaseUuidEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "product_variant_attributes")
public class ProductVariantAttribute extends BaseUuidEntity {

    @Column(name = "variant_id", nullable = false)
    private UUID variantId;

    @Column(name = "attribute_value_id", nullable = false)
    private Long attributeValueId;
}
