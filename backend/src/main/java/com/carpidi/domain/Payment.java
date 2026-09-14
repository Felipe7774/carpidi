package com.carpidi.domain;
import jakarta.persistence.*; import java.math.BigDecimal; import java.util.UUID;
@Entity public class Payment { @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) private Order order; private String provider; private String providerReference; private BigDecimal amount; private String status; protected Payment(){} }
