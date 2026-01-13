
import { useState } from "react";
import { login, register } from "../services/auth";
import React from "react";
import { Link } from "react-router-dom";

export default function AuthForm({
  title,
  buttonText,
  footerText,
  footerLink,
  footerLabel,
  onSubmit,
  children,
}) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={onSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">{title}</h2>

        {children}

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          {buttonText}
        </button>

        <p className="text-center text-sm text-gray-500">
          {footerText}{" "}
          <Link to={footerLink} className="text-indigo-600 hover:underline">
            {footerLabel}
          </Link>
        </p>
      </form>
    </div>
  );
}
