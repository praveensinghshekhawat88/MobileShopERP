package com.mobileshoperp.integration;

import static org.assertj.core.api.Assertions.assertThat;

import com.fasterxml.jackson.databind.JsonNode;
import com.mobileshoperp.modules.business.repository.SupplierRepository;
import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class EnterpriseIntegrationTest extends AbstractIntegrationTest {

    @LocalServerPort
    private int localPort;

    @Autowired
    private SupplierRepository supplierRepository;

    private String adminToken;
    private UUID adminUserId;

    @BeforeEach
    void setUp() {
        port = localPort;
        ResponseEntity<JsonNode> login = postJson(
                "/api/v1/auth/login",
                null,
                """
                {"mobile":"9999999999","password":"Admin@123456"}
                """);
        adminToken = login.getBody().get("data").get("accessToken").asText();
        adminUserId =
                UUID.fromString(login.getBody().get("data").get("user").get("id").asText());
    }

    @Test
    @Order(1)
    void loginShouldReturnAccessToken() {
        assertThat(adminToken).isNotBlank();
    }

    @Test
    @Order(2)
    void protectedEndpointWithoutTokenShouldReturn401() {
        ResponseEntity<JsonNode> response =
                restTemplate.getForEntity(baseUrl() + "/api/v1/users", JsonNode.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody().get("errorCode").asText()).isEqualTo("UNAUTHORIZED");
    }

    @Test
    @Order(3)
    void refreshTokenShouldNotBeAcceptedAsBearer() {
        ResponseEntity<JsonNode> login = postJson(
                "/api/v1/auth/login", null, """
                {"mobile":"9999999999","password":"Admin@123456"}
                """);
        String refreshToken = login.getBody().get("data").get("refreshToken").asText();

        ResponseEntity<JsonNode> response = restTemplate.exchange(
                baseUrl() + "/api/v1/users",
                org.springframework.http.HttpMethod.GET,
                new org.springframework.http.HttpEntity<>(bearerHeaders(refreshToken)),
                JsonNode.class);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody().get("message").asText())
                .contains("Refresh token cannot be used for API access");
    }

    @Test
    @Order(4)
    void authenticatedCreateShouldPopulateCreatedBy() {
        ResponseEntity<JsonNode> supplier = postJson(
                "/api/v1/suppliers",
                adminToken,
                """
                {"supplierName":"Audit Supplier","mobile":"%s"}
                """
                        .formatted(
                                "6"
                                        + String.format(
                                                "%09d",
                                                Math.abs(UUID.randomUUID().getMostSignificantBits())
                                                        % 1_000_000_000L)));

        assertThat(supplier.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        UUID supplierId = UUID.fromString(supplier.getBody().get("data").get("id").asText());

        assertThat(supplierRepository.findById(supplierId))
                .isPresent()
                .get()
                .satisfies(entity -> assertThat(entity.getCreatedBy()).isEqualTo(adminUserId));
    }

    @Test
    @Order(5)
    void receivePurchaseShouldCreateAvailableStock() {
        IntegrationTestFixtures.CatalogIds catalog =
                IntegrationTestFixtures.createAccessoryCatalog(this, adminToken);
        IntegrationTestFixtures.ReceivedStock received =
                IntegrationTestFixtures.receiveSingleUnitPurchase(this, adminToken, catalog);

        ResponseEntity<JsonNode> stock = restTemplate.exchange(
                baseUrl() + "/api/v1/stock/" + received.stockId(),
                org.springframework.http.HttpMethod.GET,
                new org.springframework.http.HttpEntity<>(bearerHeaders(adminToken)),
                JsonNode.class);

        assertThat(stock.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(stock.getBody().get("data").get("stockStatus").asText()).isEqualTo("AVAILABLE");
    }

    @Test
    @Order(6)
    void stockStatusEndpointShouldTransitionAvailableToReserved() {
        IntegrationTestFixtures.CatalogIds catalog =
                IntegrationTestFixtures.createAccessoryCatalog(this, adminToken);
        IntegrationTestFixtures.ReceivedStock received =
                IntegrationTestFixtures.receiveSingleUnitPurchase(this, adminToken, catalog);

        ResponseEntity<JsonNode> statusResponse = putJson(
                "/api/v1/stock/" + received.stockId() + "/status",
                adminToken,
                """
                {"newStatus":"RESERVED","reason":"Customer hold"}
                """);

        assertThat(statusResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(statusResponse.getBody().get("data").get("stockStatus").asText()).isEqualTo("RESERVED");
    }

    @Test
    @Order(7)
    void metadataUpdateShouldNotChangeStockStatus() {
        IntegrationTestFixtures.CatalogIds catalog =
                IntegrationTestFixtures.createAccessoryCatalog(this, adminToken);
        IntegrationTestFixtures.ReceivedStock received =
                IntegrationTestFixtures.receiveSingleUnitPurchase(this, adminToken, catalog);

        ResponseEntity<JsonNode> updateResponse = putJson(
                "/api/v1/stock/" + received.stockId(),
                adminToken,
                """
                {"serialNumber":"SN-001"}
                """);

        assertThat(updateResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(updateResponse.getBody().get("data").get("stockStatus").asText()).isEqualTo("AVAILABLE");
        assertThat(updateResponse.getBody().get("data").get("serialNumber").asText()).isEqualTo("SN-001");
    }

    @Test
    @Order(8)
    void finalizeSaleShouldMarkStockAsSold() {
        IntegrationTestFixtures.CatalogIds catalog =
                IntegrationTestFixtures.createAccessoryCatalog(this, adminToken);
        IntegrationTestFixtures.ReceivedStock received =
                IntegrationTestFixtures.receiveSingleUnitPurchase(this, adminToken, catalog);

        UUID customerId = IntegrationTestFixtures.createCustomer(this, adminToken);
        UUID saleId = IntegrationTestFixtures.createDraftSale(this, adminToken, customerId);
        IntegrationTestFixtures.addSaleItem(
                this, adminToken, saleId, received.stockId(), new BigDecimal("150.00"));

        ResponseEntity<JsonNode> finalizeResponse = postJson(
                "/api/v1/sales/" + saleId + "/finalize",
                adminToken,
                """
                {"initialPayment":{"paymentMode":"CASH","amount":150.00}}
                """);

        assertThat(finalizeResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(finalizeResponse.getBody().get("data").get("paymentStatus").asText())
                .isEqualTo("PAID");

        ResponseEntity<JsonNode> stock = restTemplate.exchange(
                baseUrl() + "/api/v1/stock/" + received.stockId(),
                org.springframework.http.HttpMethod.GET,
                new org.springframework.http.HttpEntity<>(bearerHeaders(adminToken)),
                JsonNode.class);

        assertThat(stock.getBody().get("data").get("stockStatus").asText()).isEqualTo("SOLD");
    }
}
