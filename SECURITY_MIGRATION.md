# Security Migration Guide

## Overview
This application has been upgraded with comprehensive security improvements. This guide explains what changed and how to migrate existing data.

## Security Improvements

### 1. Password Hashing
- **Before**: Passwords were stored using AES encryption (reversible)
- **After**: Passwords are now hashed using bcrypt (one-way, secure)
- **Impact**: All existing passwords need to be re-hashed

### 2. Authentication
- **Before**: Client-side only session management (localStorage)
- **After**: JWT tokens with server-side validation
- **Impact**: Users will need to log in again after migration

### 3. API Route Protection
- **Before**: Most API routes were publicly accessible
- **After**: All sensitive routes require JWT authentication
- **Impact**: Frontend must send JWT token in Authorization header

### 4. Rate Limiting
- **Before**: No rate limiting on login endpoints
- **After**: 5 login attempts per 15 minutes per IP
- **Impact**: Prevents brute force attacks

### 5. Input Validation
- **Before**: Minimal input validation
- **After**: Comprehensive validation and sanitization
- **Impact**: Better protection against injection attacks

## Migration Steps

### Step 1: Update Environment Variables

Add to your `.env.local`:
```env
JWT_SECRET=your-very-secure-random-secret-key-here
# If JWT_SECRET is not set, it will fallback to ENCRYPTION_SECRET_KEY
```

**Important**: Generate a strong random secret:
```bash
# On Linux/Mac
openssl rand -base64 32

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 2: Migrate Existing Passwords

You have two options:

#### Option A: Use the Admin Route (Recommended)
1. Log in as admin (if you still have access)
2. Use the `/api/storeEncryptedUsername` route (now protected) to update passwords:
   ```javascript
   // POST /api/storeEncryptedUsername
   {
     "username": "user@example.com",
     "password": "newSecurePassword123"
   }
   ```

#### Option B: Manual Database Update
1. For each user, hash their password using bcrypt:
   ```javascript
   const bcrypt = require('bcrypt');
   const hashedPassword = await bcrypt.hash('userPassword', 10);
   // Update in MongoDB
   ```

### Step 3: Test Authentication

1. Try logging in with updated credentials
2. Verify JWT token is stored in localStorage
3. Test that protected API routes work with the token

### Step 4: Update Frontend Code

All API calls should now use `authenticatedFetch` from `@/app/lib/apiClient`:

```javascript
// Before
const response = await fetch('/api/userprofiles');

// After
import { authenticatedFetch } from '@/app/lib/apiClient';
const response = await authenticatedFetch('/api/userprofiles');
```

## Protected Routes

The following routes now require authentication:

- `GET /api/userprofiles` - Admin only
- `DELETE /api/userprofiles` - Admin only
- `GET /api/downloadlogs` - Admin only
- `GET /api/callMeBack` - Admin only
- `POST /api/generatePdf` - Authenticated users
- `POST /api/storeEncryptedUsername` - Admin only

## Public Routes

These routes remain public (but with input validation):

- `POST /api/auth` - Login endpoint (rate limited)
- `POST /api/callMeBack` - Public callback request form

## Breaking Changes

1. **Password Storage**: Existing AES-encrypted passwords will not work. All users must reset passwords or you must migrate them.

2. **API Authentication**: Frontend must include JWT token in requests:
   ```
   Authorization: Bearer <token>
   ```

3. **Session Duration**: Extended from 5 minutes to 24 hours (JWT expiry)

## Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Use strong JWT_SECRET** (at least 32 characters, random)
3. **Rotate secrets periodically** in production
4. **Monitor rate limit violations** for potential attacks
5. **Keep dependencies updated** (`npm audit`)

## Troubleshooting

### "Authentication required" errors
- Check that JWT token is stored in localStorage
- Verify token hasn't expired (24 hours)
- Ensure Authorization header is being sent

### "Invalid or expired token" errors
- User needs to log in again
- Check JWT_SECRET matches between server restarts

### Rate limit errors
- Wait 15 minutes or use different IP
- Consider increasing limits in `rateLimiter.js` for development

## Support

For issues or questions about the security migration, check:
- JWT token in browser localStorage
- Server logs for authentication errors
- Network tab for API request/response headers

