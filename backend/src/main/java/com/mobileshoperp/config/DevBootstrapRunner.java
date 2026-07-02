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
@Profile("dev")
@RequiredArgsConstructor
public class DevBootstrapRunner implements ApplicationRunner {

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
            log.info("Dev bootstrap: default settings row created");
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
        admin.setMobile("9999999999");
        admin.setEmail("admin@mobileshoperp.local");
        admin.setPassword(passwordEncoder.encode("Admin@123456"));
        admin.setActive(true);

        userRepository.save(admin);
        log.info("Dev bootstrap: default admin user created (mobile=9999999999)");
    }
}
