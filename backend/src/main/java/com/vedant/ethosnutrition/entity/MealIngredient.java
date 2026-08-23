package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class MealIngredient {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Meal meal;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private Food food;

  @Column(nullable = false, precision = 10, scale = 2)
  private BigDecimal amountGrams;

  public String getId() {
    return id;
  }

  public Meal getMeal() {
    return meal;
  }

  public void setMeal(Meal v) {
    meal = v;
  }

  public Food getFood() {
    return food;
  }

  public void setFood(Food v) {
    food = v;
  }

  public BigDecimal getAmountGrams() {
    return amountGrams;
  }

  public void setAmountGrams(BigDecimal v) {
    amountGrams = v;
  }
}
