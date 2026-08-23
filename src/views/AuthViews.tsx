import React, { useState } from "react";
import { ActiveTab, UserProfile } from "../types";
import { authService, ApiError } from "../services/api";

interface AuthViewsProps {
  mode: "login" | "register";
  setActiveTab: (tab: ActiveTab) => void;
  onAuthenticate: (name: string, email: string) => void;
}

export const AuthViews: React.FC<AuthViewsProps> = ({
  mode,
  setActiveTab,
  onAuthenticate,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const user =
        mode === "login"
          ? await authService.login(email, password)
          : await authService.register(name, email, password);
      onAuthenticate(user.name, user.email);
      setActiveTab("overview");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to reach the server. You can still continue as a guest.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickGuest = () => {
    onAuthenticate("Aura Serene", "aura@example.com");
    setActiveTab("overview");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 md:p-8 relative overflow-hidden animate-fade-in">
      <main className="w-full max-w-[480px] z-10 relative">
        <div className="bg-[#0e0e0e]/90 backdrop-blur-2xl border border-[#444748]/30 rounded-2xl p-8 md:p-12 flex flex-col gap-10 shadow-[0_30px_60px_-15px_rgba(186,203,188,0.08)]">
          {/* Header */}
          <header className="text-center flex flex-col gap-2">
            <h1 className="font-display-lg text-4xl text-[#e5e2e1] italic">
              Ethos Nutrition
            </h1>
            <p className="font-label-caps text-xs text-[#bacbbc] uppercase tracking-[0.15em]">
              {mode === "login" ? "Ritual of Care" : "Begin Your Ritual"}
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {mode === "register" && (
              <div className="relative group">
                <label className="sr-only" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="input-minimal w-full font-body-md text-base"
                />
              </div>
            )}

            <div className="relative group">
              <label className="sr-only" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="input-minimal w-full font-body-md text-base"
              />
            </div>

            <div className="relative group">
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="input-minimal w-full font-body-md text-base"
              />
            </div>

            {mode === "register" && (
              <div className="relative group">
                <label className="sr-only" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="input-minimal w-full font-body-md text-base"
                />
              </div>
            )}

            <div className="flex flex-col gap-4 mt-4">
              {error && (
                <p
                  role="alert"
                  className="text-sm text-[#d9a7a2] text-center -mt-2"
                >
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9E8E77] hover:bg-[#b0a08b] text-[#141313] font-label-caps text-xs uppercase tracking-wider py-4 rounded-full transition-all duration-300 font-semibold shadow-lg active:scale-98"
              >
                {isSubmitting
                  ? "Entering Sanctuary…"
                  : mode === "login"
                    ? "Enter Sanctuary"
                    : "Create Account"}
              </button>

              <button
                type="button"
                onClick={handleQuickGuest}
                className="w-full border border-[#444748]/30 hover:border-[#bacbbc] text-[#c4c7c7] hover:text-[#e5e2e1] font-label-caps text-xs uppercase tracking-wider py-3.5 rounded-full transition-all duration-300"
              >
                Continue as Guest (Aura Serene)
              </button>

              <div className="flex justify-between items-center text-xs text-[#c4c7c7] pt-2">
                {mode === "login" ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab("register")}
                      className="hover:text-[#e5e2e1] transition-colors"
                    >
                      Need an account? Register
                    </button>
                    <button
                      type="button"
                      onClick={handleQuickGuest}
                      className="hover:text-[#e5e2e1] transition-colors"
                    >
                      Forgot password?
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="w-full text-center hover:text-[#e5e2e1] transition-colors"
                  >
                    Already have an account? Log In
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
