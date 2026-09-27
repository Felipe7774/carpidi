package com.carpidi.domain;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "orders")
public class Order {
  @Id @GeneratedValue private UUID id;
  @ManyToOne(optional = false) private User customer;
  @Enumerated(EnumType.STRING) private OrderStatus status = OrderStatus.PENDING_PAYMENT;
  @Column(nullable = false, precision = 12, scale = 2) private BigDecimal total = BigDecimal.ZERO;
  @Column(nullable = false) private Instant createdAt = Instant.now();
  @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<OrderDetail> details = new ArrayList<>();

  protected Order() {}

  public Order(User customer) {
    this.customer = Objects.requireNonNull(customer);
  }

  public void addDetail(ProductVariant variant, String productName, int quantity, BigDecimal unitPrice) {
    OrderDetail detail = new OrderDetail(this, variant, productName, quantity, unitPrice);
    details.add(detail);
    total = total.add(unitPrice.multiply(BigDecimal.valueOf(quantity)));
  }

  public UUID getId() { return id; }
  public User getCustomer() { return customer; }
  public OrderStatus getStatus() { return status; }
  public BigDecimal getTotal() { return total; }
  public Instant getCreatedAt() { return createdAt; }
  public List<OrderDetail> getDetails() { return List.copyOf(details); }
}
