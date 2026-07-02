package com.mobileshoperp.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;
import org.springframework.http.ResponseEntity;

public final class IntegrationTestFixtures {

    private IntegrationTestFixtures() {}

    public record CatalogIds(UUID variantId) {}

    public record ReceivedStock(UUID purchaseId, UUID purchaseItemId, UUID stockId) {}

    public static CatalogIds createAccessoryCatalog(AbstractIntegrationTest test, String token) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);

        ResponseEntity<JsonNode> brand = test.postJson(
                "/api/v1/brands",
                token,
                """
                {"name":"TestBrand-%s","active":true}
                """
                        .formatted(suffix));
        assertSuccess(brand);
        long brandId = brand.getBody().get("data").get("id").asLong();

        ResponseEntity<JsonNode> category = test.postJson(
                "/api/v1/categories",
                token,
                """
                {"name":"Accessories-%s","active":true}
                """
                        .formatted(suffix));
        assertSuccess(category);
        long categoryId = category.getBody().get("data").get("id").asLong();

        ResponseEntity<JsonNode> product = test.postJson(
                "/api/v1/products",
                token,
                """
                {"brandId":%d,"categoryId":%d,"name":"Test Case %s","active":true}
                """
                        .formatted(brandId, categoryId, suffix));
        assertSuccess(product);
        String productId = product.getBody().get("data").get("id").asText();

        ResponseEntity<JsonNode> variant = test.postJson(
                "/api/v1/product-variants",
                token,
                """
                {"productId":"%s","sku":"CASE-%s","active":true}
                """
                        .formatted(productId, suffix));
        assertSuccess(variant);
        UUID variantId = UUID.fromString(variant.getBody().get("data").get("id").asText());
        return new CatalogIds(variantId);
    }

    private static String uniqueMobile(String prefix) {
        long suffix = Math.abs(UUID.randomUUID().getMostSignificantBits()) % 1_000_000_000L;
        return prefix + String.format("%09d", suffix);
    }

    public static ReceivedStock receiveSingleUnitPurchase(
            AbstractIntegrationTest test, String token, CatalogIds catalog) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String mobile = uniqueMobile("8");

        ResponseEntity<JsonNode> supplier = test.postJson(
                "/api/v1/suppliers",
                token,
                """
                {"supplierName":"Test Supplier %s","mobile":"%s"}
                """
                        .formatted(suffix, mobile));
        assertSuccess(supplier);
        String supplierId = supplier.getBody().get("data").get("id").asText();

        ResponseEntity<JsonNode> purchase = test.postJson(
                "/api/v1/purchases",
                token,
                """
                {"supplierId":"%s","invoiceNumber":"PO-%s","invoiceDate":"%s","totalAmount":100.00}
                """
                        .formatted(supplierId, suffix, LocalDate.now()));
        assertSuccess(purchase);
        String purchaseId = purchase.getBody().get("data").get("id").asText();

        ResponseEntity<JsonNode> item = test.postJson(
                "/api/v1/purchases/" + purchaseId + "/items",
                token,
                """
                {"variantId":"%s","quantity":1,"purchasePrice":100.00}
                """
                        .formatted(catalog.variantId()));
        assertSuccess(item);
        String purchaseItemId = item.getBody().get("data").get("id").asText();

        ObjectNode receiveBody = test.objectMapper.createObjectNode();
        ArrayNode lines = receiveBody.putArray("lines");
        ObjectNode line = lines.addObject();
        line.put("purchaseItemId", purchaseItemId);
        receiveBody.put("paymentStatus", "PAID");

        ResponseEntity<JsonNode> receive =
                test.postJson("/api/v1/purchases/" + purchaseId + "/receive", token, receiveBody.toString());
        assertSuccess(receive);

        ResponseEntity<JsonNode> stockPage = test.restTemplate.exchange(
                test.baseUrl() + "/api/v1/stock?variantId=" + catalog.variantId() + "&size=1",
                org.springframework.http.HttpMethod.GET,
                new org.springframework.http.HttpEntity<>(test.bearerHeaders(token)),
                JsonNode.class);
        assertSuccess(stockPage);
        String stockId = stockPage.getBody().get("data").get("content").get(0).get("id").asText();

        return new ReceivedStock(
                UUID.fromString(purchaseId),
                UUID.fromString(purchaseItemId),
                UUID.fromString(stockId));
    }

    public static UUID createCustomer(AbstractIntegrationTest test, String token) {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String mobile = uniqueMobile("7");

        ResponseEntity<JsonNode> customer = test.postJson(
                "/api/v1/customers",
                token,
                """
                {"name":"Walk-in Customer %s","mobile":"%s"}
                """
                        .formatted(suffix, mobile));
        assertSuccess(customer);
        return UUID.fromString(customer.getBody().get("data").get("id").asText());
    }

    public static UUID createDraftSale(AbstractIntegrationTest test, String token, UUID customerId) {
        ResponseEntity<JsonNode> sale = test.postJson(
                "/api/v1/sales",
                token,
                """
                {"customerId":"%s","invoiceDate":"%s","totalAmount":0}
                """
                        .formatted(customerId, LocalDate.now()));
        return UUID.fromString(sale.getBody().get("data").get("id").asText());
    }

    public static void addSaleItem(
            AbstractIntegrationTest test, String token, UUID saleId, UUID stockId, BigDecimal price) {
        test.postJson(
                "/api/v1/sales/" + saleId + "/items",
                token,
                """
                {"stockId":"%s","sellingPrice":%s}
                """
                        .formatted(stockId, price));
    }

    private static void assertSuccess(ResponseEntity<JsonNode> response) {
        if (response.getBody() == null || !response.getBody().path("success").asBoolean(false)) {
            throw new AssertionError(
                    "API call failed: status=" + response.getStatusCode() + " body=" + response.getBody());
        }
    }
}
