// TODO: В будущем здесь будут типы от сервера

import z from "zod";
import { loginSchema, registerSchema } from "./validation";

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>
