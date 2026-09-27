package com.carpidi.api;

import com.carpidi.application.CatalogService;
import com.carpidi.application.CatalogService.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.net.URI;
import java.util.*;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/products")
public class ProductController {
  private final CatalogService catalog;

  public ProductController(CatalogService catalog) { this.catalog = catalog; }

  @GetMapping
  public Page<ProductView> list(@RequestParam(required = false) String q,
      @RequestParam(required = false) String category,
      @RequestParam(required = false) String size,
      @RequestParam(required = false) String color,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "20") int pageSize) {
    return catalog.search(q, category, size, color, page, pageSize);
  }

  @GetMapping("/{id}")
  public ProductView one(@PathVariable UUID id) { return catalog.findActive(id); }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<ProductView> create(@Valid @RequestBody CreateProductRequest request) {
    ProductView created = catalog.create(request.toCommand());
    return ResponseEntity.created(URI.create("/api/v1/products/" + created.id())).body(created);
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ProductView update(@PathVariable UUID id, @Valid @RequestBody UpdateProductRequest request) {
    return catalog.update(id, request.toCommand());
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> delete(@PathVariable UUID id) {
    catalog.deactivate(id);
    return ResponseEntity.noContent().build();
  }

  public record CreateProductRequest(
      @NotNull UUID categoryId,
      @NotBlank @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$") @Size(max = 160) String slug,
      @NotBlank @Size(max = 160) String name,
      @Size(max = 4000) String description,
      @NotNull @DecimalMin(value = "0.01") BigDecimal basePrice,
      boolean active,
      @NotEmpty @Size(max = 100) List<@Valid VariantRequest> variants) {
    CreateProductCommand toCommand() {
      return new CreateProductCommand(categoryId, slug, name, description, basePrice, active,
          variants.stream().map(VariantRequest::toCommand).toList());
    }
  }

  public record UpdateProductRequest(
      @NotNull UUID categoryId,
      @NotBlank @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$") @Size(max = 160) String slug,
      @NotBlank @Size(max = 160) String name,
      @Size(max = 4000) String description,
      @NotNull @DecimalMin(value = "0.01") BigDecimal basePrice,
      boolean active) {
    UpdateProductCommand toCommand() {
      return new UpdateProductCommand(categoryId, slug, name, description, basePrice, active);
    }
  }

  public record VariantRequest(
      @NotBlank @Pattern(regexp = "^[A-Za-z0-9_-]+$") @Size(max = 80) String sku,
      @Size(max = 30) String size,
      @Size(max = 50) String color,
      @NotNull @DecimalMin(value = "0.01") BigDecimal price,
      @Min(0) int available) {
    VariantCommand toCommand() { return new VariantCommand(sku, size, color, price, available); }
  }
}
