"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";

export default function LandingPage() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <h1 className="mb-6 text-4xl font-bold">Welcome to My App</h1>
      <p className="mb-8 text-gray-600">Manage your tasks efficiently.</p>

      <div className="flex gap-4">
        <button
          onClick={() => setShowSignUp(true)}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Sign Up
        </button>
        <button
          onClick={() => setShowSignIn(true)}
          className="rounded-lg border border-gray-400 px-4 py-2"
        >
          Sign In
        </button>
      </div>

      {showSignIn && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="relative rounded-lg bg-white p-4">
            <button
              onClick={() => setShowSignIn(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✕
            </button>
            <SignIn signUpUrl="/sign-up" routing="hash" />
          </div>
        </div>
      )}

      {showSignUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="relative rounded-lg bg-white p-4">
            <button
              onClick={() => setShowSignUp(false)}
              className="absolute top-2 right-2 text-gray-500"
            >
              ✕
            </button>
            <SignUp signInUrl="/sign-in" routing="hash" />
          </div>
        </div>
      )}
    </div>
  );
}
