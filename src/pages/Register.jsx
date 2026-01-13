import React, { useState } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRegisterUser } from "../hooks/mutations";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const { mutate: registerUser, isLoading } = useRegisterUser();

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) registerUser(form);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 text-white overflow-hidden relative">
      <Toaster position="top-right" />

      {/* 🔮 Subtle glassy circles background */}
      <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl top-[-10%] left-[-10%]" />
      <div className="absolute w-80 h-80 bg-blue-500/20 rounded-full blur-3xl bottom-[-10%] right-[-10%]" />

      {/* 🧊 Glassmorphic container */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl rounded-2xl p-8 w-full max-w-md text-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-semibold mb-6"
        >
          Create Account ✨
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Name */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400 transition-all"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400 transition-all"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm text-gray-300">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:border-purple-400 focus:ring-2 focus:ring-purple-500 outline-none text-white placeholder-gray-400 transition-all"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-sm text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register</span>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-purple-400 hover:underline font-medium">
            Log in
          </a>
        </p>
      </motion.div>
    </div>
  );
}