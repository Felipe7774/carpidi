package com.carpidi.domain;
import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@Entity public class Recommendation { @Id @GeneratedValue private UUID id; @ManyToOne private User customer; @ManyToOne private Product product; private String reason; private double score; private Instant createdAt=Instant.now(); protected Recommendation(){} }
