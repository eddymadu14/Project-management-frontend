import React, { useEffect, useMemo, useState } from "react";
import {
  Check,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();

  const normalizedUser = useMemo(
    () => ({
      name: user?.name || user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      role: user?.role || "Member",
      avatar: user?.avatar || "",
    }),
    [user]
  );

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(normalizedUser);

  useEffect(() => {
    setFormData(normalizedUser);
  }, [normalizedUser]);

  const initials =
    formData.name
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "U";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(normalizedUser);
    setEditing(false);
  };

  const handleSave = () => {
    const nextUser = {
      ...(user || {}),
      ...formData,
    };

    setUser(nextUser);

    try {
      localStorage.setItem(
        "pm_user",
        JSON.stringify(nextUser)
      );
    } catch {
      // Ignore storage failures.
    }

    setEditing(false);
    toast.success("Profile updated");
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit-cyan">
          Account
        </p>

        <h1 className="mt-1 text-2xl font-bold text-orbit-text sm:text-3xl">
          Profile
        </h1>

        <p className="mt-2 text-sm text-orbit-muted">
          Manage your identity and workspace information.
        </p>
      </section>

      <div className="grid gap-5 xl:grid-cols-[320px_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-6"
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-orbit-cyan to-orbit-violet text-2xl font-black text-orbit-bg shadow-xl shadow-orbit-cyan/10">
              {formData.avatar ? (
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="h-full w-full rounded-3xl object-cover"
                />
              ) : (
                initials
              )}
            </div>

            <h2 className="mt-5 text-xl font-bold text-orbit-text">
              {formData.name || "Your Name"}
            </h2>

            <p className="mt-1 text-sm text-orbit-muted">
              {formData.role}
            </p>

            <div className="mt-5 flex items-center gap-2 rounded-full bg-orbit-success/10 px-3 py-1.5 text-xs font-semibold text-orbit-success">
              <span className="h-1.5 w-1.5 rounded-full bg-orbit-success" />
              Active account
            </div>
          </div>

          <div className="mt-7 space-y-3 border-t border-orbit-border-soft pt-5">
            <div className="flex items-center gap-3">
              <Mail size={15} className="text-orbit-cyan" />
              <span className="truncate text-xs text-orbit-muted">
                {formData.email || "No email provided"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={15} className="text-orbit-cyan" />
              <span className="text-xs text-orbit-muted">
                {formData.phone || "No phone provided"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={15} className="text-orbit-cyan" />
              <span className="text-xs text-orbit-muted">
                {formData.address || "No address provided"}
              </span>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-orbit-border-soft bg-orbit-surface"
        >
          <div className="flex items-center justify-between border-b border-orbit-border-soft p-5">
            <div>
              <h2 className="font-bold text-orbit-text">
                Personal Information
              </h2>

              <p className="mt-1 text-xs text-orbit-muted">
                Keep your account information current.
              </p>
            </div>

            {!editing && (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="
                  flex items-center gap-2 rounded-xl
                  border border-orbit-border-soft
                  px-3 py-2 text-xs font-bold
                  text-orbit-muted transition
                  hover:bg-orbit-elevated
                  hover:text-orbit-cyan
                "
              >
                <Edit3 size={14} />
                Edit
              </button>
            )}
          </div>

          <div className="grid gap-5 p-5 md:grid-cols-2">
            {[
              {
                name: "name",
                label: "Full Name",
                type: "text",
                icon: User,
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                icon: Mail,
              },
              {
                name: "phone",
                label: "Phone",
                type: "text",
                icon: Phone,
              },
              {
                name: "address",
                label: "Location",
                type: "text",
                icon: MapPin,
              },
            ].map((field) => {
              const Icon = field.icon;

              return (
                <label key={field.name}>
                  <span className="mb-2 block text-xs font-semibold text-orbit-muted">
                    {field.label}
                  </span>

                  <div className="relative">
                    <Icon
                      size={15}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-orbit-muted"
                    />

                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      disabled={!editing}
                      className="
                        w-full rounded-xl border
                        border-orbit-border-soft
                        bg-orbit-elevated
                        py-3 pl-10 pr-3 text-sm
                        text-orbit-text outline-none
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                        focus:border-orbit-cyan/40
                      "
                    />
                  </div>
                </label>
              );
            })}
          </div>

          {editing && (
            <div className="flex justify-end gap-2 border-t border-orbit-border-soft p-5">
              <button
                type="button"
                onClick={handleCancel}
                className="
                  flex items-center gap-2 rounded-xl
                  border border-orbit-border-soft
                  px-4 py-2.5 text-sm font-semibold
                  text-orbit-muted hover:bg-orbit-elevated
                "
              >
                <X size={15} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="
                  flex items-center gap-2 rounded-xl
                  bg-gradient-to-r from-orbit-cyan
                  to-orbit-violet
                  px-5 py-2.5 text-sm font-bold
                  text-orbit-bg
                "
              >
                <Save size={15} />
                Save Changes
              </button>
            </div>
          )}

          {!editing && (
            <div className="flex items-center gap-2 border-t border-orbit-border-soft p-5 text-xs text-orbit-muted">
              <Check size={14} className="text-orbit-success" />
              Profile information is currently saved locally.
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
};

export default Profile;