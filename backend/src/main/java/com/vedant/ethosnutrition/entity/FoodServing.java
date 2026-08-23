package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(indexes = @Index(name = "idx_food_serving_food", columnList = "food_id"))
public class FoodServing {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "food_id", nullable = false)
  private Food food;

  @Column(nullable = false, length = 120)
  private String label;

  @Column(nullable = false, length = 40)
  private String unit;

  @Column(precision = 10, scale = 2)
  private BigDecimal quantityInGrams;

  @Column(precision = 10, scale = 2)
  private BigDecimal quantityInMilliliters;

  @Column(nullable = false)
  private boolean defaultServing;

  public String getId() {
    return id;
  }

  public Food getFood() {
    return food;
  }

  public void setFood(Food v) {
    food = v;
  }

  public String getLabel() {
    return label;
  }

  public void setLabel(String v) {
    label = v;
  }

  public String getUnit() {
    return unit;
  }

  public void setUnit(String v) {
    unit = v;
  }

  public BigDecimal getQuantityInGrams() {
    return quantityInGrams;
  }

  public void setQuantityInGrams(BigDecimal v) {
    quantityInGrams = v;
  }

  public BigDecimal getQuantityInMilliliters() {
    return quantityInMilliliters;
  }

  public void setQuantityInMilliliters(BigDecimal v) {
    quantityInMilliliters = v;
  }

  public boolean isDefaultServing() {
    return defaultServing;
  }

  public void setDefaultServing(boolean v) {
    defaultServing = v;
  }
}
