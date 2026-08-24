import React, { useEffect, useState } from "react";
import {
  Bell,
  Check,
  Eye,
  Lock,
  Moon,
  Save,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || user?.username || "",
    email: user?.email || "",
    role: user?.role || "Member",
    password: "",
    twoFactor: Boolean(user?.twoFactor),
    notifications: true,
    emailUpdates: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      name: user?.name || user?.username || "",
      email: user?.email || "",
      role: user?.role || "Member",
      twoFactor: Boolean(user?.twoFactor),
    }));
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggle = (key) => {
    setForm((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const saveSettings = async () => {
    try {
      setSaving(true);

      const nextUser = {
        ...(user || {}),
        name: form.name,
        email: form.email,
        role: form.role,
        twoFactor: form.twoFactor,
      };

      setUser(nextUser);

      localStorage.setItem(
        "pm_user",
        JSON.stringify(nextUser)
      );

      if (form.password) {
        // Password update requires a backend endpoint.
        // Do not pretend it succeeded without one.
        toast.success(
          "Profile settings saved. Password requires backend support."
        );
      } else {
        toast.success("Settings saved");
      }

      setForm((prev) => ({
        ...prev,
        password: "",
      }));
    } catch (error) {
      console.error(error);
      toast.error("Unable to save settings");
    } finally {
      setSaving(false);
    }
  };

  const SettingSwitch = ({ checked, onChange }) => (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`
        relative h-6 w-11 rounded-full transition
        ${
          checked
            ? "bg-orbit-cyan"
            : "bg-orbit-border"
        }
      `}
    >
      <span
        className={`
          absolute top-1 h-4 w-4 rounded-full
          bg-white shadow transition
          ${checked ? "left-6" : "left-1"}
        `}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit-cyan">
          Workspace
        </p>

        <h1 className="mt-1 text-2xl font-bold text-orbit-text sm:text-3xl">
          Settings
        </h1>

        <p className="mt-2 text-sm text-orbit-muted">
          Manage your account, security and application behaviour.
        </p>
      </section>

      <div className="space-y-5">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-orbit-border-soft bg-orbit-surface"
        >
          <div className="flex items-center gap-3 border-b border-orbit-border-soft p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orbit-cyan/10 text-orbit-cyan">
              <User size={18} />
            </div>

            <div>
              <h2 className="font-bold text-orbit-text">
                Profile Information
              </h2>

              <p className="mt-1 text-xs text-orbit-muted">
                Basic information associated with your account.
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-xs font-semibold text-orbit-muted">
                Full Name
              </span>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="
                  w-full rounded-xl border border-orbit-border-soft
                  bg-orbit-elevated px-3 py-3 text-sm
                  text-orbit-text outline-none
                  focus:border-orbit-cyan/40
                "
              />
            </label>

            <label>
              <span className="mb-2 block text-xs font-semibold text-orbit-muted">
                Email
              </span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="
                  w-full rounded-xl border border-orbit-border-soft
                  bg-orbit-elevated px-3 py-3 text-sm
                  text-orbit-text outline-none
                  focus:border-orbit-cyan/40
                "
              />
            </label>

            <label>
              <span className="mb-2 block text-xs font-semibold text-orbit-muted">
                Role
              </span>

              <input
                name="role"
                value={form.role}
                onChange={handleChange}
                className="
                  w-full rounded-xl border border-orbit-border-soft
                  bg-orbit-elevated px-3 py-3 text-sm
                  text-orbit-text outline-none
                  focus:border-orbit-cyan/40
                "
              />
            </label>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-orbit-border-soft bg-orbit-surface"
        >
          <div className="flex items-center gap-3 border-b border-orbit-border-soft p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orbit-violet/10 text-orbit-violet">
              <Shield size={18} />
            </div>

            <div>
              <h2 className="font-bold text-orbit-text">
                Security
              </h2>

              <p className="mt-1 text-xs text-orbit-muted">
                Protect your account and login access.
              </p>
            </div>
          </div>

          <div className="space-y-5 p-5">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-orbit-muted">
                New Password
              </span>

              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-orbit-muted"
                />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter a new password"
                  className="
                    w-full rounded-xl border
                    border-orbit-border-soft
                    bg-orbit-elevated py-3 pl-10 pr-3
                    text-sm text-orbit-text outline-none
                    placeholder:text-orbit-muted
                  "
                />
              </div>
            </label>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-orbit-border-soft bg-orbit-elevated/60 p-4">
              <div>
                <p className="text-sm font-semibold text-orbit-text">
                  Two-factor authentication
                </p>

                <p className="mt-1 text-xs text-orbit-muted">
                  Add an additional security layer to your account.
                </p>
              </div>

              <SettingSwitch
                checked={form.twoFactor}
                onChange={() => toggle("twoFactor")}
              />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-orbit-border-soft bg-orbit-surface"
        >
          <div className="flex items-center gap-3 border-b border-orbit-border-soft p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orbit-warning/10 text-orbit-warning">
              <Eye size={18} />
            </div>

            <div>
              <h2 className="font-bold text-orbit-text">
                Preferences
              </h2>

              <p className="mt-1 text-xs text-orbit-muted">
                Customize how Task Orbit behaves.
              </p>
            </div>
          </div>

          <div className="divide-y divide-orbit-border-soft">
            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                {theme === "dark" ? (
                  <Moon size={17} className="text-orbit-cyan" />
                ) : (
                  <Sun size={17} className="text-orbit-warning" />
                )}

                <div>
                  <p className="text-sm font-semibold text-orbit-text">
                    Dark mode
                  </p>

                  <p className="mt-1 text-xs text-orbit-muted">
                    Use the Task Orbit dark interface.
                  </p>
                </div>
              </div>

              <SettingSwitch
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div className="flex items-center gap-3">
                <Bell size={17} className="text-orbit-cyan" />

                <div>
                  <p className="text-sm font-semibold text-orbit-text">
                    In-app notifications
                  </p>

                  <p className="mt-1 text-xs text-orbit-muted">
                    Receive updates about your projects.
                  </p>
                </div>
              </div>

              <SettingSwitch
                checked={form.notifications}
                onChange={() => toggle("notifications")}
              />
            </div>

            <div className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm font-semibold text-orbit-text">
                  Email updates
                </p>

                <p className="mt-1 text-xs text-orbit-muted">
                  Receive important workspace updates by email.
                </p>
              </div>

              <SettingSwitch
                checked={form.emailUpdates}
                onChange={() => toggle("emailUpdates")}
              />
            </div>
          </div>
        </motion.section>

        <div className="flex justify-end">
          <button
            type="button"
            disabled={saving}
            onClick={saveSettings}
            className="
              flex items-center gap-2 rounded-xl
              bg-gradient-to-r from-orbit-cyan
              to-orbit-violet px-6 py-3
              text-sm font-bold text-orbit-bg
              shadow-lg shadow-orbit-cyan/10
              disabled:opacity-50
            "
          >
            {saving ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-orbit-bg/30 border-t-orbit-bg" />
            ) : (
              <Save size={16} />
            )}

            Save Settings
          </button>
        </div>

        <div className="rounded-xl border border-orbit-success/10 bg-orbit-success/5 p-4">
          <div className="flex items-start gap-3">
            <Check
              size={17}
              className="mt-0.5 shrink-0 text-orbit-success"
            />

            <p className="text-xs leading-5 text-orbit-muted">
              Theme changes are persisted by the existing
              ThemeContext. Account preference changes are persisted
              locally until corresponding backend update endpoints
              are available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;