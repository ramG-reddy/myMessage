import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import { parsedEnv } from "@/lib/env"
import prisma from "@/lib/db"

const prismaInstance = prisma || new PrismaClient()

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: parsedEnv.GOOGLE_CLIENT_ID,
      clientSecret: parsedEnv.GOOGLE_CLIENT_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prismaInstance),
  secret: parsedEnv.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({session, token, user}) => {
      return {...session, user: {...session.user, ...user}};
    }
  }
})