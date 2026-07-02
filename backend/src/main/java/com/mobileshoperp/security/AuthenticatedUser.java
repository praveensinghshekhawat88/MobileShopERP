package com.mobileshoperp.security;

import java.util.UUID;

public record AuthenticatedUser(UUID userId, String mobile, String role) {}
