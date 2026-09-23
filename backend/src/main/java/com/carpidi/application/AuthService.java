package com.carpidi.application;

import com.carpidi.api.AuthController.*;
import com.carpidi.domain.*;
import com.carpidi.infrastructure.*;
import com.carpidi.support.*;
import java.nio.charset.StandardCharsets;
import java.security.*;
import java.time.*;
import java.util.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
  private final UserRepository users;
  private final RefreshTokenRepository refreshTokens;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final Clock clock;
  private final Duration refreshTtl;

  public AuthService(UserRepository users, RefreshTokenRepository refreshTokens,
      PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager,
      JwtService jwtService, Clock clock,
      @Value("${app.jwt.refresh-ttl-days}") long refreshTtlDays) {
    this.users=users; this.refreshTokens=refreshTokens; this.passwordEncoder=passwordEncoder;
    this.authenticationManager=authenticationManager; this.jwtService=jwtService; this.clock=clock;
    this.refreshTtl=Duration.ofDays(refreshTtlDays);
  }

  @Transactional
  public UserResponse register(RegisterRequest request) {
    String email=normalizeEmail(request.email());
    if(users.findByEmailIgnoreCase(email).isPresent()) throw new ConflictException("email-already-registered", "El correo ya está registrado.");
    User user=users.save(new User(request.name().trim(), email, passwordEncoder.encode(request.password()), UserRole.CLIENT));
    return toResponse(user);
  }

  @Transactional
  public TokenResponse login(LoginRequest request) {
    String email=normalizeEmail(request.email());
    try {
      Authentication authentication=authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, request.password()));
      User user=users.findByEmailIgnoreCase(authentication.getName()).orElseThrow(UnauthorizedException::new);
      return issueTokenPair(user);
    } catch(AuthenticationException exception) { throw new UnauthorizedException(); }
  }

  @Transactional
  public TokenResponse refresh(String rawToken) {
    Instant now=clock.instant();
    RefreshToken stored=refreshTokens.findByTokenHash(hash(rawToken)).orElseThrow(UnauthorizedException::new);
    if(!stored.isActive(now) || !stored.getUser().isEnabled()) throw new UnauthorizedException();
    stored.revoke(now);
    return issueTokenPair(stored.getUser());
  }

  @Transactional
  public void logout(String rawToken) {
    refreshTokens.findByTokenHash(hash(rawToken)).filter(token -> token.isActive(clock.instant()))
        .ifPresent(token -> token.revoke(clock.instant()));
  }

  private TokenResponse issueTokenPair(User user) {
    String accessToken=jwtService.createAccessToken(user);
    String rawRefresh=UUID.randomUUID()+"."+UUID.randomUUID();
    refreshTokens.save(new RefreshToken(user, hash(rawRefresh), clock.instant().plus(refreshTtl)));
    return new TokenResponse(accessToken, rawRefresh, jwtService.accessTtlSeconds(), toResponse(user));
  }

  private UserResponse toResponse(User user) {
    return new UserResponse(user.getId().toString(), user.getFullName(), user.getEmail(),
        user.getRoles().stream().map(Enum::name).collect(java.util.stream.Collectors.toUnmodifiableSet()));
  }

  private static String normalizeEmail(String email) { return email.trim().toLowerCase(Locale.ROOT); }
  private static String hash(String token) {
    try { return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8))); }
    catch(NoSuchAlgorithmException exception) { throw new IllegalStateException("SHA-256 no disponible", exception); }
  }
}
