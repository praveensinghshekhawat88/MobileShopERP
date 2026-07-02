package com.mobileshoperp.modules.utility.mapper;

import com.mobileshoperp.modules.utility.dto.PaymentResponse;
import com.mobileshoperp.modules.utility.entity.Payment;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface PaymentMapper {

    PaymentResponse toResponse(Payment payment);
}
