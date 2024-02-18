import NextAuth from "next-auth";
import { v4 as uuidv4 } from "uuid";

// import { db } from "@/lib/db";
import authConfig from "@/auth.config";
// import { getUserById } from "@/data/user";
// import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
// import { getAccountByUserId } from "./data/account";
import Github from "next-auth/providers/github";
import UserService from "./app/auth/_services/UserService";
import { UserRole } from "./next-auth";
import AuthService from "./app/auth/_services/AuthService";
import AccountService from "./app/auth/_services/AccountService";
import { object } from "zod";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  // update,
} = NextAuth({
  //   pages: {
  //     signIn: "/auth/login",
  //     error: "/auth/error",
  //   },
  //   events: {
  //     async linkAccount({ user }) {
  //       await db.user.update({
  //         where: { id: user.id },
  //         data: { emailVerified: new Date() }
  //       })
  //     }
  //   },
  callbacks: {
    async signIn({ user, account }) {
      // Allow OAuth without email verification
      // const existingUser = await UserService.getUserDataByEmail(user.email);
      // if (account?.provider !== "credentials") {
      //   user.id = existingUser.id;
      //   console.log("provider");
      //   console.log("sign in", { user: user, account: account });
      //   console.log("end provider");
      //   return true;
      // }
      if (account?.provider !== "credentials") {
        let existingUser;
        try {
          existingUser = await UserService.getUserDataByEmail(user.email);
          console.log({existingUser: existingUser});
          
          const existingAccount = await AccountService.getAccountDataByProviderId(user.id);
          console.log({existingAccount});
          
          user.id = existingUser?.id;
          if (existingUser && !existingAccount) {
            const accountPayload = {
              ...account,
              user_id: user.id,
              image: user.image,
            };
            if (account?.provider === "google") {
              accountPayload.expires_at = accountPayload.expires_in;
              delete accountPayload.expires_in;
            }
            await AccountService.postAccountData(accountPayload);
            return true;
          }
          console.log("provider existingUser");
          console.log("sign in existingUser", {
            userProvider: user,
            accountProvider: account,
            existingUser,
          });
          console.log("end provider existingUserexistingUser");
          return true;
        } catch (error) {
          console.log("provider");
          console.log("sign in first time", { user: user, account: account });
          console.log("end provider");
          console.error(error);
          console.log("after error log");
          user.id = uuidv4();
          const userPayload = {
            ...user,
            cid: user.id,
          };
          delete userPayload.image;
          const accountPayload = {
            ...account,
            user_id: user.id,
            image: user.image,
          };
          if (account?.provider === "google") {
            accountPayload.expires_at = accountPayload.expires_in;
            delete accountPayload.expires_in;
          }

          console.log({ userPayload, accountPayload });
          if (!existingUser) {
            await UserService.postUserDataProviders(userPayload);
            await AccountService.postAccountData(accountPayload);
            return true;
          }
          await AccountService.postAccountData(accountPayload);
          return true;
        }
      }
      // const existingUser =
      // const existingUser = await getUserById(user.id);
      // // Prevent sign in without email verification
      // if (!existingUser?.emailVerified) return false;
      // if (existingUser.isTwoFactorEnabled) {
      //   const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
      //   if (!twoFactorConfirmation) return false;
      //   // Delete two factor confirmation for next sign in
      //   await db.twoFactorConfirmation.delete({
      //     where: { id: twoFactorConfirmation.id }
      //   });
      // }
      if (typeof user === "string") return false;
      console.log("sign in first time", {
        userCheck: user,
        accountCheck: account,
      });
      return true;
    },

    async session({ token, session }) {
      console.log({ session, token });

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      //   // if (session.user) {
      //   //   session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      //   // }
      //   // if (session.user) {
      //   //   session.user.name = token.name;
      //   //   session.user.email = token.email;
      //   //   session.user.isOAuth = token.isOAuth as boolean;
      //   // }
      return session;
    },
    async jwt({ token, account, user }) {
      console.log({
        firtStoken: token,
        userToken: user,
        AccountService: account,
      });

      if (!token.sub) return token;
      if (account?.provider !== "credentials") {
        try {
          const isUser = await UserService.getUserDataByEmail(token.email);
          const existingAccount = await AccountService.getAccountDataByUserId(
            isUser.id
          );
          console.log({ isUser });
          if (isUser) {
            token.isOAuth = !!existingAccount;
            token.name = isUser.name;
            token.email = isUser.email;
            token.image = existingAccount.image;
            token.sub = isUser.id;
            token.status = isUser.status;
            token.role = isUser.role;
            token.isTwoFactorEnabled = isUser.isTwoFactorEnabled;
            console.log({ tokenJwt: token });

            return token;
          }
        } catch (error) {
          console.error({ eJWT: error });
          // user.id = uuidv4();
          // token.sub = user.id;
          // const userPayload = {
          //   ...user,
          //   cid: user.id,
          // };
          // const accountPayload = {
          //   ...account,
          //   user_id: user.id,
          // };

          // console.log({ token1: token });

          // console.log({ userPayload, accountPayload });

          // await UserService.postUserDataProviders(userPayload);
          // await AccountService.postAccountData(accountPayload);
          return token;
        }

        // const userPayload = {
        //   ...user,
        //   cid: user.id,
        // };
        // const accountPayload = {
        //   ...account,
        //   user_id: user.id,
        // };

        // await UserService.postUserDataProviders(userPayload);
        // await AccountService.postAccountData(accountPayload);
        return token;
      }
      const existingUser = await UserService.getUserDataById(token.sub);
      if (!existingUser) return token;
      const existingAccount = await AccountService.getAccountDataByUserId(
        existingUser.id
      );
      console.log("Account", existingAccount);
      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
      return token;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
