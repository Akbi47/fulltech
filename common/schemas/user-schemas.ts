import * as z from "zod";

export const UserBaseSchema = z.object({
  email: z.string().email(),
  username: z.string(),
  image: z.string(),
});
