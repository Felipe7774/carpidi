package com.carpidi.application;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.carpidi.application.CatalogService.*;
import com.carpidi.domain.*;
import com.carpidi.infrastructure.*;
import java.math.BigDecimal;
import java.util.*;
import org.junit.jupiter.api.*;
import org.mockito.*;
import org.springframework.data.domain.PageImpl;

class CatalogServiceTest {
  @Mock ProductRepository products;
  @Mock CategoryRepository categories;
  @Mock ProductVariantRepository variants;
  @InjectMocks CatalogService catalog;

  @BeforeEach void initialize() { MockitoAnnotations.openMocks(this); }

  @Test
  void rejectsPageSizesAboveBusinessLimit() {
    assertThatThrownBy(() -> catalog.search(null, null, null, null, 0, 101))
        .isInstanceOf(IllegalArgumentException.class)
        .hasMessageContaining("entre 1 y 100");
    verifyNoInteractions(products);
  }

  @Test
  void returnsOnlyRepositoryCatalogResults() {
    when(products.searchActive(eq(""), eq(""), eq(""), eq(""), any()))
        .thenReturn(new PageImpl<>(List.of()));
    assertThat(catalog.search(" ", null, null, null, 0, 20)).isEmpty();
    verify(products).searchActive(eq(""), eq(""), eq(""), eq(""), any());
  }

  @Test
  void createsProductWithVariantAndInventory() {
    Category category = new Category("Ropa", "ropa");
    when(categories.findById(any())).thenReturn(Optional.of(category));
    when(products.existsBySlugIgnoreCase(anyString())).thenReturn(false);
    when(variants.existsBySkuIgnoreCase(anyString())).thenReturn(false);
    when(products.save(any())).thenAnswer(invocation -> invocation.getArgument(0));
    UUID categoryId = UUID.randomUUID();
    var command = new CreateProductCommand(categoryId, "vestido-midi", "Vestido midi", null,
        new BigDecimal("149900.00"), true,
        List.of(new VariantCommand("VES-MID-M-NEG", "M", "Negro", new BigDecimal("149900.00"), 8)));

    ProductView result = catalog.create(command);

    assertThat(result.name()).isEqualTo("Vestido midi");
    assertThat(result.variants()).singleElement().satisfies(variant -> {
      assertThat(variant.sku()).isEqualTo("VES-MID-M-NEG");
      assertThat(variant.available()).isEqualTo(8);
    });
  }
}
