package com.carpidi.domain;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue
  private UUID id;
  @Column(nullable = false, length = 150) private String fullName;
  @Column(nullable = false, unique = true) private String email;
  @Column(nullable = false) private String passwordHash;
  @ElementCollection(targetClass = UserRole.class, fetch = FetchType.EAGER)
  @Enumerated(EnumType.STRING)
  @CollectionTable(name="user_roles", joinColumns = @JoinColumn(name = "user_id"))
  @Column(name="role") private Set<UserRole> roles = new HashSet<>();
  @Column(nullable = false) private boolean enabled = true;
  @Column(nullable = false) private Instant createdAt = Instant.now();
  @Column(nullable = false) private Instant updatedAt = Instant.now();
  protected User() {}
  public User(String fullName, String email, String passwordHash, UserRole role) { this.fullName=fullName; this.email=email; this.passwordHash=passwordHash; roles.add(role); }
  @PreUpdate void markUpdated() { updatedAt = Instant.now(); }
  public UUID getId(){return id;}
  public String getFullName(){return fullName;}
  public String getEmail(){return email;}
  public String getPasswordHash(){return passwordHash;}
  public Set<UserRole> getRoles(){return Set.copyOf(roles);}
  public boolean isEnabled(){return enabled;}
}
