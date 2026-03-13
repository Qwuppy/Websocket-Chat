import z from "zod";
import { loginSchema, registerSchema } from "./validation";

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>

export interface AuthResponse {
    access_token: string;
}