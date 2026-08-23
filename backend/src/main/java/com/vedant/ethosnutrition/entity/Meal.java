package com.vedant.ethosnutrition.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.*;

@Entity
@Table(name = "meals")
public class Meal {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private String id;

  @Column(nullable = false)
  private String title;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false)
  private MealType type;

  private String time;

  @Column(length = 3000)
  private String description;

  @Column(length = 2000)
  private String image;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(nullable = false)
  private User createdBy;

  @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<MealIngredient> ingredients = new ArrayList<>();

  private Instant createdAt;
  private Instant updatedAt;

  @PrePersist
  void create() {
    createdAt = updatedAt = Instant.now();
  }

  @PreUpdate
  void update() {
    updatedAt = Instant.now();
  }

  public String getId() {
    return id;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String v) {
    title = v;
  }

  public MealType getType() {
    return type;
  }

  public void setType(MealType v) {
    type = v;
  }

  public String getTime() {
    return time;
  }

  public void setTime(String v) {
    time = v;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String v) {
    description = v;
  }

  public String getImage() {
    return image;
  }

  public void setImage(String v) {
    image = v;
  }

  public User getCreatedBy() {
    return createdBy;
  }

  public void setCreatedBy(User v) {
    createdBy = v;
  }

  public List<MealIngredient> getIngredients() {
    return ingredients;
  }
}
