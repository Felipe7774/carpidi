package com.carpidi.domain;
import jakarta.persistence.*; import java.math.BigDecimal; import java.time.Instant; import java.util.*;
@Entity @Table(name="orders") public class Order { @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) private User customer; @Enumerated(EnumType.STRING) private OrderStatus status=OrderStatus.PENDING_PAYMENT; private BigDecimal total; private Instant createdAt=Instant.now(); @OneToMany(mappedBy="order",cascade=CascadeType.ALL) private List<OrderDetail> details=new ArrayList<>(); protected Order(){} }
