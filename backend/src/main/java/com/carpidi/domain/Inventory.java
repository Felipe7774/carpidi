package com.carpidi.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "inventory")
public class Inventory {
  @Id @GeneratedValue private UUID id;
  @OneToOne(optional = false) @JoinColumn(name = "variant_id", unique = true)
  private ProductVariant variant;
  @Column(nullable = false) private int available;
  @Column(nullable = false) private int reserved;
  @Version private long version;

  protected Inventory() {}

  public Inventory(ProductVariant variant, int available) {
    if (available < 0) throw new IllegalArgumentException("El inventario no puede ser negativo.");
    this.variant = variant;
    this.available = available;
  }

  public UUID getId() { return id; }
  public int getAvailable() { return available; }
  public int getReserved() { return reserved; }
  public int getSellable() { return available - reserved; }

  public void sell(int quantity) {
    if (quantity < 1) throw new IllegalArgumentException("La cantidad debe ser mayor a cero.");
    if (getSellable() < quantity) throw new IllegalArgumentException("Stock insuficiente para la variante seleccionada.");
    available -= quantity;
  }
}
