// import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { LoginSchema } from "./common/schemas/auth-schemas";
import AuthService from "./app/auth/_services/AuthService";
import UserService from "./app/auth/_services/UserService";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const payload = { email, password };
          try {
            const res = await AuthService.userLogin(payload);
            console.log({res});
            
            const userId = res?.account?.user_id ?? res?.user_id;

            if (userId) {
              const user = await UserService.getUserDataById(userId);
              return user;
            }
          } catch (error) {
            console.error(error);
            // return error;
          }
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
