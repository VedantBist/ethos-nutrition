const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ?? "/api"
).replace(/\/$/, "");
const TOKEN_KEY = "ethos_auth_token";

export interface ApiFood {
  id: string;
  name: string;
  displayName?: string;
  subtitle: string;
  category: string;
  foodType?: string;
  cuisine?: string;
  foodState?: string;
  nutritionBasisUnit?: string;
  nutritionBasisQuantity?: number;
  servingDefaultGrams: number;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  aliases?: string[];
  servings?: {
    id: string;
    label: string;
    unit: string;
    quantityInGrams?: number;
    quantityInMilliliters?: number;
    isDefault: boolean;
  }[];
  icon: string;
  image?: string;
  description?: string;
}

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: AuthenticatedUser;
}

export class ApiError extends Error {}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // Only set JSON content type when a request body is present.
  if (options.body !== undefined && options.body !== null) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new ApiError(
      body?.message ??
        "Unable to connect to Ethos Nutrition. Please try again.",
    );
  }
  return response.json() as Promise<T>;
}

export const authService = {
  async login(email: string, password: string) {
    const result = await request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, result.token);
    return result.user;
  },
  async register(name: string, email: string, password: string) {
    const result = await request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem(TOKEN_KEY, result.token);
    return result.user;
  },
  logout() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export const foodService = {
  list: () => request<ApiFood[]>("/foods"),
  get: (id: string) => request<ApiFood>(`/foods/${id}`),
};
