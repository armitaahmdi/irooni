import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
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
})

