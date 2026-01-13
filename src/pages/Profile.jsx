import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState({
    name: "Edward Maduneme",
    email: "edwardmaduneme@example.com",
    phone: "+234 812 345 6789",
    address: "Lagos, Nigeria",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Edward",
  });

  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setUser(formData);
    setEditing(false);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Profile</h1>

      <Card className="max-w-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.phone}</p>
            </div>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-medium">Personal Information</h3>

            <div className="grid gap-4">
              <Input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                disabled={!editing}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                disabled={!editing}
              />
              <Input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                disabled={!editing}
              />
              <Input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              {!editing ? (
                <Button onClick={() => setEditing(true)}>Edit Profile</Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;