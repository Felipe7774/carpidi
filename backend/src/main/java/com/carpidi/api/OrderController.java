package com.carpidi.api;
import jakarta.validation.Valid; import jakarta.validation.constraints.*; import java.util.*; import org.springframework.http.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/orders") public class OrderController {
 @GetMapping @PreAuthorize("hasAnyRole('CLIENT','ADMIN')") public List<Object> list(){return List.of();}
 @PostMapping @PreAuthorize("hasRole('CLIENT')") public ResponseEntity<Void> create(@Valid @RequestBody CreateOrderRequest request){return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();}
 public record CreateOrderRequest(@NotEmpty List<Item> items,@NotBlank String paymentMethod, @NotNull Address shippingAddress){} public record Item(@NotBlank String variantId,@Min(1) int quantity){} public record Address(@NotBlank String line1,@NotBlank String city,@NotBlank String country){}
}
