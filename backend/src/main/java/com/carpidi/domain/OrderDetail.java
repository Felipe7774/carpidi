package com.carpidi.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
public class OrderDetail {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional = false) private Order order;
  @ManyToOne(optional = false) private ProductVariant variant;
  @Column(nullable = false) private String productName;
  @Column(nullable = false) private int quantity;
  @Column(nullable = false, precision = 12, scale = 2) private BigDecimal unitPrice;

  protected OrderDetail() {}

  public OrderDetail(Order order, ProductVariant variant, String productName, int quantity, BigDecimal unitPrice) {
    if (quantity < 1) throw new IllegalArgumentException("La cantidad debe ser mayor a cero.");
    this.order = order;
    this.variant = variant;
    this.productName = productName;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  public UUID getId() { return id; }
  public ProductVariant getVariant() { return variant; }
  public String getProductName() { return productName; }
  public int getQuantity() { return quantity; }
  public BigDecimal getUnitPrice() { return unitPrice; }
}
