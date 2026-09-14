package com.carpidi.domain;
import jakarta.persistence.*; import java.math.BigDecimal; import java.util.*;
@Entity public class Product {
 @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) private Category category; @Column(nullable=false) private String name; @Column(columnDefinition="text") private String description; @Column(nullable=false) private BigDecimal basePrice; private boolean active=true;
 @OneToMany(mappedBy="product",cascade=CascadeType.ALL,orphanRemoval=true) private List<ProductVariant> variants=new ArrayList<>(); protected Product(){} public UUID getId(){return id;} public String getName(){return name;} public BigDecimal getBasePrice(){return basePrice;} public boolean isActive(){return active;}
}
