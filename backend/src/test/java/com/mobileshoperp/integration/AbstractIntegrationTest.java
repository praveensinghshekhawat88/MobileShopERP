package com.mobileshoperp.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mobileshoperp.config.IntegrationTestBootstrapRunner;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("integration-test")
@Testcontainers(disabledWithoutDocker = true)
public abstract class AbstractIntegrationTest {

    @Container
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("mobile_shop_erp")
            .withUsername("erp_user")
            .withPassword("erp_password");

    protected final TestRestTemplate restTemplate = new TestRestTemplate();
    protected final ObjectMapper objectMapper = new ObjectMapper();

    @DynamicPropertySource
    static void registerDataSource(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", POSTGRES::getJdbcUrl);
        registry.add("spring.datasource.username", POSTGRES::getUsername);
        registry.add("spring.datasource.password", POSTGRES::getPassword);
    }

    protected int port;

    protected String baseUrl() {
        return "http://localhost:" + port;
    }

    protected String loginAsAdmin() {
        ResponseEntity<JsonNode> response = postJson(
                "/api/v1/auth/login",
                null,
                """
                {"mobile":"%s","password":"%s"}
                """
                        .formatted(
                                IntegrationTestBootstrapRunner.ADMIN_MOBILE,
                                IntegrationTestBootstrapRunner.ADMIN_PASSWORD));
        if (!response.getStatusCode().is2xxSuccessful()
                || response.getBody() == null
                || !response.getBody().path("success").asBoolean(false)) {
            throw new IllegalStateException("Admin login failed: " + response.getStatusCode() + " " + response.getBody());
        }
        return response.getBody().get("data").get("accessToken").asText();
    }

    protected HttpHeaders bearerHeaders(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    protected HttpEntity<String> jsonEntity(String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(body, headers);
    }

    protected HttpEntity<String> authorizedJsonEntity(String token, String body) {
        return new HttpEntity<>(body, bearerHeaders(token));
    }

    protected <T> ResponseEntity<T> get(String path, String token, ParameterizedTypeReference<T> type) {
        HttpHeaders headers = bearerHeaders(token);
        return restTemplate.exchange(baseUrl() + path, HttpMethod.GET, new HttpEntity<>(headers), type);
    }

    protected ResponseEntity<JsonNode> postJson(String path, String token, String body) {
        HttpEntity<String> entity =
                token == null ? jsonEntity(body) : authorizedJsonEntity(token, body);
        return restTemplate.exchange(baseUrl() + path, HttpMethod.POST, entity, JsonNode.class);
    }

    protected ResponseEntity<JsonNode> putJson(String path, String token, String body) {
        return restTemplate.exchange(
                baseUrl() + path, HttpMethod.PUT, authorizedJsonEntity(token, body), JsonNode.class);
    }
}
