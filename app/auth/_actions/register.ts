"use server";

import * as z from "zod";
import { RegisterSchema } from "@/common/schemas/auth-schemas";
import AuthService from "../_services/AuthService";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const payload = { email, password, name };

  try {
    await AuthService.postUserData(payload);
    return { success: "Confirmation email sent!" };
  } catch (error) {
    return { error };
  }

  // const verificationToken = await generateVerificationToken(email);
  // await sendVerificationEmail(
  //   verificationToken.email,
  //   verificationToken.token,
  // );
};
