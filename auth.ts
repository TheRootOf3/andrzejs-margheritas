import GitHub from "next-auth/providers/github"
import { getServerSession } from "next-auth"

const isAllowedGitHubUser = (login: unknown) =>
  !!process.env.ALLOWED_GITHUB_USER && login === process.env.ALLOWED_GITHUB_USER;

export const authOptions = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ profile }: any) {
      if (isAllowedGitHubUser(profile?.login)) {
        return true;
      }
      return '/auth/error?error=AccessDenied';
    },
    async jwt({ token, profile }: any) {
      // profile is only present on sign-in; keep the GitHub login in the token afterwards
      if (profile) {
        token.githubLogin = profile.login;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.githubLogin = token.githubLogin;
      }
      return session;
    },
  },
  pages: {
    error: '/auth/error',
  }
}

// Returns the session only when it belongs to the allowed GitHub user, otherwise null
export async function getAdminSession() {
  const session: any = await getServerSession(authOptions);
  return isAllowedGitHubUser(session?.user?.githubLogin) ? session : null;
}
