package com.mobileshoperp.modules.auth.repository;

import com.mobileshoperp.modules.auth.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingsRepository extends JpaRepository<Settings, Long> {
}
