# Quick Reference - Invitation System Fixes

## One-Minute Summary

**Problem:** Invitations accepted but connections don't appear in dashboards

**Cause:** Two separate systems (Invitation & ParentRequest) not synchronized

**Fix:** Create ParentRequest record when invitation accepted + Process inviterEmail on signup

**Result:** Invitations now work seamlessly across entire app

---

## API Endpoints Cheat Sheet

### Signup
```bash
# Old way (still works)
POST /api/auth/signup
{
  "name": "John",
  "email": "john@example.com",
  "role": "user",
  "password": "..."
}

# New way (from email link)
POST /api/auth/signup
{
  "name": "John",
  "email": "john@example.com",
  "role": "parent",  # Pre-filled
  "password": "...",
  "inviterEmail": "alice@example.com"  # New parameter
}
```

### Invitations
```bash
# Send invitation
POST /api/invitations/send
{"inviteeEmail": "bob@example.com", "type": "parent"}

# Get pending
GET /api/invitations/pending

# Accept
POST /api/invitations/:id/accept

# Reject
POST /api/invitations/:id/reject
```

### Parent Dashboard
```bash
# Get pending requests (now includes invitations)
GET /api/parent/pending?email=parent@example.com

# Get connected users
GET /api/parent/connected-users?email=parent@example.com

# Get user data
GET /api/dashboard/{userId}
```

### Profile
```bash
# Get current user (now includes partnerOf)
GET /api/auth/profile

# Response includes:
{
  "user": {
    "id": "...",
    "email": "...",
    "role": "parent",  # or "partner"
    "parentOf": null,  # ID if user is parent
    "partnerOf": null  # ID if user is partner
  }
}
```

---

## Database Queries

### Find pending invitations for parent
```javascript
db.invitations.find({ 
  inviterId: ObjectId("parent_id"), 
  status: "pending",
  type: "parent"
})
```

### Find accepted connections
```javascript
db.parentrequests.find({ 
  parent: ObjectId("parent_id"), 
  status: "accepted"
})

db.users.find({ 
  parentOf: ObjectId("parent_id"), 
  role: "parent"
})
```

### Find invitations by email
```javascript
db.invitations.find({ 
  inviteeEmail: "user@example.com" 
})
```

---

## Frontend Flow Diagrams

### Email Invitation Click Flow
```
User clicks email link
         ↓
URL: /signup?role=parent&inviterEmail=alice@example.com
         ↓
Signup page reads useSearchParams()
         ↓
Pre-fills role = "parent"
         ↓
User submits form
         ↓
Frontend calls signup(name, email, password, role, inviterEmail)
         ↓
Backend processes inviterEmail
         ↓
User created + Connection established ✓
```

### Pending Invitation Flow
```
User logs in
         ↓
PendingInvitations component mounts
         ↓
Calls GET /api/invitations/pending
         ↓
Backend queries Invitation collection
         ↓
Returns pending invitations
         ↓
Component shows banner with Accept/Decline
         ↓
User clicks Accept
         ↓
POST /api/invitations/:id/accept
         ↓
Backend updates both systems
         ↓
Component removes from list ✓
```

---

## Status Codes & Common Errors

### Success (2xx)
- `201 Created` - Invitation sent or account created
- `200 OK` - Data retrieved or action completed

### Client Error (4xx)
- `400 Bad Request` - Missing required fields
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - No access to this resource
- `404 Not Found` - Invitation or user not found
- `409 Conflict` - Duplicate invitation pending

### Server Error (5xx)
- `500 Server Error` - Database error, email service down, etc.

---

## Testing Checklist

Quick verification that everything works:

```
[ ] Send invitation to unregistered email
[ ] Receive email with correct link
[ ] Click link → Signup page pre-fills role ✓
[ ] Complete signup form
[ ] Verify user created with parentOf field ✓
[ ] Verify ParentRequest record created ✓
[ ] Login as parent
[ ] See connected user in dashboard ✓
[ ] Send invitation to registered user
[ ] Verify connection auto-established ✓
[ ] Verify Invitation marked accepted ✓
[ ] Login as invited user
[ ] See parent connection ✓
[ ] Accept pending invitation if present ✓
```

---

## Environment Variables

```env
# Brevo Email Service (required for invitations)
BREVO_API_KEY=your_brevo_key

# App Configuration
APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret

# Database
MONGO_URI=mongodb://localhost:27017/shesync

# Server
PORT=5000
NODE_ENV=development
```

---

## File Changes Summary

| File | Change | Lines |
|------|--------|-------|
| `invitation.js` | Add inviterEmail field | +1 |
| `invitationController.js` | Sync ParentRequest | +25 |
| `auth.js` (route) | Process inviterEmail | +60 |
| `parent.js` | Merge pending | +20 |
| `dashboard.js` | Partner support | +8 |
| `auth.js` (middleware) | Include partnerOf | +1 |
| `signup/page.tsx` | Read URL params | +30 |
| `auth.ts` | Accept inviterEmail | +5 |
| Documentation | New guides | ~500 |
| **Total** | | **~150** |

---

## Common Commands

```bash
# Test signup with invitation
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234!",
    "role": "parent",
    "inviterEmail": "alice@example.com"
  }'

# Check pending invitations
curl -X GET http://localhost:5000/api/invitations/pending \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get user profile
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Cookie: token=YOUR_TOKEN"
```

---

## Troubleshooting Matrix

| Symptom | Check | Solution |
|---------|-------|----------|
| Invitation not sent | Brevo API key | Set BREVO_API_KEY in .env |
| Email link doesn't work | URL format | Should have role= and inviterEmail= |
| Role not pre-filled | Browser cache | Clear localStorage & cookies |
| Parent can't see user | Check parentOf | Run: `db.users.find({email: "..."})` |
| ParentRequest missing | Manual check | Should auto-create on accept |
| Connection not visible | Logout/login | Refresh auth state |

---

## Key Concepts

### Invitation Types
- `parent` - Child invites parent/guardian
- `partner` - One user invites romantic partner

### Invitation Status
- `pending` - Not yet accepted
- `accepted` - User accepted/signed up
- `rejected` - User declined

### User Roles
- `user` - Regular user, no connections
- `parent` - Monitors child's health (has `parentOf`)
- `partner` - Supports partner's health (has `partnerOf`)

### Connection Models
- **Old**: `ParentRequest` - Direct user-to-parent relationship
- **New**: `Invitation` - Email-based invitation record
- **Sync**: Both updated when invitation accepted

---

## Success Indicators

✅ **All working if you see:**
1. Email invitations received
2. Signup link pre-fills role
3. ParentRequest records created on accept
4. Parent/partner can see connected users
5. No database errors in logs
6. Both old and new connections work

❌ **Issues if you see:**
1. Invitations created but no ParentRequest
2. Role not pre-filled on signup from email
3. Pending requests show only old system
4. Partner dashboard shows no data
5. Database constraint errors

---

## Next Steps

1. **Test**: Run integration tests in `INTEGRATION_TEST_GUIDE.md`
2. **Verify**: Check all 5 success indicators above
3. **Deploy**: Follow deployment steps in main guide
4. **Monitor**: Watch error logs for 24 hours
5. **Success**: Confirm all users can now invite/accept

---

## Need Help?

- **Technical Details**: See `INVITATION_SYSTEM_FIXES.md`
- **Testing Steps**: See `INTEGRATION_TEST_GUIDE.md`
- **Implementation**: See `IMPLEMENTATION_CHECKLIST.md`
- **Overview**: See `FIXES_SUMMARY.md`

---

**Version**: 1.0  
**Date**: February 4, 2026  
**Status**: Ready for testing ✅
