"use client";

import React, { useState } from "react";
import { Eye } from "lucide-react";
import { sessionStore } from "@/lib/session";

// Custom closed-eye icon with eyelashes matching the expected design
const ClosedEyeIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2 11s3.5 4 10 4 10-4 10-4" />
    <line x1="12" y1="15" x2="12" y2="18.5" />
    <line x1="7" y1="14" x2="5.5" y2="17" />
    <line x1="17" y1="14" x2="18.5" y2="17" />
  </svg>
);

export const OnboardingFlow: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Errors
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;

    if (!email.trim() || !emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    }

    if (!password || password.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      valid = false;
    }

    if (!valid) return;

    sessionStore.saveSession({
      email: email.trim(),
      isGuest: false,
    });
  };

  const handleGoogleSignIn = () => {
    sessionStore.saveSession({
      email: "guest.student@example.com",
      isGuest: true,
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* 1. Full-Bleed Background Image with Sky-Blue Fallback */}
      <div
        className="fixed inset-0 z-0 bg-[#7DD3FC] bg-cover bg-bottom bg-no-repeat pointer-events-none image-pixelated"
        style={{
          backgroundImage:
            "url('/images/meadow-bg.png'), url('/images/meadow-bg.jpg'), linear-gradient(180deg, #7DD3FC 0%, #A7F3D0 65%, #22C55E 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
          imageRendering: "pixelated",
        }}
        aria-hidden="true"
      />

      {/* 2. Centered "Create an account" Card */}
      <div className="relative z-10 w-full max-w-[380px] mx-auto">
        <div
          className="w-full bg-white border-2 border-[#0F172A] p-7 sm:p-8"
          style={{
            borderRadius: "12px",
            boxShadow: "3px 3px 0px #0F172A",
          }}
        >
          {/* Card Title in Pixel Font */}
          <h1 className="text-[26px] sm:text-[28px] font-bold font-pixel text-center text-[#0F172A] mb-7 leading-tight select-none">
            {isLoginMode ? "Log in" : "Create an account"}
          </h1>

          {/* Form */}
          <form onSubmit={handleAccountSubmit} className="flex flex-col gap-3.5">
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[48px] px-4 text-sm sm:text-base bg-[#F1F5F9] text-slate-900 placeholder:text-slate-500 rounded-[8px] border-[1.5px] border-[#94A3B8] focus:border-[#0F172A] focus:outline-none transition-colors"
                required
              />
              {emailError && (
                <p className="text-xs text-rose-600 font-medium mt-1 ml-1">{emailError}</p>
              )}
            </div>

            {/* Password Input with Closed-Eye Toggle */}
            <div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  aria-label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[48px] pl-4 pr-12 text-sm sm:text-base bg-[#F1F5F9] text-slate-900 placeholder:text-slate-500 rounded-[8px] border-[1.5px] border-[#94A3B8] focus:border-[#0F172A] focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 p-1 text-slate-500 hover:text-slate-800 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="w-5 h-5 text-slate-600" />
                  ) : (
                    <ClosedEyeIcon className="w-5 h-5 text-slate-500" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-xs text-rose-600 font-medium mt-1 ml-1">{passwordError}</p>
              )}
            </div>

            {/* Continue Primary 3D Button */}
            <button
              type="submit"
              className="w-full h-[48px] mt-2 bg-[#0A94FF] hover:bg-[#008AE6] text-white font-semibold text-base rounded-[8px] border border-[#0284C7] border-b-4 border-b-[#0369A1] transition-all duration-100 active:translate-y-[2px] active:border-b-2 flex items-center justify-center select-none"
            >
              {isLoginMode ? "Log In" : "Continue"}
            </button>
          </form>

          {/* OR Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              OR
            </span>
          </div>

          {/* Continue with Google 3D Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full h-[48px] bg-white hover:bg-slate-50 text-[#0F172A] font-semibold text-[15px] rounded-[8px] border-[1.5px] border-slate-300 border-b-[3px] border-b-slate-400 transition-all duration-100 active:translate-y-[2px] active:border-b-[1.5px] flex items-center justify-center gap-3 select-none"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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

          {/* Terms and Privacy Disclaimer */}
          <p className="mt-5 text-[12px] text-center text-slate-600 leading-relaxed">
            By continuing, you agree to our{" "}
            <a href="#" className="font-bold underline text-slate-700 hover:text-slate-900">
              Terms
            </a>{" "}
            and{" "}
            <a href="#" className="font-bold underline text-slate-700 hover:text-slate-900">
              Privacy Policy
            </a>
            .
          </p>

          {/* Footer Link (No line divider above it) */}
          <p className="mt-3.5 text-center text-[13px] text-slate-700">
            {isLoginMode ? "Don't have an account? " : "Have an account? "}
            <button
              type="button"
              onClick={() => setIsLoginMode(!isLoginMode)}
              className="text-[#0A94FF] font-semibold underline hover:text-[#0080DB]"
            >
              {isLoginMode ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
