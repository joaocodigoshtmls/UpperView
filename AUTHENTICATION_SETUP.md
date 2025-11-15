# Authentication Setup Guide

This guide explains how to set up and use the authentication system in UpperView.

## Prerequisites

1. PostgreSQL database (Neon recommended)
2. Node.js 18+ installed
3. Environment variables configured

## Environment Variables

Make sure your `.env` file has the following variables:

```env
# Database
DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"

# NextAuth
AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"  # Change to your production URL in production

# Optional: Demo user email (for development)
DEMO_USER_EMAIL="demo@local"
```

## Database Setup

1. Generate Prisma client:
```bash
npm run prisma:generate
```

2. Run database migrations:
```bash
npm run prisma:migrate
```

When prompted, give the migration a name like: `add_authentication`

3. (Optional) Create a demo user for testing:
```bash
# Start the app
npm run dev

# Visit /cadastro and create a test account
```

## Features

### 1. User Registration (`/cadastro`)
- Users can create accounts with name, email, and password
- Passwords must be at least 6 characters
- Email validation ensures proper format
- Duplicate emails are rejected

### 2. Login (`/login`)
- Users authenticate with email and password
- Failed login attempts show generic error messages for security
- Successful login redirects to dashboard

### 3. Password Reset
- **Request Reset** (`/esqueci-senha`): Enter email to receive reset instructions
- **Reset Password** (`/redefinir-senha/[token]`): Use token to set new password
- Tokens expire after 1 hour
- In development mode, the token is displayed on the page for testing

### 4. Profile Management (`/perfil`)
- View and update name and email
- Change password (requires current password)
- All changes are validated before saving

### 5. Protected Routes
The following routes require authentication:
- `/dashboard`
- `/transactions`
- `/settings`
- `/perfil`

Unauthenticated users are redirected to `/login`.

### 6. User Menu
- Displays user avatar (first letter of name/email)
- Dropdown with profile link and sign-out option
- Visible only when authenticated

## Security Features

1. **Password Hashing**: Uses bcryptjs with salt rounds of 10
2. **JWT Sessions**: Stateless authentication with JWT tokens
3. **Token Expiration**: Password reset tokens expire after 1 hour
4. **Input Validation**: All inputs validated with Zod schemas
5. **Route Protection**: Middleware protects authenticated routes
6. **Secure Cookies**: NextAuth uses secure cookies for sessions

## Development Notes

### Testing Password Reset

In development mode, password reset tokens are:
1. Logged to the console
2. Displayed in the UI as a clickable link

**Important**: Remove these debug features in production by checking `process.env.NODE_ENV`.

### Creating the First User

There are two ways to create the first user:

1. **Via Registration Page**: Visit `/cadastro` and create an account
2. **Via Prisma Studio**: 
   ```bash
   npm run prisma:studio
   ```
   Create a user with a hashed password (use bcrypt to hash it first)

## API Endpoints

- `GET/POST /api/auth/[...nextauth]`: NextAuth.js API routes
  - `/api/auth/signin`: Sign in page
  - `/api/auth/signout`: Sign out
  - `/api/auth/session`: Get current session
  - `/api/auth/csrf`: CSRF token

## Troubleshooting

### Build Warnings about bcryptjs
The build may show warnings about bcryptjs not being supported in Edge Runtime. This is expected and doesn't affect functionality since we're using Node.js runtime for auth.

### Database Connection Issues
If you see database connection errors:
1. Check your `DATABASE_URL` is correct
2. Ensure your database is running
3. Verify SSL mode is set correctly for Neon: `?sslmode=require`

### Session Issues
If you're not staying logged in:
1. Check `AUTH_SECRET` is set in `.env`
2. Clear browser cookies
3. Restart the development server

## Production Deployment

Before deploying to production:

1. Set proper environment variables:
   ```env
   AUTH_SECRET="secure-random-string"
   NEXTAUTH_URL="https://your-domain.com"
   DATABASE_URL="production-database-url"
   ```

2. Remove development-only features:
   - Token display in password reset (check for `process.env.NODE_ENV === "development"`)
   - Console logs for sensitive data

3. Run migrations on production database:
   ```bash
   npx prisma migrate deploy
   ```

4. Configure email service for password resets:
   - Update `forgotPassword` action in `app/auth/actions.ts`
   - Add email sending logic (e.g., using SendGrid, AWS SES, etc.)

## Future Enhancements

Planned features for future releases:

1. **Email Verification**: Verify email addresses after registration
2. **OAuth Providers**: Add Google, GitHub login
3. **Two-Factor Authentication**: Optional 2FA for enhanced security
4. **Remember Me**: Persistent sessions option
5. **Email Notifications**: Password changes, login alerts
6. **Account Deletion**: Allow users to delete their accounts
7. **Session Management**: View and revoke active sessions

## Support

For issues or questions, please open an issue on the GitHub repository.
