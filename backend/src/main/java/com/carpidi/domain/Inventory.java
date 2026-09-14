package com.carpidi.domain;
import jakarta.persistence.*; import java.util.UUID;
@Entity public class Inventory { @Id @GeneratedValue private UUID id; @OneToOne(optional=false) private ProductVariant variant; private int available; private int reserved; @Version private long version; protected Inventory(){} }
