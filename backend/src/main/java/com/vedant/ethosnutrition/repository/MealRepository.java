package com.vedant.ethosnutrition.repository;

import com.vedant.ethosnutrition.entity.Meal;
import java.util.*;
import org.springframework.data.jpa.repository.*;

public interface MealRepository extends JpaRepository<Meal, String> {
  @EntityGraph(attributePaths = { "ingredients", "ingredients.food" })
  List<Meal> findByCreatedById(String userId);

  @EntityGraph(attributePaths = { "ingredients", "ingredients.food" })
  Optional<Meal> findWithIngredientsById(String id);
}
