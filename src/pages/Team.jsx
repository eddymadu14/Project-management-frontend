import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  Mail,
  MoreHorizontal,
  Search,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

const Team = () => {
  const { token } = useAuth();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTeams = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/teams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTeams(Array.isArray(data) ? data : data ? [data] : []);
    } catch (error) {
      console.error(error);
      toast.error("Unable to load team data");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  const members = useMemo(() => {
    const flattened = [];

    teams.forEach((team) => {
      (team.members || []).forEach((member) => {
        flattened.push({
          ...member,
          teamName: team.name,
          teamId: team._id,
        });
      });
    });

    const unique = new Map();

    flattened.forEach((member) => {
      const key = member._id || member.name;

      if (!unique.has(key)) {
        unique.set(key, member);
      }
    });

    return [...unique.values()];
  }, [teams]);

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return members;

    return members.filter((member) =>
      [
        member.name,
        member.role,
        member.teamName,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(query)
        )
    );
  }, [members, search]);

  const admins = members.filter(
    (member) => member.role === "Admin"
  ).length;

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orbit-cyan">
            People
          </p>

          <h1 className="mt-1 text-2xl font-bold text-orbit-text sm:text-3xl">
            Team
          </h1>

          <p className="mt-2 text-sm text-orbit-muted">
            See everyone working across your workspace.
          </p>
        </div>

        <a
          href="/teammanagement"
          className="
            flex items-center justify-center gap-2
            rounded-xl bg-gradient-to-r
            from-orbit-cyan to-orbit-violet
            px-5 py-3 text-sm font-bold text-orbit-bg
          "
        >
          <UserPlus size={17} />
          Manage Team
        </a>
      </section>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-orbit-muted">
              People
            </p>
            <Users size={16} className="text-orbit-cyan" />
          </div>

          <p className="mt-2 text-2xl font-bold text-orbit-text">
            {members.length}
          </p>
        </div>

        <div className="rounded-2xl border border-orbit-border-soft bg-orbit-surface p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-orbit-muted">
              Teams
            </p>
            <Activity size={16} className="text-orbit-violet" />
          </div>

          <p className="mt-2 text-2xl font-bold text-orbit-text">
            {teams.length}
          </p>
        </div>

        <div className="col-span-2 rounded-2xl border border-orbit-border-soft bg-orbit-surface p-4 lg:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-orbit-muted">
              Admins
            </p>
            <Shield size={16} className="text-orbit-warning" />
          </div>

          <p className="mt-2 text-2xl font-bold text-orbit-text">
            {admins}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-orbit-border-soft bg-orbit-surface p-3">
        <Search size={17} className="text-orbit-muted" />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search people, roles or teams..."
          className="
            flex-1 bg-transparent text-sm
            text-orbit-text outline-none
            placeholder:text-orbit-muted
          "
        />
      </div>

      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-orbit-border-soft bg-orbit-surface">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-orbit-border border-t-orbit-cyan" />
        </div>
      ) : !filteredMembers.length ? (
        <div className="rounded-2xl border border-dashed border-orbit-border-soft bg-orbit-surface p-12 text-center">
          <Users
            size={34}
            className="mx-auto mb-4 text-orbit-muted"
          />

          <h2 className="font-bold text-orbit-text">
            No members found
          </h2>

          <p className="mt-2 text-sm text-orbit-muted">
            Your team members will appear here once teams are populated.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredMembers.map((member, index) => (
            <motion.article
              key={member._id || `${member.name}-${index}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="
                rounded-2xl border border-orbit-border-soft
                bg-orbit-surface p-5 transition
                hover:border-orbit-cyan/20
              "
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orbit-cyan/20 to-orbit-violet/20 text-sm font-bold text-orbit-cyan">
                  {(member.name || "U")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <button
                  type="button"
                  className="rounded-lg p-2 text-orbit-muted hover:bg-orbit-elevated hover:text-orbit-text"
                >
                  <MoreHorizontal size={17} />
                </button>
              </div>

              <div className="mt-5">
                <h2 className="font-bold text-orbit-text">
                  {member.name}
                </h2>

                <p className="mt-1 text-sm text-orbit-muted">
                  {member.role || "Member"}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-orbit-border-soft pt-4">
                <span className="rounded-full bg-orbit-cyan/10 px-2.5 py-1 text-[10px] font-bold text-orbit-cyan">
                  {member.teamName || "Workspace"}
                </span>

                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="rounded-lg p-2 text-orbit-muted hover:bg-orbit-elevated hover:text-orbit-cyan"
                  >
                    <Mail size={15} />
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Team;