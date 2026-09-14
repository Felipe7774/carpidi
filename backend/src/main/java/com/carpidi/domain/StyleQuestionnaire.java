package com.carpidi.domain;
import jakarta.persistence.*; import java.time.Instant; import java.util.UUID;
@Entity public class StyleQuestionnaire { @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) private User customer; private String bodyType; private String skinTone; private String heightRange; private String stylePreferences; private boolean consent; private Instant createdAt=Instant.now(); protected StyleQuestionnaire(){} }
