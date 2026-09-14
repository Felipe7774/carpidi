package com.carpidi.domain;
import jakarta.persistence.*; import java.math.BigDecimal; import java.util.UUID;
@Entity public class ProductVariant { @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) private Product product; private String size; private String color; private BigDecimal price; @OneToOne(mappedBy="variant",cascade=CascadeType.ALL) private Inventory inventory; protected ProductVariant(){} }
