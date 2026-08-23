package com.vedant.ethosnutrition.service;

import com.vedant.ethosnutrition.dto.ApiDtos.*;
import com.vedant.ethosnutrition.entity.*;
import com.vedant.ethosnutrition.exception.ApiExceptionHandler.*;
import com.vedant.ethosnutrition.repository.*;
import java.math.*;
import java.time.*;
import java.util.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EthosService {

  private final UserRepository users;
  private final FoodRepository foods;
  private final MealRepository meals;
  private final PlannedMealRepository plans;
  private final FoodLogRepository logs;
  private final NutritionTargetRepository targets;
  private final PasswordEncoder passwords;
  private static final BigDecimal HUNDRED = new BigDecimal("100");

  public EthosService(
    UserRepository u,
    FoodRepository f,
    MealRepository m,
    PlannedMealRepository p,
    FoodLogRepository l,
    NutritionTargetRepository t,
    PasswordEncoder pw
  ) {
    users = u;
    foods = f;
    meals = m;
    plans = p;
    logs = l;
    targets = t;
    passwords = pw;
  }

  public User findUser(String id) {
    return users.findById(id).orElseThrow(() -> new NotFound("User not found"));
  }

  private User user(String id) {
    return findUser(id);
  }

  private Food food(String id) {
    return foods
      .findById(id)
      .orElseThrow(() -> new NotFound("Food with id " + id + " was not found"));
  }

  private Meal meal(String id) {
    return meals
      .findWithIngredientsById(id)
      .orElseThrow(() -> new NotFound("Meal with id " + id + " was not found"));
  }

  private void owns(Meal m, String userId) {
    if (!m.getCreatedBy().getId().equals(userId)) throw new NotFound(
      "Meal not found"
    );
  }

  private BigDecimal n(BigDecimal value, BigDecimal grams) {
    return value.multiply(grams).divide(HUNDRED, 2, RoundingMode.HALF_UP);
  }

  private Macros macros(Food f, BigDecimal g) {
    return new Macros(
      n(f.getKcalPer100g(), g),
      n(f.getProteinPer100g(), g),
      n(f.getCarbsPer100g(), g),
      n(f.getFatPer100g(), g)
    );
  }

  private Macros add(Macros a, Macros b) {
    return new Macros(
      a.kcal().add(b.kcal()),
      a.protein().add(b.protein()),
      a.carbs().add(b.carbs()),
      a.fat().add(b.fat())
    );
  }

  public UserResponse register(RegisterRequest r) {
    if (users.existsByEmail(r.email().toLowerCase())) throw new BadRequest(
      "An account with this email already exists"
    );
    var u = new User();
    u.setName(r.name());
    u.setEmail(r.email());
    u.setPasswordHash(passwords.encode(r.password()));
    users.save(u);
    return profile(u);
  }

  public User authenticate(LoginRequest r) {
    var u = users
      .findByEmail(r.email().toLowerCase())
      .orElseThrow(() -> new BadRequest("Invalid email or password"));
    if (
      !passwords.matches(r.password(), u.getPasswordHash())
    ) throw new BadRequest("Invalid email or password");
    return u;
  }

  public UserResponse profile(User u) {
    return new UserResponse(
      u.getId(),
      u.getName(),
      u.getEmail(),
      u.getAge(),
      u.getGender(),
      u.getHeight(),
      u.getWeight(),
      u.getActivityLevel(),
      u.getUnits(),
      u.isNotifications(),
      u.getAvatarUrl(),
      target(u)
    );
  }

  public TargetsResponse target(User u) {
    return targets
      .findByUserId(u.getId())
      .map(t ->
        new TargetsResponse(
          t.getDailyCalories(),
          t.getDailyProtein(),
          t.getDailyCarbohydrates(),
          t.getDailyFat()
        )
      )
      .orElse(
        new TargetsResponse(
          BigDecimal.ZERO,
          BigDecimal.ZERO,
          BigDecimal.ZERO,
          BigDecimal.ZERO
        )
      );
  }

  public List<FoodResponse> listFoods() {
    return listFoods(null, null);
  }

  public List<FoodResponse> listFoods(String query, FoodCategory category) {
    String clean = query == null ? null : query.trim();
    return foods
      .search(clean == null || clean.isBlank() ? null : clean, category)
      .stream()
      .map(this::response)
      .toList();
  }

  public FoodResponse getFood(String id) {
    return response(
      foods
        .findWithAliasesAndServingsById(id)
        .orElseThrow(() -> new NotFound("Food with id " + id + " was not found")
        )
    );
  }

  public FoodResponse response(Food f) {
    return new FoodResponse(
      f.getId(),
      f.getName(),
      f.getDisplayName(),
      f.getSubtitle(),
      f.getCategory().name(),
      f.getFoodType().name(),
      f.getCuisine().name(),
      f.getFoodState().name(),
      f.getNutritionBasisUnit().name(),
      f.getNutritionBasisQuantity(),
      f.getServingDefaultGrams(),
      f.getKcalPer100g(),
      f.getProteinPer100g(),
      f.getCarbsPer100g(),
      f.getFatPer100g(),
      f.getFiberPer100g(),
      f.getAliases().stream().map(a -> a.getAlias()).toList(),
      f
        .getServings()
        .stream()
        .map(s ->
          new ServingResponse(
            s.getId(),
            s.getLabel(),
            s.getUnit(),
            s.getQuantityInGrams(),
            s.getQuantityInMilliliters(),
            s.isDefaultServing()
          )
        )
        .toList(),
      f.getIcon(),
      f.getImage(),
      f.getDescription()
    );
  }

  public FoodResponse createFood(FoodRequest r) {
    var f = new Food();
    copy(r, f);
    return response(foods.save(f));
  }

  public FoodResponse updateFood(String id, FoodRequest r) {
    var f = food(id);
    copy(r, f);
    return response(foods.save(f));
  }

  public void deleteFood(String id) {
    foods.delete(food(id));
  }

  private void copy(FoodRequest r, Food f) {
    f.setName(r.name());
    f.setCategory(r.category());
    f.setSubtitle(r.subtitle());
    f.setServingDefaultGrams(r.servingDefaultGrams());
    f.setKcalPer100g(r.kcalPer100g());
    f.setProteinPer100g(r.proteinPer100g());
    f.setCarbsPer100g(r.carbsPer100g());
    f.setFatPer100g(r.fatPer100g());
    f.setFiberPer100g(r.fiberPer100g());
    f.setIcon(r.icon());
    f.setImage(r.image());
    f.setDescription(r.description());
  }

  @Transactional
  public MealResponse createMeal(String userId, MealRequest r) {
    var m = new Meal();
    m.setCreatedBy(user(userId));
    copy(r, m);
    return mealResponse(meals.save(m));
  }

  @Transactional
  public MealResponse updateMeal(String userId, String id, MealRequest r) {
    var m = meal(id);
    owns(m, userId);
    m.getIngredients().clear();
    copy(r, m);
    return mealResponse(m);
  }

  private void copy(MealRequest r, Meal m) {
    m.setTitle(r.title());
    m.setType(r.type());
    m.setTime(r.time());
    m.setDescription(r.description());
    m.setImage(r.image());
    for (var i : r.ingredients()) {
      var mi = new MealIngredient();
      mi.setMeal(m);
      mi.setFood(food(i.foodId()));
      mi.setAmountGrams(i.amountGrams());
      m.getIngredients().add(mi);
    }
  }

  public List<MealResponse> listMeals(String userId) {
    return meals
      .findByCreatedById(userId)
      .stream()
      .map(this::mealResponse)
      .toList();
  }

  public MealResponse getMeal(String userId, String id) {
    var m = meal(id);
    owns(m, userId);
    return mealResponse(m);
  }

  public MealResponse mealResponse(Meal m) {
    var ing = m
      .getIngredients()
      .stream()
      .map(i ->
        new IngredientResponse(
          i.getFood().getId(),
          i.getFood().getName(),
          i.getFood().getSubtitle(),
          i.getAmountGrams(),
          i.getFood().getKcalPer100g(),
          i.getFood().getProteinPer100g(),
          i.getFood().getCarbsPer100g(),
          i.getFood().getFatPer100g(),
          i.getFood().getIcon()
        )
      )
      .toList();
    Macros total = ing
      .stream()
      .map(i -> macros(food(i.foodId()), i.amountGrams()))
      .reduce(
        new Macros(
          BigDecimal.ZERO,
          BigDecimal.ZERO,
          BigDecimal.ZERO,
          BigDecimal.ZERO
        ),
        this::add
      );
    return new MealResponse(
      m.getId(),
      m.getTitle(),
      m.getType(),
      m.getTime(),
      m.getDescription(),
      m.getImage(),
      total,
      ing
    );
  }

  @Transactional
  public void deleteMeal(String userId, String id) {
    var m = meal(id);
    owns(m, userId);
    meals.delete(m);
  }

  @Transactional
  public PlannedMealResponse createPlan(String userId, PlannedMealRequest r) {
    var p = new PlannedMeal();
    p.setUser(user(userId));
    var m = meal(r.mealId());
    owns(m, userId);
    p.setMeal(m);
    p.setPlannedDate(r.plannedDate());
    p.setMealType(r.mealType());
    return planResponse(plans.save(p));
  }

  @Transactional
  public PlannedMealResponse updatePlan(
    String userId,
    String id,
    PlannedMealRequest r
  ) {
    var p = plans
      .findById(id)
      .orElseThrow(() -> new NotFound("Planned meal not found"));
    if (!p.getUser().getId().equals(userId)) throw new NotFound(
      "Planned meal not found"
    );
    var m = meal(r.mealId());
    owns(m, userId);
    p.setMeal(m);
    p.setPlannedDate(r.plannedDate());
    p.setMealType(r.mealType());
    return planResponse(p);
  }

  public List<PlannedMealResponse> week(String userId, LocalDate start) {
    return plans
      .findByUserIdAndPlannedDateBetweenOrderByPlannedDate(
        userId,
        start,
        start.plusDays(6)
      )
      .stream()
      .map(this::planResponse)
      .toList();
  }

  private PlannedMealResponse planResponse(PlannedMeal p) {
    return new PlannedMealResponse(
      p.getId(),
      p.getPlannedDate(),
      p.getMealType(),
      mealResponse(p.getMeal())
    );
  }

  @Transactional
  public void deletePlan(String userId, String id) {
    var p = plans
      .findById(id)
      .orElseThrow(() -> new NotFound("Planned meal not found"));
    if (!p.getUser().getId().equals(userId)) throw new NotFound(
      "Planned meal not found"
    );
    plans.delete(p);
  }

  @Transactional
  public FoodLogResponse log(String userId, FoodLogRequest r) {
    if ((r.foodId() == null) == (r.mealId() == null)) throw new BadRequest(
      "Provide exactly one of foodId or mealId"
    );
    var l = new FoodLog();
    l.setUser(user(userId));
    l.setMealType(r.mealType());
    l.setQuantityGrams(r.quantityGrams());
    l.setLoggedAt(r.loggedAt());
    if (r.foodId() != null) l.setFood(food(r.foodId()));
    else {
      var m = meal(r.mealId());
      owns(m, userId);
      l.setMeal(m);
    }
    return logResponse(logs.save(l));
  }

  private FoodLogResponse logResponse(FoodLog l) {
    Macros m = l.getFood() != null
      ? macros(l.getFood(), l.getQuantityGrams())
      : mealResponse(l.getMeal()).nutrition();
    return new FoodLogResponse(
      l.getId(),
      l.getFood() == null ? null : l.getFood().getId(),
      l.getMeal() == null ? null : l.getMeal().getId(),
      l.getFood() != null ? l.getFood().getName() : l.getMeal().getTitle(),
      l.getQuantityGrams(),
      l.getMealType(),
      l.getLoggedAt(),
      m
    );
  }

  public NutritionSummaryResponse daily(String uid, LocalDate date) {
    var start = date.atStartOfDay(ZoneOffset.UTC).toInstant();
    var end = date.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
    var list = logs
      .findByUserIdAndLoggedAtBetweenOrderByLoggedAtDesc(uid, start, end)
      .stream()
      .map(this::logResponse)
      .toList();
    var total = list
      .stream()
      .map(FoodLogResponse::nutrition)
      .reduce(
        new Macros(
          BigDecimal.ZERO,
          BigDecimal.ZERO,
          BigDecimal.ZERO,
          BigDecimal.ZERO
        ),
        this::add
      );
    return new NutritionSummaryResponse(date, total, target(user(uid)), list);
  }

  @Transactional
  public UserResponse updateProfile(String uid, ProfileRequest r) {
    var u = user(uid);
    u.setName(r.name());
    u.setAge(r.age());
    u.setGender(r.gender());
    u.setHeight(r.height());
    u.setWeight(r.weight());
    u.setActivityLevel(r.activityLevel());
    if (r.units() != null) u.setUnits(r.units());
    if (r.notifications() != null) u.setNotifications(r.notifications());
    u.setAvatarUrl(r.avatarUrl());
    if (r.targets() != null) {
      var t = targets
        .findByUserId(uid)
        .orElseGet(() -> {
          var x = new NutritionTarget();
          x.setUser(u);
          return x;
        });
      t.setDailyCalories(r.targets().dailyCalories());
      t.setDailyProtein(r.targets().dailyProtein());
      t.setDailyCarbohydrates(r.targets().dailyCarbohydrates());
      t.setDailyFat(r.targets().dailyFat());
      targets.save(t);
    }
    return profile(u);
  }
}
