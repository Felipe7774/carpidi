package com.carpidi.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(name = "product")
public class Product {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional = false, fetch = FetchType.LAZY) private Category category;
  @Column(nullable = false, unique = true, length = 160) private String slug;
  @Column(nullable = false, length = 160) private String name;
  @Column(columnDefinition = "text") private String description;
  @Column(nullable = false, precision = 12, scale = 2) private BigDecimal basePrice;
  @Column(nullable = false) private boolean active = true;
  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<ProductVariant> variants = new ArrayList<>();

  protected Product() {}

  public Product(Category category, String slug, String name, String description,
      BigDecimal basePrice, boolean active) {
    update(category, slug, name, description, basePrice, active);
  }

  public void update(Category category, String slug, String name, String description,
      BigDecimal basePrice, boolean active) {
    this.category = Objects.requireNonNull(category);
    this.slug = Objects.requireNonNull(slug);
    this.name = Objects.requireNonNull(name);
    this.description = description;
    this.basePrice = Objects.requireNonNull(basePrice);
    this.active = active;
  }

  public void replaceVariants(Collection<ProductVariant> replacements) {
    variants.clear();
    replacements.forEach(this::addVariant);
  }

  public void addVariant(ProductVariant variant) {
    variant.assignTo(this);
    variants.add(variant);
  }

  public void deactivate() { active = false; }

  public UUID getId() { return id; }
  public Category getCategory() { return category; }
  public String getSlug() { return slug; }
  public String getName() { return name; }
  public String getDescription() { return description; }
  public BigDecimal getBasePrice() { return basePrice; }
  public boolean isActive() { return active; }
  public List<ProductVariant> getVariants() { return List.copyOf(variants); }
}
