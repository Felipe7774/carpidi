package com.carpidi.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "product_variant")
public class ProductVariant {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional = false, fetch = FetchType.LAZY) private Product product;
  @Column(nullable = false, unique = true, length = 80) private String sku;
  @Column(length = 30) private String size;
  @Column(length = 50) private String color;
  @Column(nullable = false, precision = 12, scale = 2) private BigDecimal price;
  @OneToOne(mappedBy = "variant", cascade = CascadeType.ALL, orphanRemoval = true)
  private Inventory inventory;

  protected ProductVariant() {}

  public ProductVariant(String sku, String size, String color, BigDecimal price, int available) {
    this.sku = sku;
    this.size = size;
    this.color = color;
    this.price = price;
    this.inventory = new Inventory(this, available);
  }

  void assignTo(Product product) { this.product = product; }

  public UUID getId() { return id; }
  public String getSku() { return sku; }
  public String getSize() { return size; }
  public String getColor() { return color; }
  public BigDecimal getPrice() { return price; }
  public Inventory getInventory() { return inventory; }
}
