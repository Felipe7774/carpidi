package com.carpidi.infrastructure;

import com.carpidi.domain.Product;
import java.util.*;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, UUID> {
  Optional<Product> findByIdAndActiveTrue(UUID id);
  boolean existsBySlugIgnoreCase(String slug);
  boolean existsBySlugIgnoreCaseAndIdNot(String slug, UUID id);

  @Query(value = """
      select distinct p from Product p
      join p.category c
      left join p.variants v
      where p.active = true and c.active = true
        and (:query = '' or lower(p.name) like lower(concat('%', :query, '%'))
          or lower(p.description) like lower(concat('%', :query, '%')))
        and (:category = '' or lower(c.slug) = lower(:category))
        and (:size = '' or lower(v.size) = lower(:size))
        and (:color = '' or lower(v.color) = lower(:color))
      """,
      countQuery = """
      select count(distinct p.id) from Product p
      join p.category c
      left join p.variants v
      where p.active = true and c.active = true
        and (:query = '' or lower(p.name) like lower(concat('%', :query, '%'))
          or lower(p.description) like lower(concat('%', :query, '%')))
        and (:category = '' or lower(c.slug) = lower(:category))
        and (:size = '' or lower(v.size) = lower(:size))
        and (:color = '' or lower(v.color) = lower(:color))
      """)
  Page<Product> searchActive(@Param("query") String query, @Param("category") String category,
      @Param("size") String size, @Param("color") String color, Pageable pageable);
}
