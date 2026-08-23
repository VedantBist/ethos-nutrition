package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;

@Entity
@Table(
  uniqueConstraints = @UniqueConstraint(
    name = "uk_food_alias",
    columnNames = { "food_id", "alias" }
  ),
  indexes = @Index(name = "idx_food_alias", columnList = "alias")
)
public class FoodAlias {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "food_id", nullable = false)
  private Food food;

  @Column(nullable = false, length = 300)
  private String alias;

  public String getId() {
    return id;
  }

  public Food getFood() {
    return food;
  }

  public void setFood(Food v) {
    food = v;
  }

  public String getAlias() {
    return alias;
  }

  public void setAlias(String v) {
    alias = v;
  }
}
