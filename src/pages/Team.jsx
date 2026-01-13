import React, { useState } from "react";
import { Plus, Edit2, Trash2, Circle } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialMembers = [
  {
    id: 1,
    name: "Edward Maduneme",
    role: "Project Manager",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Edward",
    status: "online",
  },
  {
    id: 2,
    name: "Loli Claret",
    role: "UI/UX Designer",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Loli",
    status: "offline",
  },
  {
    id: 3,
    name: "Chris Udo",
    role: "Backend Developer",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Chris",
    status: "online",
  },
  {
    id: 4,
    name: "Ada Okoye",
    role: "Frontend Developer",
    avatar: "https://api.dicebear.com/8.x/avataaars/svg?seed=Ada",
    status: "away",
  },
];

const Team = () => {
  const [members, setMembers] = useState(initialMembers);

  const handleRemove = (id) => {
    setMembers(members.filter((m) => m.id !== id));
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Team Members</h1>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Member
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <Card
                key={member.id}
                className="rounded-2xl shadow-sm hover:shadow-md transition"
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 border">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback>
                        {member.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="font-semibold">{member.name}</h2>
                      <p className="text-sm text-gray-500">{member.role}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Circle
                          className={`w-2 h-2 ${
                            member.status === "online"
                              ? "text-green-500"
                              : member.status === "away"
                              ? "text-yellow-500"
                              : "text-gray-400"
                          }`}
                          fill="currentColor"
                        />
                        <span className="text-xs text-gray-500 capitalize">
                          {member.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 text-gray-500">
                    <Edit2 className="w-4 h-4 cursor-pointer hover:text-blue-500" />
                    <Trash2
                      className="w-4 h-4 cursor-pointer hover:text-red-500"
                      onClick={() => handleRemove(member.id)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;