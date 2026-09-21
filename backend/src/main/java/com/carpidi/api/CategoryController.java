package com.carpidi.api;

import com.carpidi.application.CatalogService;
import com.carpidi.application.CatalogService.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories")
public class CategoryController {
  private final CatalogService catalog;

  public CategoryController(CatalogService catalog) { this.catalog = catalog; }

  @GetMapping
  public List<CategoryView> list() { return catalog.listCategories(); }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<CategoryView> create(@Valid @RequestBody CreateCategoryRequest request) {
    CategoryView created = catalog.createCategory(new CreateCategoryCommand(request.name(), request.slug()));
    return ResponseEntity.created(URI.create("/api/v1/categories/" + created.id())).body(created);
  }

  public record CreateCategoryRequest(
      @NotBlank @Size(max = 100) String name,
      @NotBlank @Pattern(regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$") @Size(max = 120) String slug) {}
}
