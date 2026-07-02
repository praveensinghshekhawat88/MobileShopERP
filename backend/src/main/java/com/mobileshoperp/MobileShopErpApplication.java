package com.mobileshoperp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties
public class MobileShopErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(MobileShopErpApplication.class, args);
    }
}
