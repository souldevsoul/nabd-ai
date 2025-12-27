"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  SlMagnifier,
  SlPeople,
  SlCamera,
  SlBag,
  SlShield,
  SlOptionsVertical,
  SlCheck,
  SlClose,
  SlPaperPlane,
} from "react-icons/sl";

interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  roles: string[];
  createdAt: string;
  telegramUserId: string | null;
  telegramUsername: string | null;
  _count: {
    photos: number;
    licenseRequests: number;
  };
  photographerProfile: {
    displayName: string;
    handle: string;
    isVerified: boolean;
  } | null;
}

const roleFilters = [
  { value: "all", label: "All Users", icon: SlPeople },
  { value: "PHOTOGRAPHER", label: "Photographers", icon: SlCamera },
  { value: "BUYER", label: "Buyers", icon: SlBag },
  { value: "ADMIN", label: "Admins", icon: SlShield },
];

const allRoles = ["PHOTOGRAPHER", "BUYER", "ADMIN"];

interface UserCardProps {
  user: User;
  onRolesUpdated: () => void;
}

function UserCard({ user, onRolesUpdated }: UserCardProps) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(user.roles);
  const [isUpdating, setIsUpdating] = useState(false);

  const roleColors = {
    ADMIN: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    PHOTOGRAPHER: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    BUYER: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };

  const handleViewProfile = () => {
    setShowMenu(false);
    if (user.photographerProfile) {
      router.push(`/photographer/${user.photographerProfile.handle}`);
    } else {
      toast.info("User does not have a public profile");
    }
  };

  const handleSendMessage = () => {
    setShowMenu(false);
    // Copy email to clipboard for now - could integrate with messaging system
    navigator.clipboard.writeText(user.email);
    toast.success(`Email copied: ${user.email}`);
  };

  const handleEditRoles = () => {
    setShowMenu(false);
    setSelectedRoles(user.roles);
    setShowRolesModal(true);
  };

  const handleSaveRoles = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/roles`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roles: selectedRoles }),
      });
      if (!res.ok) throw new Error("Failed to update roles");
      toast.success("Roles updated successfully");
      setShowRolesModal(false);
      onRolesUpdated();
    } catch {
      toast.error("Failed to update roles");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSuspendUser = async () => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}/suspend`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to suspend user");
      toast.success("User suspended successfully");
      setShowSuspendModal(false);
      onRolesUpdated();
    } catch {
      toast.error("Failed to suspend user");
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all"
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center overflow-hidden">
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || ""}
                  width={56}
                  height={56}
                  className="object-cover"
                />
              ) : (
                <span className="text-xl font-bold text-white">
                  {(user.name || user.email)[0].toUpperCase()}
                </span>
              )}
            </div>
            {user.photographerProfile?.isVerified && (
              <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500">
                <SlCheck className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold truncate">
                {user.name || "Unnamed User"}
              </h3>
              {user.telegramUsername && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs">
                  <SlPaperPlane className="w-3 h-3" />
                  @{user.telegramUsername}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 truncate">{user.email}</p>
            {user.photographerProfile && (
              <p className="text-sm text-slate-400 mt-1">
                @{user.photographerProfile.handle}
              </p>
            )}

            {/* Roles */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className={`px-2 py-0.5 rounded-full border text-xs font-medium ${
                    roleColors[role as keyof typeof roleColors] || "bg-slate-800 text-slate-400"
                  }`}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <SlOptionsVertical className="w-4 h-4" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-48 py-2 rounded-xl bg-slate-800 border border-slate-700 shadow-xl z-20">
                  <button
                    onClick={handleViewProfile}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    Copy Email
                  </button>
                  <button
                    onClick={handleEditRoles}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-slate-700 transition-colors"
                  >
                    Edit Roles
                  </button>
                  <div className="my-1 border-t border-slate-700" />
                  <button
                    onClick={() => { setShowMenu(false); setShowSuspendModal(true); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 transition-colors"
                  >
                    Suspend User
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-800">
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user._count.photos}</p>
            <p className="text-xs text-slate-500">Photos</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">{user._count.licenseRequests}</p>
            <p className="text-xs text-slate-500">Requests</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-white">
              {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "2-digit" })}
            </p>
            <p className="text-xs text-slate-500">Joined</p>
          </div>
        </div>
      </motion.div>

      {/* Edit Roles Modal */}
      <AnimatePresence>
        {showRolesModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowRolesModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Edit Roles</h3>
              <p className="text-sm text-slate-400 mb-6">
                Update roles for {user.name || user.email}
              </p>
              <div className="space-y-3 mb-6">
                {allRoles.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700 cursor-pointer hover:border-slate-600 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedRoles.includes(role)}
                      onChange={() => toggleRole(role)}
                      className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-amber-500 focus:ring-amber-500"
                    />
                    <span className={`px-2 py-0.5 rounded-full border text-xs font-medium ${roleColors[role as keyof typeof roleColors]}`}>
                      {role}
                    </span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRolesModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveRoles}
                  disabled={isUpdating || selectedRoles.length === 0}
                  className="flex-1 px-4 py-2 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Roles"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Suspend User Modal */}
      <AnimatePresence>
        {showSuspendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowSuspendModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">Suspend User</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to suspend <span className="text-white font-medium">{user.name || user.email}</span>?
                They will lose access to their account.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSuspendModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSuspendUser}
                  disabled={isUpdating}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Suspending..." : "Suspend User"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshUsers = () => setRefreshKey((k) => k + 1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (roleFilter !== "all") {
          params.append("role", roleFilter);
        }
        const res = await fetch(`/api/admin/users?${params}`);
        const data = await res.json();
        setUsers(data.users || []);
      } catch {
        toast.error("Failed to fetch users");
      }
      setLoading(false);
    };
    fetchUsers();
  }, [roleFilter, refreshKey]);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: users.length,
    photographers: users.filter((u) => u.roles.includes("PHOTOGRAPHER")).length,
    buyers: users.filter((u) => u.roles.includes("BUYER")).length,
    verified: users.filter((u) => u.photographerProfile?.isVerified).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-500">Manage photographers, buyers, and admins</p>
        </div>
        <div className="relative">
          <SlMagnifier className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 w-64"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
              <SlPeople className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-slate-500">Total Users</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <SlCamera className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.photographers}</p>
              <p className="text-xs text-slate-500">Photographers</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <SlBag className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.buyers}</p>
              <p className="text-xs text-slate-500">Buyers</p>
            </div>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <SlCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.verified}</p>
              <p className="text-xs text-slate-500">Verified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl w-fit">
        {roleFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setRoleFilter(filter.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              roleFilter === filter.value
                ? "bg-amber-500 text-black"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <filter.icon className="w-4 h-4" />
            {filter.label}
          </button>
        ))}
      </div>

      {/* Users Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <SlPeople className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-white">No users found</h3>
          <p className="text-slate-500 mt-1">No users match your current filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} onRolesUpdated={refreshUsers} />
          ))}
        </div>
      )}
    </div>
  );
}
