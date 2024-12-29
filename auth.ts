import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"

const config = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (profile?.login === process.env.ALLOWED_GITHUB_USER) {
        return true;
      }
      return '/auth/error?error=AccessDenied';
    },
  },
  pages: {
    error: '/auth/error',
    signIn: '/auth/signin',
  }
}

const handler = NextAuth(config)

export const { auth } = handler
export const { handlers: { GET, POST } } = handler
