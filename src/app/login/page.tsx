/* eslint-disable */

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../lib/auth";
import { useAuthContext } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Lock, Mail, LogIn, Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { refreshAuth } = useAuthContext();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      await refreshAuth();
      router.replace("/tracker");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErr(error.message);
      } else {
        setErr("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl shadow-pink-500/10 border border-white/20 p-8 md:p-12 w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="flex justify-center items-center mb-4">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-3xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-bl from-pink-400 to bg-pink-600 py-1"
          >
            Sign in to SheSync
          </motion.span>
          <span className="text-3xl py-1">
            🌸
          </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-600 text-sm md:text-base"
          >
            Your comprehensive women's health & wellness platform
          </motion.p>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          onSubmit={submit}
          className="space-y-6"
        >
          {/* Email Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-pink-400" />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                placeholder="Enter your email"
                className="w-full pl-12 pr-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                placeholder="Enter your password"
                className="w-full pl-12 pr-12 py-3 bg-white/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {err && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm"
            >
              {err}
            </motion.div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold text-lg shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing In...
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In Securely
              </>
            )}
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">New to SheSync?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline transition-colors"
            >
              Create your account →
            </button>
          </div>
        </motion.form>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 pt-6 border-t border-gray-100 text-center"
        >
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
