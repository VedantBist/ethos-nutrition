package com.vedant.ethosnutrition.repository;

import com.vedant.ethosnutrition.entity.PlannedMeal;
import java.time.*;
import java.util.*;
import org.springframework.data.jpa.repository.*;

public interface PlannedMealRepository
  extends JpaRepository<PlannedMeal, String> {
  @EntityGraph(
    attributePaths = { "meal", "meal.ingredients", "meal.ingredients.food" }
  )
  List<PlannedMeal> findByUserIdAndPlannedDateBetweenOrderByPlannedDate(
    String userId,
    LocalDate start,
    LocalDate end
  );
}
