package com.carpidi.api;
import com.carpidi.domain.Product; import com.carpidi.infrastructure.ProductRepository; import java.math.BigDecimal; import java.util.*; import org.springframework.data.domain.*; import org.springframework.http.*; import org.springframework.security.access.prepost.PreAuthorize; import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/products")
public class ProductController {
 private final ProductRepository products; public ProductController(ProductRepository products){this.products=products;}
 @GetMapping public Page<ProductResponse> list(@RequestParam(defaultValue="0") int page,@RequestParam(defaultValue="20") int size){return products.findAll(PageRequest.of(page,Math.min(size,100))).map(ProductResponse::from);}
 @GetMapping("/{id}") public ProductResponse one(@PathVariable UUID id){return products.findById(id).map(ProductResponse::from).orElseThrow(() -> new NoSuchElementException("Producto no encontrado"));}
 @PostMapping @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<Void> create(){return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();}
 @PutMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<Void> update(@PathVariable UUID id){return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();}
 @DeleteMapping("/{id}") @PreAuthorize("hasRole('ADMIN')") public ResponseEntity<Void> delete(@PathVariable UUID id){return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();}
 public record ProductResponse(String id,String name,BigDecimal price,boolean active){static ProductResponse from(Product p){return new ProductResponse(p.getId().toString(),p.getName(),p.getBasePrice(),p.isActive());}}
}
