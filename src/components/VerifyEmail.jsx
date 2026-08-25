
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MailCheck,
  LoaderCircle,
  AlertCircle,
} from "lucide-react";
import api from "../utils/api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      navigate("/verify-failed", { replace: true });
      return;
    }

    const verify = async () => {
      try {
        await api.get(
          `users/verify/${encodeURIComponent(token)}`
        );

        setStatus("success");

        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);

      } catch (error) {
        console.error(
          "Verification failed:",
          error
        );

        setStatus("error");
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-5">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute right-[-10%] top-[-10%] h-[550px] w-[550px] rounded-full bg-cyan-400/[0.07] blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[-10%] h-[600px] w-[600px] rounded-full bg-violet-500/[0.07] blur-[150px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/[0.08] bg-[#0b1728]/90 p-8 text-center shadow-2xl backdrop-blur-xl"
      >

        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07]">
          {status === "loading" && (
            <LoaderCircle className="h-6 w-6 animate-spin text-cyan-300" />
          )}

          {status === "success" && (
            <MailCheck className="h-6 w-6 text-cyan-300" />
          )}

          {status === "error" && (
            <AlertCircle className="h-6 w-6 text-red-400" />
          )}
        </div>

        {status === "loading" && (
          <>
            <h1 className="text-2xl font-bold">
              Verifying your email
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              We're confirming your Task Orbit account.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold">
              Email verified
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Your Task Orbit account is now verified.
              Redirecting you to login...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold">
              Verification failed
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              This verification link is invalid or has
              expired.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="mt-6 h-11 rounded-xl bg-cyan-300 px-5 text-sm font-bold text-[#07111f] transition hover:bg-cyan-200"
            >
              Back to login
            </button>
          </>
        )}

      </motion.div>
    </div>
  );
}
