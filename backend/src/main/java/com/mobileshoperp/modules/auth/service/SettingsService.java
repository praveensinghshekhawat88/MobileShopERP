package com.mobileshoperp.modules.auth.service;

import com.mobileshoperp.modules.auth.dto.SettingsResponse;
import com.mobileshoperp.modules.auth.dto.UpdateSettingsRequest;
import com.mobileshoperp.modules.auth.entity.Settings;
import com.mobileshoperp.modules.auth.exception.SettingsNotFoundException;
import com.mobileshoperp.modules.auth.mapper.SettingsMapper;
import com.mobileshoperp.modules.auth.repository.SettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class SettingsService {

    private final SettingsRepository settingsRepository;
    private final SettingsMapper settingsMapper;

    @Transactional(readOnly = true)
    public SettingsResponse getSettings() {
        return settingsMapper.toResponse(getSettingsOrThrow());
    }

    @Transactional(readOnly = true)
    public String getInvoicePrefixOrDefault() {
        return settingsRepository.findAll().stream()
                .findFirst()
                .map(Settings::getInvoicePrefix)
                .filter(prefix -> prefix != null && !prefix.isBlank())
                .orElse("INV");
    }

    public SettingsResponse updateSettings(UpdateSettingsRequest request) {
        Settings settings = getSettingsOrThrow();
        settingsMapper.updateEntity(request, settings);
        return settingsMapper.toResponse(settingsRepository.save(settings));
    }

    public SettingsResponse initializeIfEmpty() {
        Settings settings = settingsRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> settingsRepository.save(Settings.builder().build()));
        return settingsMapper.toResponse(settings);
    }

    private Settings getSettingsOrThrow() {
        return settingsRepository.findAll().stream()
                .findFirst()
                .orElseThrow(SettingsNotFoundException::new);
    }
}
