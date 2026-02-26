# API Quick Reference

## Base URLs

**Production:**
- Functions: `https://us-central1-gibc-showcase.cloudfunctions.net`
- Hosting: `https://gibc-showcase.web.app`
- API Alias: `https://gibc-showcase.web.app/api`

**Local Development:**
- Frontend: `http://localhost:5173`
- Functions: `http://localhost:5001/gibc-showcase/us-central1`

---

## 📋 Token Verification

### HTTP: Verify Token
**Endpoint:** `POST /api/verify`

**Request:**
```json
{
  "token": "ABC123XYZ0",
  "participantName": "John Doe",  // Optional
  "email": "john@example.com"     // Optional
}
```

**Response (Success):**
```json
{
  "valid": true,
  "participant": {
    "devpostUsername": "john_doe",
    "email": "john@example.com",
    "projectName": "My Project",
    "projectUrl": "https://devpost.com/...",
    "award": "Winner",
    "token": "ABC123XYZ0"
  }
}
```

**Response (Error):**
```json
{
  "valid": false,
  "error": "Invalid token or credentials"
}
```

**CURL Example:**
```bash
curl -X POST https://gibc-showcase.web.app/api/verify \
  -H "Content-Type: application/json" \
  -d '{"token":"ABC123XYZ0"}'
```

---

## 🎓 Certificate Generation

### Callable: Generate Certificate
**Function:** `generateCertificate`

**Request:**
```javascript
const generateCertificate = httpsCallable(functions, 'generateCertificate');
const result = await generateCertificate({
  token: "ABC123XYZ0",
  participantName: "John Doe"  // Optional, uses username if not provided
});
```

**Response:**
```json
{
  "success": true,
  "certificate": {
    "participantName": "John Doe",
    "projectName": "My Awesome Project",
    "award": "Winner",
    "eventName": "Global Innovation Build Challenge V1 (2026)",
    "eventDate": "March 15, 2026",
    "issuer": "GIBC Team",
    "token": "ABC123XYZ0"
  }
}
```

---

## 👨‍💼 Admin Functions

### Create Participant
**Function:** `createParticipant` (Callable)

**Request:**
```javascript
const createParticipant = httpsCallable(functions, 'createParticipant');
const result = await createParticipant({
  devpostUsername: "john_doe",
  email: "john@example.com",
  projectName: "My Project",
  projectUrl: "https://devpost.com/...",
  award: "Participant"
});
```

**Response:**
```json
{
  "success": true,
  "message": "Participant created successfully",
  "participantId": "abc123...",
  "token": "NEW12TOKEN"
}
```

---

### Update Participant
**Function:** `updateParticipant` (Callable)

**Request:**
```javascript
const updateParticipant = httpsCallable(functions, 'updateParticipant');
const result = await updateParticipant({
  participantId: "abc123...",
  email: "newemail@example.com",
  projectName: "Updated Project Name"
  // Only include fields to update
});
```

**Response:**
```json
{
  "success": true,
  "message": "Participant updated successfully"
}
```

---

### Assign Award
**Function:** `assignAward` (Callable)

**Request:**
```javascript
const assignAward = httpsCallable(functions, 'assignAward');
const result = await assignAward({
  participantId: "abc123...",
  award: "Winner"  // Participant | Finalist | Winner | Grand Prize
});
```

**Response:**
```json
{
  "success": true,
  "message": "Award 'Winner' assigned successfully"
}
```

---

### Regenerate Token
**Function:** `regenerateToken` (Callable)

**Request:**
```javascript
const regenerateToken = httpsCallable(functions, 'regenerateToken');
const result = await regenerateToken({
  participantId: "abc123..."
});
```

**Response:**
```json
{
  "success": true,
  "token": "NEWTOKEN10",
  "message": "Token regenerated successfully"
}
```

---

### Get Participants (Export)
**Function:** `getParticipants` (Callable)

**Request:**
```javascript
const getParticipants = httpsCallable(functions, 'getParticipants');
const result = await getParticipants({
  format: "csv"  // or "json"
});
```

**Response:**
```json
{
  "success": true,
  "count": 150,
  "data": "devpostUsername,email,projectName,award,token\njohn_doe,john@example.com,My Project,Winner,ABC123XYZ0\n..."
}
```

**For JSON format:**
```json
{
  "success": true,
  "count": 150,
  "data": "[{\"devpostUsername\":\"john_doe\",\"email\":\"john@example.com\",...}]"
}
```

---

### Delete Participant
**Function:** `deleteParticipant` (Callable)

**Request:**
```javascript
const deleteParticipant = httpsCallable(functions, 'deleteParticipant');
const result = await deleteParticipant({
  participantId: "abc123..."
});
```

**Response:**
```json
{
  "success": true,
  "message": "Participant deleted successfully"
}
```

---

## 🔐 Authentication

Current implementation uses simple admin password check. For production:

### Option 1: Environment Secret
```javascript
// Admin functions check for secret
if (context.auth?.token?.admin !== true) {
  throw new functions.https.HttpsError('permission-denied', 'Admin access required');
}
```

### Option 2: Firebase Auth Custom Claims
```javascript
// Set admin claim
await admin.auth().setCustomUserClaims(uid, { admin: true });
```

---

## 📊 Firestore Data Structure

### Participants Collection
**Path:** `/participants/{participantId}`

**Document:**
```json
{
  "devpostUsername": "john_doe",
  "email": "john@example.com",
  "projectName": "My Awesome Project",
  "projectUrl": "https://devpost.com/software/my-project",
  "award": "Winner",
  "token": "ABC123XYZ0",
  "tokenUsed": false,
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-01-15T10:00:00Z",
  "formSubmittedAt": "2026-01-14T15:30:00Z"
}
```

### Indexes
```javascript
// Composite indexes (auto-created via firestore.indexes.json)
- email ASC + createdAt DESC
- token ASC
- award ASC + createdAt DESC
```

---

## 🔍 Query Examples

### Find by Token
```javascript
const snapshot = await db.collection('participants')
  .where('token', '==', 'ABC123XYZ0')
  .limit(1)
  .get();
```

### Get All Winners
```javascript
const snapshot = await db.collection('participants')
  .where('award', '==', 'Winner')
  .orderBy('createdAt', 'desc')
  .get();
```

### Search by Email
```javascript
const snapshot = await db.collection('participants')
  .where('email', '==', 'john@example.com')
  .get();
```

---

## ⚠️ Error Codes

| Code | Message | Description |
|------|---------|-------------|
| `invalid-argument` | Missing required fields | Required parameters not provided |
| `not-found` | Participant not found | No participant with given ID/token |
| `already-exists` | Username/email already exists | Duplicate participant |
| `permission-denied` | Admin access required | Unauthorized admin operation |
| `internal` | Internal server error | Unexpected error occurred |

---

## 🧪 Testing

### Test Token Verification
```javascript
fetch('https://gibc-showcase.web.app/api/verify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ token: 'TEST123ABC' })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Test Certificate Generation (Browser Console)
```javascript
import { httpsCallable } from 'firebase/functions';
import { functions } from './lib/firebase';

const generateCert = httpsCallable(functions, 'generateCertificate');
generateCert({ token: 'TEST123ABC' })
  .then(result => console.log(result.data));
```

---

## 📝 Rate Limits

Firebase Cloud Functions default quotas:
- **Free tier**: 125,000 invocations/day, 40,000 GB-seconds/day
- **Spark plan**: Same as free tier
- **Blaze plan**: Pay as you go

Firestore quotas:
- **Reads**: 50,000/day (free), unlimited (Blaze)
- **Writes**: 20,000/day (free), unlimited (Blaze)
- **Deletes**: 20,000/day (free), unlimited (Blaze)

---

## 🔗 Useful Links

- **Firebase Console**: https://console.firebase.google.com/project/gibc-showcase
- **Function Logs**: `firebase functions:log`
- **Firestore Console**: https://console.firebase.google.com/project/gibc-showcase/firestore

---

## 💡 Tips

1. **Cache Tokens**: Frontend should cache verified tokens to reduce function calls
2. **Batch Operations**: Use Firestore batch writes for multiple participants
3. **Error Handling**: Always wrap function calls in try-catch
4. **Monitoring**: Check Firebase Console for usage and errors
5. **Testing**: Use Firebase emulators for local development

---

**Last Updated:** 2026-01-15
