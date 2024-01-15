import NextAuth, { type DefaultSession } from "next-auth";

interface UserRole {
  USER: 'USER',
  ADMIN: 'ADMIN',
}

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
