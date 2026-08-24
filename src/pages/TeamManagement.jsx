import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Loader2,
  Mail,
  Plus,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const TeamManagement = () => {
  const { token } = useAuth();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isCreatingTeam, setIsCreatingTeam] = useState(true);
  const [activeTeamId, setActiveTeamId] = useState(null);

  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([]);
  const [newMember, setNewMember] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("Member");
  const [saving, setSaving] = useState(false);

  const authConfig = useMemo(
    () => ({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/teams", authConfig);

      setTeams(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to load teams"
      );
    } finally {
      setLoading(false);
    }
  }, [authConfig]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const filteredTeams = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return teams;

    return teams.filter((team) => {
      const nameMatch = team.name?.toLowerCase().includes(query);

      const memberMatch = team.members?.some((member) =>
        member.name?.toLowerCase().includes(query)
      );

      return nameMatch || memberMatch;
    });
  }, [teams, search]);

  const totals = useMemo(() => {
    const membersCount = teams.reduce(
      (sum, team) => sum + (team.members?.length || 0),
      0
    );

    return {
      teams: teams.length,
      members: membersCount,
    };
  }, [teams]);

  const resetModal = () => {
    setShowModal(false);
    setIsCreatingTeam(true);
    setActiveTeamId(null);
    setTeamName("");
    setMembers([]);
    setNewMember("");
    setNewMemberRole("Member");
    setSaving(false);
  };

  const openCreateModal = () => {
    setIsCreatingTeam(true);
    setActiveTeamId(null);
    setTeamName("");
    setMembers([]);
    setNewMember("");
    setNewMemberRole("Member");
    setShowModal(true);
  };

  const openAddMemberModal = (teamId) => {
    setIsCreatingTeam(false);
    setActiveTeamId(teamId);
    setNewMember("");
    setNewMemberRole("Member");
    setShowModal(true);
  };

  const addMemberToList = () => {
    const name = newMember.trim();

    if (!name) {
      toast.error("Enter a member name");
      return;
    }

    if (
      members.some(
        (member) =>
          member.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      toast.error("Member already added");
      return;
    }

    setMembers((prev) => [
      ...prev,
      {
        name,
        role: newMemberRole,
      },
    ]);

    setNewMember("");
  };

  const removeMemberFromList = (name) => {
    setMembers((prev) =>
      prev.filter((member) => member.name !== name)
    );
  };

  const createTeam = async () => {
    if (!teamName.trim()) {
      toast.error("Enter a team name");
      return;
    }

    if (!members.length) {
      toast.error("Add at least one member");
      return;
    }

    try {
      setSaving(true);

      const { data } = await api.post(
        "/teams",
        {
          name: teamName.trim(),
          members,
        },
        authConfig
      );

      setTeams((prev) => [...prev, data]);

      toast.success("Team created successfully");
      resetModal();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create team"
      );
    } finally {
      setSaving(false);
    }
  };

  const addMemberToExistingTeam = async () => {
    if (!newMember.trim()) {
      toast.error("Enter a member name");
      return;
    }

    try {
      setSaving(true);

      const { data } = await api.put(
        `/teams/${activeTeamId}/add`,
        {
          name: newMember.trim(),
          role: newMemberRole,
          email: "",
        },
        authConfig
      );

      setTeams((prev) =>
        prev.map((team) =>
          team._id === activeTeamId ? data : team
        )
      );

      toast.success("Member added");
      resetModal();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to add member"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteTeam = async (teamId) => {
    if (
      !window.confirm(
        "Delete this team? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/teams/${teamId}`, authConfig);

      setTeams((prev) =>
        prev.filter((team) => team._id !== teamId)
      );

      toast.success("Team deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete team");
    }
  };

  const removeMemberFromTeam = async (teamId, memberId) => {
    if (!window.confirm("Remove this member from the team?")) {
      return;
    }

    try {
      const { data } = await api.put(
        `/teams/${teamId}/members/${memberId}`,
        {
          remove: [memberId],
        },
        authConfig
      );

      setTeams((prev) =>
        prev.map((team) =>
          team._id === teamId ? data : team
        )
      );

      toast.success("Member removed");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to remove member"
      );
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit-cyan">
            Workspace
          </p>

          <h1 className="mt-1 text-2xl font-bold text-orbit-text sm:text-3xl">
            Team Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-orbit-muted">
            Create teams, assign people and keep ownership clear.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="
            flex items-center justify-center gap-2 rounded-xl
            bg-gradient-to-r from-orbit-cyan to-orbit-violet
            px-5 py-3 text-sm font-bold text-orbit-bg
            shadow-lg shadow-orbit-cyan/10
          "
        >
          <Plus size={17} />
          Create Team
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-4">
          <p className="text-xs font-semibold text-orbit-muted">
            Teams
          </p>
          <p className="mt-2 text-2xl font-bold text-orbit-text">
            {totals.teams}
          </p>
        </div>

        <div className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-4">
          <p className="text-xs font-semibold text-orbit-muted">
            Members
          </p>
          <p className="mt-2 text-2xl font-bold text-orbit-text">
            {totals.members}
          </p>
        </div>
      </section>

      <div className="flex items-center gap-3 rounded-2xl border border-orbit-border-soft bg-orbit-surface p-3">
        <Search size={18} className="text-orbit-muted" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search teams or members..."
          className="
            min-w-0 flex-1 bg-transparent text-sm
            text-orbit-text outline-none
            placeholder:text-orbit-muted
          "
        />
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-orbit-border-soft bg-orbit-surface">
          <Loader2
            className="animate-spin text-orbit-cyan"
            size={28}
          />
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-orbit-border-soft bg-orbit-surface p-12 text-center">
          <Users
            size={34}
            className="mx-auto mb-4 text-orbit-muted"
          />

          <h2 className="font-bold text-orbit-text">
            {search ? "No teams found" : "No teams yet"}
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-orbit-muted">
            {search
              ? "Try another search term."
              : "Create your first team and start organizing ownership."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={openCreateModal}
              className="mt-5 rounded-xl bg-orbit-cyan px-4 py-2.5 text-sm font-bold text-orbit-bg"
            >
              Create your first team
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredTeams.map((team) => (
            <motion.article
              key={team._id}
              layout
              className="
                overflow-hidden rounded-2xl
                border border-orbit-border-soft
                bg-orbit-surface
              "
            >
              <div className="flex items-start justify-between border-b border-orbit-border-soft p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orbit-cyan/10 text-orbit-cyan">
                    <Users size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-orbit-text">
                      {team.name}
                    </h2>

                    <p className="mt-1 text-xs text-orbit-muted">
                      {team.members?.length || 0} members
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => deleteTeam(team._id)}
                  className="
                    rounded-xl p-2 text-orbit-muted transition
                    hover:bg-orbit-danger/10
                    hover:text-orbit-danger
                  "
                  title="Delete team"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="p-5">
                <div className="space-y-2">
                  {(team.members || []).map((member) => (
                    <div
                      key={member._id}
                      className="
                        flex items-center justify-between gap-3
                        rounded-xl border border-orbit-border-soft
                        bg-orbit-elevated/60 px-3 py-3
                      "
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orbit-bg text-xs font-bold text-orbit-cyan">
                          {(member.name || "U")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-orbit-text">
                            {member.name}
                          </p>

                          <div className="mt-0.5 flex items-center gap-1.5">
                            {member.role === "Admin" ? (
                              <Shield
                                size={11}
                                className="text-orbit-violet"
                              />
                            ) : (
                              <Users
                                size={11}
                                className="text-orbit-muted"
                              />
                            )}

                            <span className="text-[11px] text-orbit-muted">
                              {member.role}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeMemberFromTeam(
                            team._id,
                            member._id
                          )
                        }
                        className="rounded-lg p-2 text-orbit-muted transition hover:bg-orbit-danger/10 hover:text-orbit-danger"
                        title="Remove member"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => openAddMemberModal(team._id)}
                  className="
                    mt-4 flex w-full items-center
                    justify-center gap-2 rounded-xl
                    border border-dashed border-orbit-border-soft
                    px-4 py-3 text-xs font-bold
                    text-orbit-muted transition
                    hover:border-orbit-cyan/30
                    hover:bg-orbit-cyan/5
                    hover:text-orbit-cyan
                  "
                >
                  <UserPlus size={15} />
                  Add Member
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg rounded-2xl border border-orbit-border-soft bg-orbit-surface shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-orbit-border-soft p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orbit-cyan">
                    Teams
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-orbit-text">
                    {isCreatingTeam
                      ? "Create a new team"
                      : "Add team member"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={resetModal}
                  className="rounded-xl p-2 text-orbit-muted hover:bg-orbit-elevated hover:text-orbit-text"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 p-5">
                {isCreatingTeam && (
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-orbit-muted">
                      Team name
                    </label>

                    <input
                      value={teamName}
                      onChange={(event) =>
                        setTeamName(event.target.value)
                      }
                      placeholder="e.g. Product Engineering"
                      className="
                        w-full rounded-xl border
                        border-orbit-border-soft
                        bg-orbit-elevated px-3 py-3
                        text-sm text-orbit-text outline-none
                        placeholder:text-orbit-muted
                        focus:border-orbit-cyan/40
                      "
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-orbit-muted">
                    Member name
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={newMember}
                      onChange={(event) =>
                        setNewMember(event.target.value)
                      }
                      placeholder="Full name"
                      onKeyDown={(event) => {
                        if (
                          event.key === "Enter" &&
                          isCreatingTeam
                        ) {
                          event.preventDefault();
                          addMemberToList();
                        }
                      }}
                      className="
                        min-w-0 flex-1 rounded-xl border
                        border-orbit-border-soft
                        bg-orbit-elevated px-3 py-3
                        text-sm text-orbit-text outline-none
                        placeholder:text-orbit-muted
                      "
                    />

                    <select
                      value={newMemberRole}
                      onChange={(event) =>
                        setNewMemberRole(event.target.value)
                      }
                      className="
                        rounded-xl border border-orbit-border-soft
                        bg-orbit-elevated px-3 py-3
                        text-sm text-orbit-text outline-none
                      "
                    >
                      <option value="Member">Member</option>
                      <option value="Admin">Admin</option>
                    </select>

                    {isCreatingTeam && (
                      <button
                        type="button"
                        onClick={addMemberToList}
                        className="rounded-xl bg-orbit-cyan px-4 py-3 text-sm font-bold text-orbit-bg"
                      >
                        Add
                      </button>
                    )}
                  </div>
                </div>

                {isCreatingTeam && members.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-orbit-muted">
                      Team members
                    </p>

                    {members.map((member) => (
                      <div
                        key={member.name}
                        className="flex items-center justify-between rounded-xl bg-orbit-elevated px-3 py-2.5"
                      >
                        <div>
                          <p className="text-sm font-semibold text-orbit-text">
                            {member.name}
                          </p>
                          <p className="text-[11px] text-orbit-muted">
                            {member.role}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeMemberFromList(member.name)
                          }
                          className="text-orbit-muted hover:text-orbit-danger"
                        >
                          <X size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-end gap-2 border-t border-orbit-border-soft pt-4">
                  <button
                    type="button"
                    onClick={resetModal}
                    className="
                      rounded-xl border border-orbit-border-soft
                      px-4 py-2.5 text-sm font-semibold
                      text-orbit-muted hover:bg-orbit-elevated
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={
                      isCreatingTeam
                        ? createTeam
                        : addMemberToExistingTeam
                    }
                    className="
                      flex items-center gap-2 rounded-xl
                      bg-gradient-to-r
                      from-orbit-cyan to-orbit-violet
                      px-5 py-2.5 text-sm font-bold text-orbit-bg
                      disabled:opacity-50
                    "
                  >
                    {saving && (
                      <Loader2
                        size={15}
                        className="animate-spin"
                      />
                    )}

                    {isCreatingTeam
                      ? "Create Team"
                      : "Add Member"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManagement;