package com.carpidi.application;

import com.carpidi.domain.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.*;
import java.util.Date;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class JwtService {
  private final SecretKey signingKey;
  private final Duration accessTtl;
  private final Clock clock;

  public JwtService(@Value("${app.jwt.secret}") String secret,
      @Value("${app.jwt.access-ttl-minutes}") long accessTtlMinutes, Clock clock) {
    if(secret.getBytes(StandardCharsets.UTF_8).length < 32) throw new IllegalArgumentException("APP_JWT_SECRET requiere al menos 32 bytes");
    this.signingKey=Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.accessTtl=Duration.ofMinutes(accessTtlMinutes); this.clock=clock;
  }

  public String createAccessToken(User user) {
    Instant now=clock.instant();
    return Jwts.builder().subject(user.getId().toString()).claim("email", user.getEmail())
        .claim("roles", user.getRoles().stream().map(Enum::name).toList())
        .issuedAt(Date.from(now)).expiration(Date.from(now.plus(accessTtl)))
        .id(java.util.UUID.randomUUID().toString()).signWith(signingKey).compact();
  }

  public Claims parse(String token) { return Jwts.parser().verifyWith(signingKey).build().parseSignedClaims(token).getPayload(); }
  public long accessTtlSeconds() { return accessTtl.toSeconds(); }
}
