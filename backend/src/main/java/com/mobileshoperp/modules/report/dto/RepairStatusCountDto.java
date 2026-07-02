package com.mobileshoperp.modules.report.dto;

import com.mobileshoperp.common.enums.RepairStatus;

public record RepairStatusCountDto(RepairStatus status, long count) {}
