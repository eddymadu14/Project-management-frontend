import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants, pageTransition } from "../motion/pageVariants";
import AuthForm from "../components/AuthForm";
import api from "../services/api";

export default function RegisterAdmin() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("admin/adminreg", form);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <AuthForm
        title="Create Your Account 🌟"
        buttonText="Sign Up"
        footerText="Already have an account?"
        footerLink="/login"
        footerLabel="Log in"
        onSubmit={handleSubmit}
      >
        <motion.input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full Name"
          autoComplete="name"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          autoComplete="email"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          autoComplete="new-password"
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          whileFocus={{ scale: 1.02 }}
        />
      </AuthForm>
    </motion.div>
  );
}