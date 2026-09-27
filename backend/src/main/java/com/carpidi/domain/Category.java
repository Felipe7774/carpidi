package com.carpidi.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "category")
public class Category {
  @Id @GeneratedValue private UUID id;
  @Column(nullable = false, unique = true, length = 100) private String name;
  @Column(nullable = false, unique = true, length = 120) private String slug;
  @Column(nullable = false) private boolean active = true;

  protected Category() {}

  public Category(String name, String slug) {
    this.name = name;
    this.slug = slug;
  }

  public void update(String name, String slug, boolean active) {
    this.name = name;
    this.slug = slug;
    this.active = active;
  }

  public UUID getId() { return id; }
  public String getName() { return name; }
  public String getSlug() { return slug; }
  public boolean isActive() { return active; }
}
