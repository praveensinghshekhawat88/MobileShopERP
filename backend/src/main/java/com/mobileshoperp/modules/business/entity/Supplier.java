package com.mobileshoperp.modules.business.entity;

import com.mobileshoperp.common.entity.BaseUuidEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "suppliers")
public class Supplier extends BaseUuidEntity {

    @Column(name = "supplier_name", nullable = false, length = 200)
    private String supplierName;

    @Column(name = "contact_person", length = 150)
    private String contactPerson;

    @Column(nullable = false, unique = true, length = 15)
    private String mobile;

    @Column(length = 150)
    private String email;

    @Column(name = "gst_number", length = 20)
    private String gstNumber;

    @Column(columnDefinition = "TEXT")
    private String address;
}
