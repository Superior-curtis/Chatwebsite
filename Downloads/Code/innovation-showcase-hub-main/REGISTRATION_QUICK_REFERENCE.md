# ⚡ Registration System - Quick Reference

**For: Global Innovation Build Challenge V1 (2026)**

---

## 🎯 What Is This?

A smart registration system that **automatically approves** participants who meet all criteria, and sends incomplete submissions for manual review.

---

## 🚀 Quick Deploy (3 Steps)

```bash
# 1. Deploy Cloud Function
firebase deploy --only functions:submitRegistration

# 2. Build Frontend
cd innovation-showcase-hub-main && npm run build

# 3. Deploy Hosting
firebase deploy --only hosting
```

✅ Done! Registration is live at: `https://your-project.web.app/register`

---

## ✅ Auto-Approval Criteria

Participants are **instantly approved** if ALL of these are true:

| Criteria | Rule |
|----------|------|
| **Project Name** | More than 3 characters |
| **Devpost Link** | Contains "devpost.com" |
| **Agreement** | Checkbox is checked |

**Result**: Instant token + confetti 🎉

---

## ⏳ What Happens When Criteria Fail?

**Status**: Pending (manual review needed)
**Token**: None (until admin approves)
**User sees**: Orange "pending review" message

---

## 🧪 Test It

### Test 1: Auto-Approval ✅

Visit: `/register`

Fill in:
```
Name: John Doe
Email: john@test.com
Username: johndoe
Project: Amazing Innovation App
Link: https://devpost.com/software/my-project
Agreement: ✓
```

**Result**: Token shown immediately!

### Test 2: Pending Review ⏳

Fill in:
```
Name: Jane Smith
Email: jane@test.com
Username: janesmith
Project: Hi                              ← Too short!
Link: https://github.com/project         ← Not Devpost!
Agreement: ✓
```

**Result**: "Pending review" message

---

## 📁 Files Created/Modified

**Created**:
- ✅ `RegisterPage.tsx` - Registration form component
- ✅ `REGISTRATION_DEPLOYMENT_GUIDE.md` - Full documentation

**Modified**:
- ✅ `functions/index.js` - Added `submitRegistration` function
- ✅ `App.tsx` - Added `/register` route

---

## 🔍 Check Registrations

### Admin CLI

```bash
# List all
node admin-cli.js list-participants

# Show stats
node admin-cli.js stats

# Approve pending (generate token)
node admin-cli.js regenerate-token <participant-id>
```

### Firebase Console

1. Go to Firestore Database
2. Open `participants` collection
3. Check document fields:
   - `status`: "approved" or "pending"
   - `autoApproved`: true/false
   - `token`: Token or null

---

## 🎫 How Tokens Work

**Auto-Approved**:
- ✅ Token generated immediately
- ✅ 10 characters (e.g., `K9MN2XPQ7A`)
- ✅ Globally unique
- ✅ Used for certificate generation

**Pending**:
- 🟡 No token yet
- 🟡 Admin must approve
- 🟡 Use CLI: `regenerate-token <id>`

---

## 🛡️ Duplicate Prevention

**Email Check**:
- ❌ Cannot register twice with same email
- ❌ Case-insensitive (john@test.com = JOHN@TEST.COM)

**Username Check**:
- ❌ Cannot register twice with same Devpost username
- ❌ Exact match required

**Error shown**: "Already registered" message

---

## 🚨 Common Issues

### "Registration failed"

**Fix**:
```bash
# Check function is deployed
firebase functions:list | grep submitRegistration

# Check logs
firebase functions:log --only submitRegistration
```

### Token not generated

**Check**:
1. All 3 criteria met? (project name, link, agreement)
2. View Firestore → `validationResults` field
3. Check function logs

### Cannot access /register

**Fix**:
```bash
npm run build
firebase deploy --only hosting
# Clear browser cache
```

---

## 📊 Registration Flow

```
User fills form
      ↓
   Submit
      ↓
Check duplicates (email + username)
      ↓
   Validate 3 criteria
      ↓
    ┌───┴───┐
    │       │
  PASS    FAIL
    │       │
    ↓       ↓
APPROVED  PENDING
  Token    No Token
   🎉       ⏳
```

---

## 🎯 URLs

| Page | URL |
|------|-----|
| **Registration** | `/register` |
| **Certificate** | `/certificate` |
| **Admin** | `/admin` |
| **Dashboard** | `/dashboard` |

---

## 📞 Need Help?

**Full Guide**: [REGISTRATION_DEPLOYMENT_GUIDE.md](REGISTRATION_DEPLOYMENT_GUIDE.md)

**Common Tasks**:
- Deploy: See [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- Admin CLI: See [ADMIN_CLI_GUIDE.md](ADMIN_CLI_GUIDE.md)
- Functions: See [API_REFERENCE.md](API_REFERENCE.md)

---

## ✨ Key Features

✅ Smart auto-approval
✅ Duplicate prevention
✅ Unique token generation
✅ Beautiful UI with confetti
✅ Mobile responsive
✅ Error handling
✅ Loading states
✅ Copy-to-clipboard
✅ Admin integration

---

**🎊 Registration System Ready!**

Users can register at: `https://your-project.web.app/register`

Auto-approvals happen instantly! ⚡
