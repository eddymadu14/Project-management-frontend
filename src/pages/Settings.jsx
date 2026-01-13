import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const [form, setForm] = useState({
    name: "Edward Maduneme",
    email: "edward@example.com",
    role: "Project Manager",
    password: "",
    twoFactor: false,
    theme: "light",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleToggle = (key) => {
    setForm({ ...form, [key]: !form[key] });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
  };

  return (
    <div className="flex h-screen bg-gray-50">
   
      <div className="flex-1 flex flex-col">
      

        <div className="p-6 space-y-8 overflow-y-auto">
          <h1 className="text-2xl font-semibold mb-2">Settings</h1>
          <p className="text-gray-500 mb-6">
            Manage your profile, security, and application preferences.
          </p>

          {/* Profile Settings */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600">Full Name</label>
                  <Input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email</label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Role</label>
                  <Input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Security</h2>
              <div>
                <label className="text-sm text-gray-600">Change Password</label>
                <Input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className="mt-1"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Two-Factor Authentication</span>
                <Switch
                  checked={form.twoFactor}
                  onCheckedChange={() => handleToggle("twoFactor")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2">Preferences</h2>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Dark Mode</span>
                <Switch
                  checked={form.theme === "dark"}
                  onCheckedChange={() =>
                    setForm({
                      ...form,
                      theme: form.theme === "dark" ? "light" : "dark",
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSave} className="px-6">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;