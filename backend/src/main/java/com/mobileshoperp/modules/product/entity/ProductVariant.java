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
@Table(name = "product_variants")
public class ProductVariant extends BaseUuidEntity {

    @Column(name = "product_id", nullable = false)
    private UUID productId;

    @Column(nullable = false, unique = true, length = 100)
    private String sku;

    @Column(unique = true, length = 100)
    private String barcode;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;
}
