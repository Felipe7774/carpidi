package com.carpidi.domain;
import jakarta.persistence.*; import java.math.BigDecimal; import java.util.UUID;
@Entity public class OrderDetail { @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) private Order order; @ManyToOne(optional=false) private ProductVariant variant; private String productName; private int quantity; private BigDecimal unitPrice; protected OrderDetail(){} }
