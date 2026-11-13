"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ConsoleScreen } from "@/components/ui/ConsoleScreen";
import { sessionStore } from "@/lib/session";
import { Lang } from "@mentor/shared";
import { cn } from "@/lib/utils";

type OnboardingStep = "account" | "username" | "language";

export const OnboardingFlow: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>("account");

  // Form State
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<Lang>("python");

  // Error States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");

  // Load existing session on mount if available
  useEffect(() => {
    const existing = sessionStore.getSession();
    if (existing) {
      if (existing.email) setEmail(existing.email);
      if (existing.username && existing.username !== "GuestCoder") {
        setUsername(existing.username);
      }
      if (existing.selectedLanguage) {
        setSelectedLanguage(existing.selectedLanguage);
      }
    }
  }, []);

  // Validation Handlers
  const validateAccount = (): boolean => {
    let valid = true;
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    }

    return valid;
  };

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateAccount()) return;

    sessionStore.saveSession({
      email,
      isGuest: false,
    });
    setStep("username");
  };

  const handleGoogleSignIn = () => {
    // Mock Google Sign-In
    sessionStore.saveSession({
      email: "google.coder@example.com",
      isGuest: true,
    });
    setStep("username");
  };

  const validateUsername = (): boolean => {
    setUsernameError("");
    const trimmed = username.trim();
    const usernameRegex = /^[a-zA-Z0-9_]{3,16}$/;

    if (!usernameRegex.test(trimmed)) {
      setUsernameError("3 to 16 characters (letters, numbers, underscore only).");
      return false;
    }

    return true;
  };

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUsername()) return;

    sessionStore.saveSession({
      username: username.trim(),
    });
    setStep("language");
  };

  const handleFinishOnboarding = () => {
    sessionStore.saveSession({
      selectedLanguage,
    });
    router.push("/dashboard");
  };

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-x-hidden bg-[#22C55E]">
      {/* Pixel Landscape Meadow Background */}
      <div
        className="absolute inset-0 bg-cover bg-center image-pixelated select-none"
        style={{
          backgroundImage: "url('/assets/meadow-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        aria-hidden="true"
      />

      {/* Subtle overlay for contrast */}
      <div className="absolute inset-0 bg-black/10 select-none pointer-events-none" />

      {/* Top Floating Step Indicator / Navigation */}
      <div className="relative z-20 mb-4 flex items-center gap-3">
        {step !== "account" && (
          <button
            type="button"
            onClick={() => setStep(step === "language" ? "username" : "account")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-slate-900 border-2 border-slate-900 rounded-xl shadow-retro-sm retro-press text-xs font-bold font-pixel"
            aria-label="Go back to previous step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            BACK
          </button>
        )}
        <div className="flex items-center gap-2 px-3 py-1 bg-white/95 border-2 border-slate-900 rounded-xl shadow-retro-sm text-[11px] font-pixel font-bold text-slate-800">
          <span className={step === "account" ? "text-[#0095FF]" : "text-slate-400"}>
            1. ACCOUNT
          </span>
          <span>&gt;</span>
          <span className={step === "username" ? "text-[#A855F7]" : "text-slate-400"}>
            2. USERNAME
          </span>
          <span>&gt;</span>
          <span className={step === "language" ? "text-[#16A34A]" : "text-slate-400"}>
            3. LANGUAGE
          </span>
        </div>
      </div>

      {/* Main Container for Active Step */}
      <div className="relative z-20 w-full max-w-sm flex items-center justify-center">
        {/* ========================================================================= */}
        {/* SCREEN 1: CREATE AN ACCOUNT */}
        {/* ========================================================================= */}
        {step === "account" && (
          <Card
            shadow="lg"
            className="w-full max-w-[340px] sm:max-w-[360px] p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-retro animate-fadeIn"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold font-pixel tracking-tight text-slate-900">
                {isLoginMode ? "Log in" : "Create an account"}
              </h1>
            </div>

            <form onSubmit={handleAccountSubmit} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full mt-2 font-pixel tracking-wider text-sm bg-[#0095FF] hover:bg-[#0080DB] text-white rounded-xl py-3 border-2 border-slate-900 shadow-retro"
              >
                {isLoginMode ? "Log In" : "Continue"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300" />
              </div>
              <span className="relative bg-white px-3 text-xs font-semibold uppercase text-slate-400">
                OR
              </span>
            </div>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-300 shadow-sm transition-all duration-150 retro-press active:translate-x-0.5 active:translate-y-0.5"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Terms Disclaimer */}
            <p className="mt-5 text-[11px] text-center text-slate-500 leading-normal">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-slate-900">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-slate-900">
                Privacy Policy
              </a>
              .
            </p>

            {/* Footer Link */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-600">
                {isLoginMode ? "Don't have an account? " : "Have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLoginMode(!isLoginMode)}
                  className="font-bold text-[#0095FF] hover:underline"
                >
                  {isLoginMode ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </Card>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: CREATE A USERNAME (Handheld Retro Console) */}
        {/* ========================================================================= */}
        {step === "username" && (
          <div className="w-full animate-fadeIn">
            <ConsoleScreen
              onButtonPress={(btn) => {
                if (btn === "A" || btn === "START") {
                  if (validateUsername()) {
                    sessionStore.saveSession({ username: username.trim() });
                    setStep("language");
                  }
                }
              }}
            >
              <div className="flex flex-col items-center justify-center w-full px-2">
                {/* Pixel Art Screen Title */}
                <h2 className="text-base sm:text-lg font-bold font-pixel tracking-wider text-slate-900 mb-4 text-center">
                  CREATE
                  <br />
                  A USERNAME
                </h2>

                <form onSubmit={handleUsernameSubmit} className="w-full flex flex-col items-center gap-3">
                  <div className="w-full max-w-[200px]">
                    <input
                      type="text"
                      placeholder="User Name"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={16}
                      autoFocus
                      className="w-full px-3 py-2 text-center text-sm font-pixel font-bold bg-white text-slate-900 placeholder:text-slate-400 rounded-lg border-2 border-slate-900 shadow-retro-sm outline-none focus:border-purple-600"
                    />
                    {usernameError && (
                      <p className="text-[10px] text-center font-bold text-rose-600 mt-1">
                        {usernameError}
                      </p>
                    )}
                  </div>

                  {/* Lavender Continue Button matching mockup (typo fixed) */}
                  <button
                    type="submit"
                    className="mt-2 px-6 py-2 bg-[#C084FC] hover:bg-[#A855F7] text-slate-950 font-pixel font-bold text-xs uppercase tracking-wider rounded-xl border-2 border-slate-900 shadow-retro-sm retro-press active:translate-x-0.5 active:translate-y-0.5"
                  >
                    CONTINUE
                  </button>
                </form>
              </div>
            </ConsoleScreen>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: SELECT CODING (Pick Your Coding Language) */}
        {/* ========================================================================= */}
        {step === "language" && (
          <Card
            shadow="lg"
            className="w-full max-w-[340px] sm:max-w-[360px] p-6 bg-white border-2 border-slate-900 rounded-2xl shadow-retro animate-fadeIn"
          >
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold font-pixel tracking-tight text-slate-900">
                Select Coding
              </h1>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                Pick Your Coding Language
              </p>
            </div>

            {/* Language Options Stack */}
            <div className="flex flex-col gap-3">
              {[
                { id: "python", label: "Python", badge: "Pyodide Sandbox" },
                { id: "javascript", label: "JavaScript", badge: "Web Worker" },
                { id: "cpp", label: "C++", badge: "Native Runner" },
              ].map((lang) => {
                const isSelected = selectedLanguage === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setSelectedLanguage(lang.id as Lang)}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all duration-150 retro-press text-left",
                      isSelected
                        ? "bg-[#A5F3FC]/50 border-slate-900 shadow-retro font-bold text-slate-950"
                        : "bg-white border-slate-300 hover:border-slate-600 hover:bg-slate-50 text-slate-800 font-semibold"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-base font-pixel tracking-wide">{lang.label}</span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {lang.badge}
                      </span>
                    </div>

                    {isSelected ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Final Action Button to enter the dashboard */}
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleFinishOnboarding}
              className="w-full mt-6 font-pixel tracking-wider text-sm bg-[#0095FF] hover:bg-[#0080DB] text-white rounded-xl py-3.5 border-2 border-slate-900 shadow-retro"
            >
              START CODING &rarr;
            </Button>
          </Card>
        )}
      </div>
    </main>
  );
};
