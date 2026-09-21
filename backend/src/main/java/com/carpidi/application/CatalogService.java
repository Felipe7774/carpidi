package com.carpidi.application;

import com.carpidi.domain.*;
import com.carpidi.infrastructure.*;
import com.carpidi.support.ConflictException;
import java.math.BigDecimal;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CatalogService {
  private final ProductRepository products;
  private final CategoryRepository categories;
  private final ProductVariantRepository variants;

  public CatalogService(ProductRepository products, CategoryRepository categories,
      ProductVariantRepository variants) {
    this.products = products;
    this.categories = categories;
    this.variants = variants;
  }

  @Transactional(readOnly = true)
  public Page<ProductView> search(String query, String category, String size, String color,
      int page, int pageSize) {
    if (page < 0) throw new IllegalArgumentException("La página no puede ser negativa.");
    if (pageSize < 1 || pageSize > 100) {
      throw new IllegalArgumentException("El tamaño de página debe estar entre 1 y 100.");
    }
    Pageable pageable = PageRequest.of(page, pageSize, Sort.by("name").ascending());
    return products.searchActive(clean(query), clean(category), clean(size), clean(color), pageable)
        .map(this::toView);
  }

  @Transactional(readOnly = true)
  public ProductView findActive(UUID id) {
    return products.findByIdAndActiveTrue(id).map(this::toView)
        .orElseThrow(() -> new NoSuchElementException("Producto no encontrado."));
  }

  @Transactional
  public ProductView create(CreateProductCommand command) {
    ensureUniqueSlug(command.slug(), null);
    ensureUniqueSkus(command.variants());
    Category category = categories.findById(command.categoryId())
        .filter(Category::isActive)
        .orElseThrow(() -> new NoSuchElementException("Categoría no encontrada."));
    Product product = new Product(category, normalizeSlug(command.slug()), command.name().trim(),
        clean(command.description()), command.basePrice(), command.active());
    command.variants().stream().map(this::newVariant).forEach(product::addVariant);
    return toView(products.save(product));
  }

  @Transactional
  public ProductView update(UUID id, UpdateProductCommand command) {
    Product product = products.findById(id)
        .orElseThrow(() -> new NoSuchElementException("Producto no encontrado."));
    ensureUniqueSlug(command.slug(), id);
    Category category = categories.findById(command.categoryId())
        .filter(Category::isActive)
        .orElseThrow(() -> new NoSuchElementException("Categoría no encontrada."));
    product.update(category, normalizeSlug(command.slug()), command.name().trim(),
        clean(command.description()), command.basePrice(), command.active());
    return toView(product);
  }

  @Transactional
  public void deactivate(UUID id) {
    Product product = products.findById(id)
        .orElseThrow(() -> new NoSuchElementException("Producto no encontrado."));
    product.deactivate();
  }

  @Transactional(readOnly = true)
  public List<CategoryView> listCategories() {
    return categories.findAllByActiveTrueOrderByNameAsc().stream().map(this::toView).toList();
  }

  @Transactional
  public CategoryView createCategory(CreateCategoryCommand command) {
    String slug = normalizeSlug(command.slug());
    if (categories.existsBySlugIgnoreCase(slug)) {
      throw new ConflictException("category-slug-already-exists", "Ya existe una categoría con ese slug.");
    }
    return toView(categories.save(new Category(command.name().trim(), slug)));
  }

  private ProductVariant newVariant(VariantCommand variant) {
    BigDecimal price = variant.price();
    return new ProductVariant(variant.sku().trim().toUpperCase(Locale.ROOT), clean(variant.size()),
        clean(variant.color()), price, variant.available());
  }

  private void ensureUniqueSlug(String slug, UUID currentProductId) {
    String normalized = normalizeSlug(slug);
    boolean exists = currentProductId == null
        ? products.existsBySlugIgnoreCase(normalized)
        : products.existsBySlugIgnoreCaseAndIdNot(normalized, currentProductId);
    if (exists) throw new ConflictException("product-slug-already-exists", "Ya existe un producto con ese slug.");
  }

  private void ensureUniqueSkus(List<VariantCommand> commands) {
    Set<String> requestSkus = new HashSet<>();
    for (VariantCommand command : commands) {
      String sku = command.sku().trim().toUpperCase(Locale.ROOT);
      if (!requestSkus.add(sku) || variants.existsBySkuIgnoreCase(sku)) {
        throw new ConflictException("product-sku-already-exists", "El SKU " + sku + " ya está registrado.");
      }
    }
  }

  private ProductView toView(Product product) {
    List<VariantView> variantViews = product.getVariants().stream()
        .map(v -> new VariantView(v.getId(), v.getSku(), v.getSize(), v.getColor(), v.getPrice(),
            v.getInventory() == null ? 0 : v.getInventory().getSellable()))
        .toList();
    return new ProductView(product.getId(), product.getSlug(), product.getName(),
        product.getDescription(), product.getBasePrice(), product.isActive(),
        toView(product.getCategory()), variantViews);
  }

  private CategoryView toView(Category category) {
    return new CategoryView(category.getId(), category.getName(), category.getSlug());
  }

  private static String clean(String value) {
    return value == null || value.isBlank() ? null : value.trim();
  }

  private static String normalizeSlug(String slug) {
    return slug.trim().toLowerCase(Locale.ROOT);
  }

  public record CreateProductCommand(UUID categoryId, String slug, String name, String description,
      BigDecimal basePrice, boolean active, List<VariantCommand> variants) {}
  public record UpdateProductCommand(UUID categoryId, String slug, String name, String description,
      BigDecimal basePrice, boolean active) {}
  public record VariantCommand(String sku, String size, String color, BigDecimal price, int available) {}
  public record CreateCategoryCommand(String name, String slug) {}
  public record ProductView(UUID id, String slug, String name, String description,
      BigDecimal basePrice, boolean active, CategoryView category, List<VariantView> variants) {}
  public record VariantView(UUID id, String sku, String size, String color, BigDecimal price, int available) {}
  public record CategoryView(UUID id, String name, String slug) {}
}
