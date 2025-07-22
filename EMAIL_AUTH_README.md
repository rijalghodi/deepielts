# Email Code Authentication System

This document describes the implementation of email code-based authentication for the IELTS Writing AI application.

## Overview

The system implements a secure email code authentication flow that allows users to:

1. Enter their email address
2. Receive a 6-digit verification code via email
3. Enter the code to authenticate
4. Automatically create an account if the user doesn't exist, or log in if they do

## Architecture

### Backend API Endpoints

#### 1. Send Email Code (`POST /api/auth/send-code`)

- **Purpose**: Generates and sends a 6-digit verification code to the user's email
- **Request Body**: `{ email: string }`
- **Response**: `{ success: boolean, message: string }`
- **Features**:
  - Generates a random 6-digit code
  - Stores code in memory with 10-minute expiration
  - Logs code to console for development (replace with actual email service)

#### 2. Verify Email Code (`POST /api/auth/verify-code`)

- **Purpose**: Verifies the email code and creates/authenticates the user
- **Request Body**: `{ email: string, code: string }`
- **Response**: `{ success: boolean, user: User }`
- **Features**:
  - Validates the provided code against stored code
  - Checks if user exists in Firestore
  - Creates new user in Firebase Auth and Firestore if user doesn't exist
  - Sets JWT token in HttpOnly cookie
  - Returns user data

### Frontend Components

#### 1. LoginForm (`src/features/auth/login/login-form.tsx`)

- **Purpose**: Collects user email and sends verification code
- **Features**:
  - Email validation using Zod schema
  - Calls send-code API endpoint
  - Shows success/error messages using toast notifications
  - Transitions to verification step on success

#### 2. VerifyCodeForm (`src/features/auth/login/verify-code-form.tsx`)

- **Purpose**: Collects and verifies the 6-digit code
- **Features**:
  - 6-digit OTP input using InputOTP component
  - Code validation using Zod schema
  - Calls verify-code API endpoint
  - Redirects to home page on successful authentication
  - Shows loading states and error messages

#### 3. AuthDialog (`src/features/auth/login/auth-dialog.tsx`)

- **Purpose**: Manages the authentication flow between login and verification steps
- **Features**:
  - Multi-step dialog with login and verification sections
  - Stores email between steps
  - Handles navigation between steps
  - Integrates Google OAuth option

### Storage

#### Email Code Storage (`src/lib/storage/email-codes.ts`)

- **Purpose**: Manages temporary storage of email verification codes
- **Implementation**: In-memory Map (for development)
- **Features**:
  - Code generation
  - Code storage with expiration
  - Code validation
  - Code cleanup

**Note**: For production, replace in-memory storage with Redis or a database.

## Authentication Flow

1. **User enters email** → LoginForm validates and sends to `/api/auth/send-code`
2. **Backend generates code** → Stores code with 10-minute expiration
3. **User receives code** → Via email (currently logged to console)
4. **User enters code** → VerifyCodeForm sends to `/api/auth/verify-code`
5. **Backend verifies code** → Checks expiration and validity
6. **User creation/login** → Creates new user or authenticates existing user
7. **JWT token set** → HttpOnly cookie for session management
8. **Redirect to home** → User is now authenticated

## Security Features

- **Code expiration**: 10-minute time limit on verification codes
- **One-time use**: Codes are deleted after successful verification
- **HttpOnly cookies**: JWT tokens stored securely in HttpOnly cookies
- **Input validation**: Zod schemas validate all inputs
- **Error handling**: Comprehensive error handling and user feedback

## Development Notes

### Current Limitations

- Email codes are logged to console instead of being sent via email
- In-memory storage (not suitable for production with multiple server instances)
- No rate limiting on code generation

### Production Considerations

1. **Email Service**: Integrate with SendGrid, AWS SES, or similar service
2. **Storage**: Use Redis or database for code storage
3. **Rate Limiting**: Implement rate limiting on code generation
4. **Monitoring**: Add logging and monitoring for authentication attempts
5. **Security**: Consider adding CAPTCHA for code generation

### Environment Variables Required

```env
# Firebase Admin SDK
FIREBASE_ADMIN_PATH=/path/to/service-account.json

# JWT Secret
JWT_SECRET=your-secret-key

# Email Service (for production)
EMAIL_SERVICE_API_KEY=your-email-service-key
```

## Testing

To test the authentication flow:

1. Start the development server: `npm run dev`
2. Navigate to the login page
3. Enter an email address
4. Check the console for the verification code
5. Enter the code in the verification form
6. Verify successful authentication and redirect

## API Response Examples

### Send Code Success

```json
{
  "success": true,
  "message": "Code sent to your email"
}
```

### Verify Code Success

```json
{
  "success": true,
  "user": {
    "uid": "firebase-user-id",
    "email": "user@example.com",
    "name": "user",
    "role": "user",
    "isVerified": true
  }
}
```

### Error Response

```json
{
  "error": "Invalid or expired code"
}
```
