package com.carpidi.api;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.util.*; import org.springframework.http.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*;
@RestController public class RecommendationController {
 @PostMapping("/questionnaire") @PreAuthorize("hasRole('CLIENT')") public ResponseEntity<Void> save(@Valid @RequestBody QuestionnaireRequest request){return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();}
 @GetMapping("/recommendations") @PreAuthorize("hasRole('CLIENT')") public List<Object> recommendations(){return List.of();}
 public record QuestionnaireRequest(String bodyType,String skinTone,String heightRange,List<String> stylePreferences,@AssertTrue boolean consent){}
}
