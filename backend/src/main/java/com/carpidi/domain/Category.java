package com.carpidi.domain;
import jakarta.persistence.*; import java.util.UUID;
@Entity public class Category { @Id @GeneratedValue private UUID id; @Column(unique=true,nullable=false) private String name; private String slug; private boolean active=true; protected Category(){} }
