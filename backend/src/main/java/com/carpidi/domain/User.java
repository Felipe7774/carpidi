package com.carpidi.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity @Table(name = "users")
public class User {
  @Id @GeneratedValue private UUID id;
  @Column(nullable = false, unique = true) private String email;
  @Column(nullable = false) private String passwordHash;
  @ElementCollection(targetClass = UserRole.class) @Enumerated(EnumType.STRING) @CollectionTable(name="user_roles")
  @Column(name="role") private Set<UserRole> roles = new HashSet<>();
  @Column(nullable = false) private boolean enabled = true;
  @Column(nullable = false) private Instant createdAt = Instant.now();
  protected User() {}
  public User(String email, String passwordHash, UserRole role) { this.email=email; this.passwordHash=passwordHash; roles.add(role); }
  public UUID getId(){return id;} public String getEmail(){return email;} public String getPasswordHash(){return passwordHash;} public Set<UserRole> getRoles(){return Set.copyOf(roles);}
}
