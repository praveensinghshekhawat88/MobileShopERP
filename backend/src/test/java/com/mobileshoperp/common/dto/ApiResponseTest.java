package com.mobileshoperp.common.dto;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class ApiResponseTest {

    @Test
    void successResponseShouldBeSuccessfulWithData() {
        ApiResponse<String> response = ApiResponse.success("ok");

        assertThat(response.isSuccess()).isTrue();
        assertThat(response.getData()).isEqualTo("ok");
        assertThat(response.getTimestamp()).isNotNull();
    }

    @Test
    void errorResponseShouldContainErrorCodeAndPath() {
        ApiResponse<Void> response = ApiResponse.error("Not found", "RESOURCE_NOT_FOUND", "/api/v1/test");

        assertThat(response.isSuccess()).isFalse();
        assertThat(response.getErrorCode()).isEqualTo("RESOURCE_NOT_FOUND");
        assertThat(response.getPath()).isEqualTo("/api/v1/test");
    }
}
