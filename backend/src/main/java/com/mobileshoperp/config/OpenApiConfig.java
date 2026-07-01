package com.mobileshoperp.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI mobileShopErpOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Mobile Shop ERP API")
                        .description("Enterprise Mobile Shop ERP Backend REST API")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Mobile Shop ERP")
                                .email("support@mobileshoperp.local"))
                        .license(new License()
                                .name("Proprietary")
                                .url("https://mobileshoperp.local/license")));
    }
}
