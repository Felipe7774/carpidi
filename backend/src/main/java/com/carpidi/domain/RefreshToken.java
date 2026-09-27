package com.carpidi.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional = false, fetch = FetchType.LAZY) private User user;
  @Column(nullable = false, unique = true, length = 64) private String tokenHash;
  @Column(nullable = false) private Instant expiresAt;
  private Instant revokedAt;
  @Column(nullable = false) private Instant createdAt = Instant.now();
  protected RefreshToken() {}
  public RefreshToken(User user, String tokenHash, Instant expiresAt) { this.user=user; this.tokenHash=tokenHash; this.expiresAt=expiresAt; }
  public User getUser() { return user; }
  public boolean isActive(Instant now) { return revokedAt == null && expiresAt.isAfter(now); }
  public void revoke(Instant now) { revokedAt = now; }
}
