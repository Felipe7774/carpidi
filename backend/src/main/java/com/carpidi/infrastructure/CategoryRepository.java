package com.carpidi.infrastructure;

import com.carpidi.domain.Category;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, UUID> {
  List<Category> findAllByActiveTrueOrderByNameAsc();
  boolean existsBySlugIgnoreCase(String slug);
}
