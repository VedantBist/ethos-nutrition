package com.vedant.ethosnutrition.repository;

import com.vedant.ethosnutrition.entity.Food;
import java.util.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface FoodRepository extends JpaRepository<Food, String> {
  @EntityGraph(attributePaths = { "aliases", "servings" })
  List<Food> findAllByOrderByNameAsc();

  @EntityGraph(attributePaths = { "aliases", "servings" })
  Optional<Food> findWithAliasesAndServingsById(String id);

  @EntityGraph(attributePaths = { "aliases", "servings" })
  @Query(
    "select distinct f from Food f left join f.aliases a where (:category is null or f.category = :category) and (:query is null or lower(f.name) like lower(concat('%',:query,'%')) or lower(coalesce(f.displayName,'')) like lower(concat('%',:query,'%')) or lower(a.alias) like lower(concat('%',:query,'%'))) order by f.name"
  )
  List<Food> search(
    @Param("query") String query,
    @Param("category") com.vedant.ethosnutrition.entity.FoodCategory category
  );

  @EntityGraph(attributePaths = { "aliases", "servings" })
  List<Food> findByExternalIdStartingWithAndSourceReferenceContaining(
    String prefix,
    String referenceFragment
  );

  Optional<Food> findByExternalId(String externalId);
  boolean existsByExternalId(String externalId);
}
