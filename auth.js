import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.otp) {
          return null
        }

        // OTP قبلاً در login/route.js verify شده است
        // فقط کاربر را پیدا یا ایجاد می‌کنیم

        // پیدا کردن یا ایجاد کاربر
        let user = await prisma.user.findUnique({
          where: { phone: credentials.phone },
        })

        if (!user) {
          // اگر کاربر وجود ندارد، ایجاد می‌کنیم
          console.log(`[Auth] Creating new user with phone: ${credentials.phone}`);
          user = await prisma.user.create({
            data: {
              phone: credentials.phone,
            },
          })
          console.log(`[Auth] User created successfully: ${user.id}`);
        } else {
          console.log(`[Auth] User found: ${user.id} (${user.phone}), role: ${user.role}`);
        }
        
        console.log(`[Auth] Returning user with role: ${user.role}`);
        return {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email,
          role: user.role || "user", // Fallback to "user" if role is null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.phone = token.phone
        session.user.role = token.role
      }
      return session
    },
  },
  secret: process.env.AUTH_SECRET,
}

// Export auth function for NextAuth v4 compatibility with App Router
// Uses cookies API to get session token and decode it
export async function auth() {
  try {
    const { cookies } = await import("next/headers")
    const { decode } = await import("next-auth/jwt")
    const cookieStore = await cookies()
    
    const regularToken = cookieStore.get("next-auth.session-token")
    const secureToken = cookieStore.get("__Secure-next-auth.session-token")
    const token = regularToken || secureToken
    
    if (!token?.value) {
      return null
    }

    // Decode JWT token
    const decoded = await decode({
      token: token.value,
      secret: process.env.AUTH_SECRET,
    })

    if (!decoded || !decoded.id) {
      return null
    }

    // Get user from database to build full session
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        phone: true,
        name: true,
        email: true,
        role: true,
      },
    })

    if (!user) {
      return null
    }

    // Build session object matching NextAuth format
    return {
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        email: user.email,
        role: user.role || "user",
      },
      expires: decoded.exp ? new Date(decoded.exp * 1000).toISOString() : undefined,
    }
  } catch (error) {
    console.error("Auth error:", error)
    return null
  }
}

// Export signOut - in NextAuth v4, signOut is handled client-side or via API route
export async function signOut(options) {
  // For server-side, we need to clear the cookie
  // This is typically handled by the signout API route
  // This export is mainly for compatibility
  return Promise.resolve()
}
