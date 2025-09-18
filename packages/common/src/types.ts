import { z } from "zod";

export const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .max(20, "Username must be at most 20 characters long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password too long"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const createRoomSchema = z.object({
  name: z
    .string()
    .min(3, "Room name must be at least 3 characters long")
    .max(50, "Room name must be at most 50 characters long"),
  isPrivate: z.boolean().default(false),
  maxParticipants: z.coerce
    .number()
    .min(2, "At least 2 participants required")
    .max(50, "Maximum 50 participants allowed"),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
