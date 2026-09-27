package com.carpidi.api;
import com.carpidi.application.RecommendationService; import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.security.Principal; import java.util.*; import org.springframework.http.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*;
@RestController public class RecommendationController {
 private final RecommendationService service; public RecommendationController(RecommendationService service){this.service=service;}
 @PostMapping("/questionnaire") @PreAuthorize("hasRole('CLIENT')") public ResponseEntity<Void> save(Principal principal,@Valid @RequestBody QuestionnaireRequest request){service.save(principal.getName(),request.bodyType(),request.skinTone(),request.heightRange(),request.stylePreferences(),request.consent()); return ResponseEntity.status(HttpStatus.CREATED).build();}
 @GetMapping("/recommendations") @PreAuthorize("hasRole('CLIENT')") public List<RecommendationService.RecommendationView> recommendations(Principal principal){return service.recommend(principal.getName());}
 public record QuestionnaireRequest(@NotBlank String bodyType,@NotBlank String skinTone,@NotBlank String heightRange,@NotEmpty List<@NotBlank String> stylePreferences,@AssertTrue boolean consent){}
}
