/* eslint-disable */

"use client";

import ProtectedRoute from "../../components/ProtectedRoute";
import { useEffect } from "react";
import { getProfile } from "../../lib/auth";
import { useState } from "react";
import { apiFetch } from "../../lib/api";
import { sendInvitation } from "../../lib/invitations";
import { invitationEvents } from "../../components/PendingInvitations";
import { motion } from "framer-motion";
import { Users, Mail, Send, Check, UserCheck, UserX, ChevronRight, Eye } from "lucide-react";
import Link from "next/link";
import { Cookie } from "next/font/google";

const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

type PendingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type Request = {
  _id: string;
  status: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
};

export default function ParentPage() {
  const [email, setEmail] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [requestStatus, setRequestStatus] = useState("");
  const [requestStatusType, setRequestStatusType] = useState<"success" | "error" | "">("");
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [acceptedUser, setAcceptedUser] = useState<PendingUser | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<PendingUser[]>([]);
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState(true);

  async function loadParentData(email: string) {
    const res = (await apiFetch(`/api/parent/pending?email=${email}`)) as {
      ok: boolean;
      body?: { requests?: Request[] };
    };
    if (res.ok && res.body?.requests) {
      setPendingRequests(res.body.requests);
      const accepted = res.body.requests.find((r: Request) => r.status === "accepted");
      if (accepted) {
        setAcceptedUser({
          id: accepted.user._id,
          name: accepted.user.name,
          email: accepted.user.email,
          role: accepted.user.role,
        });
        setPendingUser(null);
        setShowUserDetails(false);
      } else if (res.body.requests.length > 0) {
        const req = res.body.requests[0];
        setPendingUser({
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
        });
        setRequestId(req._id);
        setAcceptedUser(null);
      }
    }
    const connRes = (await apiFetch(`/api/parent/connected-users?email=${email}`)) as {
      ok: boolean;
      body?: { users?: unknown[] };
    };
    if (connRes.ok && connRes.body?.users) {
      setConnectedUsers(
        (connRes.body.users as { _id: string; name: string; email: string; role: string }[]).map((u) => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
        }))
      );
    }
    
    // Also fetch if this parent was invited by a child
    const myChildRes = (await apiFetch(`/api/parent/my-child?email=${email}`)) as {
      ok: boolean;
      body?: { child?: { _id: string; name: string; email: string; role: string } };
    };
    console.log('[loadParentData] my-child response:', myChildRes);
    if (myChildRes.ok && myChildRes.body?.child) {
      console.log('[loadParentData] Setting acceptedUser to:', myChildRes.body.child);
      setAcceptedUser({
        id: myChildRes.body.child._id,
        name: myChildRes.body.child.name,
        email: myChildRes.body.child.email,
        role: myChildRes.body.child.role,
      });
      setConnectedUsers([]);
      setPendingRequests([]);
    } else {
      console.log('[loadParentData] No child found or request failed');
    }
  }

  async function loadUserData(email: string) {
    const res = (await apiFetch(`/api/parent/user-connection?email=${email}`)) as {
      ok: boolean;
      body?: {
        connection?: {
          parent: {
            _id: string;
            name: string;
            email: string;
            role: string;
          };
        };
      };
    };
    if (res.ok && res.body?.connection) {
      setAcceptedUser({
        id: res.body.connection.parent._id,
        name: res.body.connection.parent.name,
        email: res.body.connection.parent.email,
        role: res.body.connection.parent.role,
      });
      setParentEmail(res.body.connection.parent.email);
    }
  }

  useEffect(() => {
    getProfile()
      .then(async (profile) => {
        setRole(profile.role);
        if (profile.role === "user") {
          setEmail(profile.email);
          await loadUserData(profile.email);
        }
        if (profile.role === "parent") {
          await loadParentData(profile.email);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Listen for connection acceptance events
    const handleConnectionAccepted = async () => {
      // Reload data after a small delay to ensure backend is updated
      setTimeout(async () => {
        const profile = await getProfile();
        if (profile.role === "parent") {
          await loadParentData(profile.email);
        } else if (profile.role === "user") {
          await loadUserData(profile.email);
        }
      }, 500);
    };

    invitationEvents.addEventListener('connectionAccepted', handleConnectionAccepted);
    return () => {
      invitationEvents.removeEventListener('connectionAccepted', handleConnectionAccepted);
    };
  }, []);

  function setStatus(msg: string, type: "success" | "error") {
    setRequestStatus(msg);
    setRequestStatusType(type);
    if (type === "success") setTimeout(() => setRequestStatus(""), 3000);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRequestStatus("");
    
    // Use new invitation system
    const result = await sendInvitation(parentEmail, "parent");
    
    if (result.success) {
      setStatus(result.message || "Invitation sent successfully!", "success");
      setParentEmail("");
    } else {
      setStatus(result.error || "Error sending invitation", "error");
    }
  }

  async function handleDecision(decision: "accept" | "decline") {
    if (!requestId) return;
    const res = (await apiFetch("/api/parent/decision", {
      method: "POST",
      body: JSON.stringify({ requestId, decision }),
    })) as {
      ok: boolean;
      body?: {
        user?: { _id: string; name: string; email: string; role: string };
        message?: string;
      };
    };
    if (res.ok && decision === "accept" && res.body?.user) {
      setShowUserDetails(true);
      setPendingUser({
        id: res.body.user._id,
        name: res.body.user.name,
        email: res.body.user.email,
        role: res.body.user.role,
      });
    } else {
      setPendingUser(null);
      setShowUserDetails(false);
      setRequestId(null);
    }
  }

  async function handleRemoveConnection() {
    if (!email || !parentEmail) return;
    const res = (await apiFetch("/api/parent/remove-connection", {
      method: "POST",
      body: JSON.stringify({ userEmail: email, parentEmail }),
    })) as { ok: boolean; body?: { message?: string } };
    if (res.ok) {
      setAcceptedUser(null);
      setParentEmail("");
      setStatus("Connection removed", "success");
    } else {
      setStatus(res.body?.message || "Error removing connection", "error");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Loading...</h3>
        </motion.div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 flex flex-col items-center justify-center p-6 md:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1
            className={`${cookie.className} text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent`}
          >
            Parent Connection
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-pink-500/10 border border-pink-100/50 p-8 md:p-10"
          >
            {/* User view: send request */}
            {role === "user" && !pendingUser && !showUserDetails && !acceptedUser && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-pink-100 to-purple-100 p-3 rounded-xl">
                    <Mail className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Connect with a Parent</h2>
                    <p className="text-sm text-gray-600">Enter your parent&apos;s email to send a connection request</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="parent-email" className="block text-sm font-medium text-gray-700">
                    Parent Email
                  </label>
                  <input
                    id="parent-email"
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 bg-pink-50/50 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-shadow"
                    disabled={!!acceptedUser}
                  />
                </div>
                <button
                  type="submit"
                  disabled={!!acceptedUser}
                  className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="w-5 h-5" />
                  Send Request
                </button>
              </form>
            )}

            {/* Show connected parent for user */}
            {role === "user" && acceptedUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="bg-green-50 rounded-2xl p-4 flex items-center justify-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-600">Connected with</p>
                    <p className="font-semibold text-gray-800">{parentEmail}</p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveConnection}
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium text-sm hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
                  title="Remove connection"
                >
                  <UserX className="w-4 h-4" />
                  Remove connection
                </button>
              </motion.div>
            )}

            {/* Parent view: pending requests */}
            {role === "parent" && !showUserDetails && !acceptedUser && connectedUsers.length === 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-xl">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Pending Requests</h2>
                    <p className="text-sm text-gray-600">Review and respond to connection requests</p>
                  </div>
                </div>
                {pendingRequests.some((r) => r.status === "pending") ? (
                  <div className="space-y-4">
                    {pendingRequests.map(
                      (req, idx) =>
                        req.status === "pending" && (
                          <motion.div
                            key={req._id + idx}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100"
                          >
                            <p className="font-medium text-gray-800 truncate">{req.user.email}</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setPendingUser({
                                    id: req.user._id,
                                    name: req.user.name,
                                    email: req.user.email,
                                    role: req.user.role,
                                  });
                                  setRequestId(req._id);
                                  handleDecision("accept");
                                }}
                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/30 transition-all flex items-center gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Accept
                              </button>
                              <button
                                onClick={() => {
                                  setPendingUser({
                                    id: req.user._id,
                                    name: req.user.name,
                                    email: req.user.email,
                                    role: req.user.role,
                                  });
                                  setRequestId(req._id);
                                  handleDecision("decline");
                                }}
                                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Decline
                              </button>
                            </div>
                          </motion.div>
                        )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 px-4 rounded-xl bg-pink-50/50 border border-pink-100">
                    <Users className="w-12 h-12 text-pink-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No connection requests yet</p>
                    <p className="text-sm text-gray-500 mt-1">Requests will appear here when someone invites you</p>
                  </div>
                )}
              </div>
            )}

            {/* Parent view: connected users or child they're observing */}
            {role === "parent" && (acceptedUser || connectedUsers.length > 0) && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-3 rounded-xl">
                    <UserCheck className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {acceptedUser ? "Connected Child" : "Connected Users"}
                  </h2>
                </div>
                <div className="space-y-3">
                  {acceptedUser && (
                    <Link href="/parent-dashboard">
                      <motion.div
                        key={acceptedUser.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 flex items-center justify-between gap-4 cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div>
                          <p className="font-semibold text-gray-800">{acceptedUser.name}</p>
                          <p className="text-sm text-gray-600">{acceptedUser.email}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-pink-400 flex-shrink-0" />
                      </motion.div>
                    </Link>
                  )}
                  {connectedUsers.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 flex items-center justify-between gap-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-pink-400 flex-shrink-0" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Show user details after accept */}
            {showUserDetails && pendingUser && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center space-y-4"
              >
                <div className="bg-green-50 rounded-2xl p-4 flex items-center justify-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="font-semibold text-gray-800">Connection accepted!</p>
                </div>
                <div className="text-left p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-800">{pendingUser.name}</p>
                  <p className="text-sm text-gray-600 mt-2">Email</p>
                  <p className="font-medium text-gray-800">{pendingUser.email}</p>
                </div>
              </motion.div>
            )}

            {/* Status message */}
            {requestStatus && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-3 rounded-xl text-sm font-medium ${
                  requestStatusType === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {requestStatus}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
}
