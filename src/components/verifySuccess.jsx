import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const VerifyEmailSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 8 }}
          className="flex justify-center mb-6"
        >
          <CheckCircle2 className="w-20 h-20 text-green-400 animate-pulse" />
        </motion.div>

        <h1 className="text-2xl font-semibold mb-3">Email Verified Successfully!</h1>
        <p className="text-gray-300 mb-6">
          Your email has been verified. You’ll be redirected to the login page shortly.
        </p>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
          <div className="w-4 h-4 border-2 border-green-400 rounded-full animate-spin border-t-transparent"></div>
          <span>Redirecting in 5 seconds...</span>
        </div>
      </motion.div>

      <footer className="mt-10 text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Task Orbit. All rights reserved.
      </footer>
    </div>
  );
};

export default VerifyEmailSuccess;