package com.vedant.ethosnutrition.dto;

import com.vedant.ethosnutrition.entity.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.*;
import java.util.*;

public final class ApiDtos {

  private ApiDtos() {}

  public record RegisterRequest(
    @NotBlank @Size(max = 100) String name,
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8, max = 100) String password
  ) {}

  public record LoginRequest(
    @NotBlank @Email String email,
    @NotBlank String password
  ) {}

  public record AuthResponse(String token, UserResponse user) {}

  public record UserResponse(
    String id,
    String name,
    String email,
    Integer age,
    String gender,
    String height,
    String weight,
    String activityLevel,
    String units,
    boolean notifications,
    String avatarUrl,
    TargetsResponse targets
  ) {}

  public record FoodRequest(
    @NotBlank String name,
    @NotNull FoodCategory category,
    String subtitle,
    @NotNull @Positive BigDecimal servingDefaultGrams,
    @NotNull @PositiveOrZero BigDecimal kcalPer100g,
    @NotNull @PositiveOrZero BigDecimal proteinPer100g,
    @NotNull @PositiveOrZero BigDecimal carbsPer100g,
    @NotNull @PositiveOrZero BigDecimal fatPer100g,
    @NotNull @PositiveOrZero BigDecimal fiberPer100g,
    String icon,
    String image,
    String description
  ) {}

  public record ServingResponse(
    String id,
    String label,
    String unit,
    BigDecimal quantityInGrams,
    BigDecimal quantityInMilliliters,
    boolean isDefault
  ) {}

  public record FoodResponse(
    String id,
    String name,
    String displayName,
    String subtitle,
    String category,
    String foodType,
    String cuisine,
    String foodState,
    String nutritionBasisUnit,
    BigDecimal nutritionBasisQuantity,
    BigDecimal servingDefaultGrams,
    BigDecimal kcalPer100g,
    BigDecimal proteinPer100g,
    BigDecimal carbsPer100g,
    BigDecimal fatPer100g,
    BigDecimal fiberPer100g,
    List<String> aliases,
    List<ServingResponse> servings,
    String icon,
    String image,
    String description
  ) {}

  public record IngredientRequest(
    @NotBlank String foodId,
    @NotNull @Positive BigDecimal amountGrams
  ) {}

  public record MealRequest(
    @NotBlank String title,
    @NotNull MealType type,
    String time,
    String description,
    String image,
    @NotEmpty List<@Valid IngredientRequest> ingredients
  ) {}

  public record IngredientResponse(
    String foodId,
    String name,
    String subtitle,
    BigDecimal amountGrams,
    BigDecimal kcalPer100g,
    BigDecimal proteinPer100g,
    BigDecimal carbsPer100g,
    BigDecimal fatPer100g,
    String icon
  ) {}

  public record Macros(
    BigDecimal kcal,
    BigDecimal protein,
    BigDecimal carbs,
    BigDecimal fat
  ) {}

  public record MealResponse(
    String id,
    String title,
    MealType type,
    String time,
    String description,
    String image,
    Macros nutrition,
    List<IngredientResponse> ingredients
  ) {}

  public record PlannedMealRequest(
    @NotBlank String mealId,
    @NotNull LocalDate plannedDate,
    @NotNull MealType mealType
  ) {}

  public record PlannedMealResponse(
    String id,
    LocalDate plannedDate,
    MealType mealType,
    MealResponse meal
  ) {}

  public record FoodLogRequest(
    String foodId,
    String mealId,
    @NotNull @Positive BigDecimal quantityGrams,
    @NotNull MealType mealType,
    Instant loggedAt
  ) {}

  public record FoodLogResponse(
    String id,
    String foodId,
    String mealId,
    String name,
    BigDecimal quantityGrams,
    MealType mealType,
    Instant loggedAt,
    Macros nutrition
  ) {}

  public record TargetsRequest(
    @NotNull @PositiveOrZero BigDecimal dailyCalories,
    @NotNull @PositiveOrZero BigDecimal dailyProtein,
    @NotNull @PositiveOrZero BigDecimal dailyCarbohydrates,
    @NotNull @PositiveOrZero BigDecimal dailyFat
  ) {}

  public record TargetsResponse(
    BigDecimal dailyCalories,
    BigDecimal dailyProtein,
    BigDecimal dailyCarbohydrates,
    BigDecimal dailyFat
  ) {}

  public record ProfileRequest(
    @NotBlank String name,
    Integer age,
    String gender,
    String height,
    String weight,
    String activityLevel,
    String units,
    Boolean notifications,
    String avatarUrl,
    TargetsRequest targets
  ) {}

  public record NutritionSummaryResponse(
    LocalDate date,
    Macros consumed,
    TargetsResponse targets,
    List<FoodLogResponse> logs
  ) {}
}
