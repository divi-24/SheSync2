/* eslint-disable */

"use client"

import ProtectedRoute from '../../components/ProtectedRoute';
import { useEffect } from 'react';
import { getProfile } from '../../lib/auth';
import { useState } from 'react';
import { apiFetch } from '../../lib/api';

type PendingUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function ParentPage() {
  const [email, setEmail] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [requestStatus, setRequestStatus] = useState('');
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
  const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
  const [pendingUser, setPendingUser] = useState<PendingUser | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [acceptedUser, setAcceptedUser] = useState<PendingUser | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<PendingUser[]>([]);
  const [role, setRole] = useState<string>('');

  useEffect(() => {
    getProfile().then(async profile => {
      setRole(profile.role);
      console.log('Profile fetched:', profile.role);
      if (profile.role === 'user') {
        setEmail(profile.email);
        // Fetch accepted parent connection for user
        const res = await apiFetch(`/api/parent/user-connection?email=${profile.email}`) as {
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
      if (profile.role === 'parent') {
        // Fetch pending requests for parent
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
        const res = await apiFetch(`/api/parent/pending?email=${profile.email}`) as {
          ok: boolean;
          body?: {
            requests?: Request[];
          };
        };
        if (res.ok && res.body?.requests) {
          setPendingRequests(res.body.requests);
          // If accepted request, show details
          const accepted = res.body.requests.find((r: Request) => r.status === 'accepted');
          if (accepted) {
            setAcceptedUser({
              id: accepted.user._id,
              name: accepted.user.name,
              email: accepted.user.email,
              role: accepted.user.role,
            });
          } else if (res.body.requests.length > 0) {
            // Show first pending request
            const req = res.body.requests[0];
            setPendingUser({
              id: req.user._id,
              name: req.user.name,
              email: req.user.email,
              role: req.user.role,
            });
            setRequestId(req._id);
          }
        }
        // Fetch all connected users for parent
        const connRes = await apiFetch(`/api/parent/connected-users?email=${profile.email}`) as {
          ok: boolean;
          body?: {
            users?: unknown[];
          };
        };
        if (connRes.ok && connRes.body?.users) {
          setConnectedUsers(connRes.body.users.map((u: any) => ({
            id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
          })));
        }
      }
    }).catch(() => {});
  }, []);

  // Submit request to parent
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setRequestStatus('');
    const res = await apiFetch('/api/parent/request', {
      method: 'POST',
      body: JSON.stringify({ email, parentEmail }),
    }) as {
      ok: boolean;
      body?: {
        request?: {
          _id: string;
          user: {
            _id: string;
            name: string;
            email: string;
            role: string;
          };
        };
        message?: string;
      };
    };
    if (res.ok && res.body?.request) {
      setRequestStatus('Request sent!');
      setPendingUser({
        id: res.body.request.user._id,
        name: res.body.request.user.name,
        email: res.body.request.user.email,
        role: res.body.request.user.role,
      });
      setRequestId(res.body.request._id);
    } else {
      setRequestStatus(res.body?.message || 'Error sending request');
    }
  }

  // Accept/decline request
  async function handleDecision(decision: 'accept' | 'decline') {
    if (!requestId) return;
    const res = await apiFetch('/api/parent/decision', {
      method: 'POST',
      body: JSON.stringify({ requestId, decision }),
    }) as {
      ok: boolean;
      body?: {
        user?: {
          _id: string;
          name: string;
          email: string;
          role: string;
        };
        message?: string;
      };
    };
    if (res.ok && decision === 'accept' && res.body?.user) {
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

  // Placeholder: fetch pending user request (simulate)
  // In real app, fetch from backend
  // useEffect(() => { ... }, []);

  return (
    <ProtectedRoute>
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #f3e8ff 50%, #fae8ff 75%, #fdf4ff 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(24px, 6vw, 64px)',
      }}>
        <h2 style={{
          fontSize: 'clamp(32px, 6vw, 48px)',
          fontWeight: 'bold',
          background: 'linear-gradient(90deg, #ec4899, #f43f5e, #a855f7)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: 24,
        }}>Parent Connection</h2>
        <div style={{
          background: 'white',
          borderRadius: 24,
          boxShadow: '0 4px 24px rgba(236,72,153,0.08)',
          padding: 'clamp(24px, 4vw, 48px)',
          minWidth: 320,
          maxWidth: 420,
          width: '100%',
        }}>
          {/* User view: send request */}
          {role === 'user' && !pendingUser && !showUserDetails && !acceptedUser && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 500, color: '#a855f7' }}>Parent Email:</label>
                <input
                  type="email"
                  value={parentEmail}
                  onChange={e => setParentEmail(e.target.value)}
                  required
                  style={{
                    marginLeft: 8,
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #f3e8ff',
                    background: '#fdf4ff',
                    color: '#a855f7',
                    fontWeight: 500,
                  }}
                  disabled={!!acceptedUser}
                />
              </div>
              <button type="submit" style={{
                background: 'linear-gradient(90deg, #ec4899, #f43f5e, #a855f7)',
                color: 'white',
                fontWeight: 600,
                border: 'none',
                borderRadius: 8,
                padding: '10px 24px',
                cursor: !!acceptedUser ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 8px rgba(236,72,153,0.08)',
              }} disabled={!!acceptedUser}>Send Request</button>
            </form>
          )}
          {/* Show connected parent for user */}
          {role === 'user' && acceptedUser && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <div style={{ fontWeight: 500, color: '#a855f7', marginBottom: 8 }}>
                Connected Parent: {parentEmail}
                <span
                  style={{
                    marginLeft: 12,
                    color: '#f43f5e',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: 18,
                  }}
                  title="Remove Connection"
                  onClick={async () => {
                    // Call backend to remove connection
                    if (email && parentEmail) {
                      const res = await apiFetch('/api/parent/remove-connection', {
                        method: 'POST',
                        body: JSON.stringify({ userEmail: email, parentEmail }),
                      }) as {
                        ok: boolean;
                        body?: {
                          message?: string;
                        };
                      };
                      if (res.ok) {
                        setAcceptedUser(null);
                        setParentEmail('');
                        setRequestStatus('Connection removed');
                      } else {
                        setRequestStatus(res.body?.message || 'Error removing connection');
                      }
                    }
                  }}
                >&#10006;</span>
              </div>
            </div>
          )}
          {/* Parent view: see requests only if no connected users */}
          {role === 'parent' && !showUserDetails && !acceptedUser && connectedUsers.length === 0 && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#ec4899', fontWeight: 600 }}>Pending Requests:</h3>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req, idx) => req.status === 'pending' && (
                  <div key={req._id + idx} style={{ marginBottom: 24 }}>
                    <div style={{ fontWeight: 500, color: '#a855f7', marginBottom: 8 }}>{req.user.email}</div>
                    <button onClick={() => { setPendingUser({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }); setRequestId(req._id); handleDecision('accept'); }} style={{
                      background: 'linear-gradient(90deg, #10b981, #a3e635)',
                      color: 'white',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 24px',
                      cursor: 'pointer',
                      marginRight: 8,
                    }}>Accept</button>
                    <button onClick={() => { setPendingUser({ id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role }); setRequestId(req._id); handleDecision('decline'); }} style={{
                      background: 'linear-gradient(90deg, #f43f5e, #a855f7)',
                      color: 'white',
                      fontWeight: 600,
                      border: 'none',
                      borderRadius: 8,
                      padding: '10px 24px',
                      cursor: 'pointer',
                    }}>Decline</button>
                  </div>
                ))
              ) : (
                <div style={{ color: '#a855f7', fontWeight: 500, marginTop: 24 }}>
                  No connections received yet.
                </div>
              )}
            </div>
          )}
          {/* Show all connected users for parent */}
          {role === 'parent' && connectedUsers.length > 0 && (
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <h3 style={{ color: '#a855f7', fontWeight: 600 }}>Connected Users</h3>
              {connectedUsers.map(user => (
                <div key={user.id} style={{ marginBottom: 24, border: '1px solid #f3e8ff', borderRadius: 12, padding: 16, background: '#fdf4ff' }}>
                  <div style={{ fontWeight: 500, color: '#ec4899' }}>Name: {user.name}</div>
                  <div style={{ fontWeight: 500, color: '#ec4899' }}>Email: {user.email}</div>
                  <div style={{ fontWeight: 500, color: '#ec4899' }}>Role: {user.role}</div>
                </div>
              ))}
            </div>
          )}
          {/* Status message */}
          {requestStatus && <div style={{ marginTop: 16, color: '#f43f5e', fontWeight: 500 }}>{requestStatus}</div>}
          {/* Show user details after accept */}
          {showUserDetails && pendingUser && (
            <div style={{ marginTop: 32, textAlign: 'center' }}>
              <h3 style={{ color: '#a855f7', fontWeight: 600 }}>User Details</h3>
              <div style={{ fontWeight: 500, color: '#ec4899' }}>Name: {pendingUser.name}</div>
              <div style={{ fontWeight: 500, color: '#ec4899' }}>Email: {pendingUser.email}</div>
              <div style={{ fontWeight: 500, color: '#ec4899' }}>Role: {pendingUser.role}</div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
