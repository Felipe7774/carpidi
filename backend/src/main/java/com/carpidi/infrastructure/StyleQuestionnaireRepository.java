package com.carpidi.infrastructure;
import com.carpidi.domain.StyleQuestionnaire; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface StyleQuestionnaireRepository extends JpaRepository<StyleQuestionnaire, UUID> { Optional<StyleQuestionnaire> findTopByCustomerEmailIgnoreCaseOrderByCreatedAtDesc(String email); }
