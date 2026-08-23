package com.vedant.ethosnutrition.entity;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter
public class FoodCategoryConverter
  implements AttributeConverter<FoodCategory, String> {

  public String convertToDatabaseColumn(FoodCategory value) {
    return value == null ? null : value.name();
  }

  public FoodCategory convertToEntityAttribute(String value) {
    if (value == null || value.isBlank()) return FoodCategory.OTHER;
    try {
      return FoodCategory.valueOf(value);
    } catch (IllegalArgumentException ignored) {
      return switch (value) {
        case "Proteins" -> FoodCategory.OTHER;
        case "Grains & Staples" -> FoodCategory.CEREALS;
        case "Dairy" -> FoodCategory.DAIRY;
        case "Fruits" -> FoodCategory.FRUITS;
        case "Vegetables" -> FoodCategory.VEGETABLES;
        case "Legumes" -> FoodCategory.LEGUMES;
        case "Nuts & Seeds" -> FoodCategory.NUTS;
        default -> FoodCategory.OTHER;
      };
    }
  }
}
