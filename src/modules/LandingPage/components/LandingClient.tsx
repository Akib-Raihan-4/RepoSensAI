"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Github, Video, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingClient() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const features = [
    {
      icon: Github,
      title: "Summarize Commits",
      description:
        "AI-powered analysis of your GitHub repositories with intelligent commit summaries and insights.",
    },
    {
      icon: Video,
      title: "Analyze Meetings",
      description:
        "Transform meeting videos into actionable insights with automatic transcription and key point extraction.",
    },
    {
      icon: Search,
      title: "Search Everything",
      description:
        "Powerful search across all your repositories and meetings with natural language queries.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              RepoSensAI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-4 max-w-2xl text-xl text-gray-300 sm:text-2xl"
          >
            AI-Powered Repository & Meeting Intelligence
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mx-auto mb-10 max-w-2xl text-base text-gray-400 sm:text-lg"
          >
            Analyze GitHub repositories and meeting videos with AI. Get instant
            summaries, generate insights, and make everything searchable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button
              onClick={() => setShowSignUp(true)}
              className="group relative overflow-hidden rounded-lg bg-white px-8 py-3 text-base font-semibold text-black transition-all hover:scale-105"
            >
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-20" />
            </Button>
            <Button
              onClick={() => setShowSignIn(true)}
              className="rounded-lg border border-gray-700 px-8 py-3 text-base font-semibold text-white transition-all hover:border-gray-500 hover:bg-gray-900"
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-32"
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-gray-900/50 p-8 backdrop-blur-sm transition-all hover:border-gray-700"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-3">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="relative border-t border-gray-800 py-8"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © 2025 RepoSensAI. All rights reserved.
          </p>
        </div>
      </motion.footer>

      {showSignIn && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowSignIn(false)}
        >
          <SignIn routing="hash" />
        </motion.div>
      )}

      {showSignUp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setShowSignUp(false)}
        >
          <SignUp routing="hash" />
        </motion.div>
      )}
    </div>
  );
}
