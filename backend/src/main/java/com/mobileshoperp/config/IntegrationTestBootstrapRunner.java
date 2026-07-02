package com.mobileshoperp.config;

import com.mobileshoperp.modules.auth.entity.Role;
import com.mobileshoperp.modules.auth.entity.Settings;
import com.mobileshoperp.modules.auth.entity.User;
import com.mobileshoperp.modules.auth.repository.RoleRepository;
import com.mobileshoperp.modules.auth.repository.SettingsRepository;
import com.mobileshoperp.modules.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@Profile("integration-test")
@RequiredArgsConstructor
public class IntegrationTestBootstrapRunner implements ApplicationRunner {

    public static final String ADMIN_MOBILE = "9999999999";
    public static final String ADMIN_PASSWORD = "Admin@123456";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SettingsRepository settingsRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        if (settingsRepository.count() == 0) {
            settingsRepository.save(Settings.builder()
                    .companyName("Mobile Shop ERP")
                    .invoicePrefix("INV")
                    .build());
        }

        if (userRepository.count() > 0) {
            return;
        }

        Role adminRole = roleRepository.findByNameIgnoreCase("ADMIN")
                .orElseThrow(() -> new IllegalStateException("ADMIN role missing — run Flyway V2"));

        User admin = new User();
        admin.setRole(adminRole);
        admin.setFirstName("System");
        admin.setLastName("Admin");
        admin.setMobile(ADMIN_MOBILE);
        admin.setEmail("admin@mobileshoperp.local");
        admin.setPassword(passwordEncoder.encode(ADMIN_PASSWORD));
        admin.setActive(true);

        userRepository.save(admin);
        log.info("Integration test bootstrap: admin user created (mobile={})", ADMIN_MOBILE);
    }
}
