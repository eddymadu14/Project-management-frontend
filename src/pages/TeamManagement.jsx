import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import toast, { Toaster } from "react-hot-toast";
import GlassModal from "../components/ui/GlassModal";

function TeamManagement() {
  const { user, token } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false); // true: create team, false: add member
  const [activeTeamId, setActiveTeamId] = useState(null);

  // Form states
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([]); // local members list (for team creation)
  const [newMember, setNewMember] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Member");

  // Fetch teams
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/teams", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  // ------------------ MODAL HANDLERS ------------------

  const resetModal = () => {
    setShowModal(false);
    setIsCreatingTeam(false);
    setActiveTeamId(null);
    setTeamName("");
    setMembers([]);
    setNewMember("");
    setNewMemberRole("Member");
  };

  const addMemberToList = () => {
    const trimmed = newMember.trim();
    if (!trimmed) return toast.error("Enter member name");
    if (members.some((m) => m.name === trimmed))
      return toast.error("Member already added");
    setMembers([...members, { name: trimmed, role: newMemberRole }]);
    setNewMember("");
    setNewMemberRole("Member");
  };

  const removeMemberFromList = (name) => {
    setMembers(members.filter((m) => m.name !== name));
  };

  // ------------------ TEAM ACTIONS ------------------

  const createTeam = async () => {
    if (!teamName.trim()) return toast.error("Enter team name");
    if (!members.length) return toast.error("Add at least one member");

    try {
      const payload = { name: teamName.trim(), members };
      const { data } = await api.post("/teams", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams([...teams, data]);
      toast.success("Team created!");
      resetModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to create team");
    }
  };

  const addMemberToExistingTeam = async () => {
    if (!newMember.trim()) return toast.error("Enter member name");
    try {
      const { data } = await api.put(
        `/teams/${activeTeamId}/add`,
        { name: newMember.trim(), role: newMemberRole, email: "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams((prev) =>
        prev.map((t) => (t._id === activeTeamId ? data : t))
      );
      toast.success("Member added");
      resetModal();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add member");
    }
  };

  const deleteTeam = async (teamId) => {
    if (!window.confirm("Delete this team?")) return;
    try {
      await api.delete(`/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeams(teams.filter((t) => t._id !== teamId));
      toast.success("Team deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete team");
    }
  };

  const removeMemberFromTeam = async (teamId, memberId) => {
    try {
      const { data } = await api.put(
        `/teams/${teamId}/members/${memberId}`,
        { remove: [memberId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTeams((prev) =>
        prev.map((t) => (t._id === teamId ? data : t))
      );
      toast.success("Member removed");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to remove member");
    }
  };

  // ------------------ RENDER ------------------

  return (
    <div className="p-6">
      <Toaster position="top-right" />

      <h2 className="text-2xl font-semibold mb-6">Team Management</h2>

      {/* Button to open "Create Team" modal */}
      <button
        onClick={() => {
          setIsCreatingTeam(true);
          setShowModal(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-6"
      >
        Create New Team
      </button>

      {/* Existing Teams */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Existing Teams</h3>
        {loading ? (
          <p>Loading teams...</p>
        ) : teams.length === 0 ? (
          <p className="text-gray-500 italic">No teams yet.</p>
        ) : (
          <ul className="space-y-4">
            {teams.map((team) => (
              <li
                key={team._id}
                className="bg-white shadow p-3 rounded-lg flex flex-col gap-2"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{team.name}</p>
                    <p className="text-xs text-gray-400">Created by</p>
                  </div>
                  <button
                    onClick={() => deleteTeam(team._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>

                {/* Members */}
                <div className="mt-2">
                  <p className="text-sm font-medium mb-1">Members:</p>
                  <ul className="space-y-1">
                    {team.members?.map((m) => (
                      <li
                        key={m._id}
                        className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
                      >
                        <span>
                          {m.name} ({m.role})
                        </span>
                        <button
                          onClick={() =>
                            removeMemberFromTeam(team._id, m._id)
                          }
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => {
                      setIsCreatingTeam(false);
                      setActiveTeamId(team._id);
                      setShowModal(true);
                    }}
                    className="bg-indigo-600 text-white px-3 py-1 rounded mt-2"
                  >
                    Add Member
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ------------------- GLASS MODAL ------------------- */}
      <GlassModal
        isOpen={showModal}
        onClose={resetModal}
        title={
          isCreatingTeam ? "Create New Team" : "Add Member to Existing Team"
        }
      >
        {isCreatingTeam ? (
          <>
            {/* Team Name */}
            <input
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />

            {/* Add Member Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Member Name"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-400 transition"
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
              </select>
              <button
                type="button"
                onClick={addMemberToList}
                className="bg-indigo-600 text-white px-3 py-2 rounded"
              >
                Add
              </button>
            </div>

            {/* Members Preview */}
            {members.length > 0 && (
              <ul className="mb-3 max-h-40 overflow-y-auto space-y-2">
                {members.map((m, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg"
                  >
                    <span>
                      {m.name} ({m.role})
                    </span>
                    <button
                      onClick={() => removeMemberFromList(m.name)}
                      className="text-red-400 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {/* Modal Actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={resetModal}
                className="px-4 py-2 rounded-lg bg-white/12 text-white hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={createTeam}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold hover:opacity-95 shadow-lg shadow-indigo-500/30 transition"
              >
                Create Team
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Add member to existing team */}
            <input
              type="text"
              placeholder="Member Name"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-400 transition"
            />
            <select
              value={newMemberRole}
              onChange={(e) => setNewMemberRole(e.target.value)}
              className="w-full mb-3 px-3 py-2 rounded-lg bg-white/10 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-indigo-400 transition"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={resetModal}
                className="px-4 py-2 rounded-lg bg-white/12 text-white hover:bg-white/20 transition"
              >
                Cancel
              </button>
              <button
                onClick={addMemberToExistingTeam}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold hover:opacity-95 shadow-lg shadow-indigo-500/30 transition"
              >
                Add Member
              </button>
            </div>
          </>
        )}
      </GlassModal>
    </div>
  );
}

export default TeamManagement;