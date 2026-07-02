package com.mobileshoperp.modules.service.service;

import com.mobileshoperp.modules.service.entity.Warranty;
import java.time.LocalDate;
import org.springframework.stereotype.Service;

@Service
public class WarrantyExpiryService {

    public LocalDate calculateEndDate(LocalDate startDate, int warrantyMonths) {
        return startDate.plusMonths(warrantyMonths);
    }

    public boolean isExpired(Warranty warranty) {
        return isExpired(warranty.getEndDate());
    }

    public boolean isExpired(LocalDate endDate) {
        return endDate.isBefore(LocalDate.now());
    }
}
