import { z } from "zod"

export const signUp = z.object({
    email: z.string().email(),
    password: z.string()
                .min(5)
                .max(100)
                .refine((password) => /[a-z]/.test(password) &&
                                      /[A-Z]/.test(password) &&
                                      /[^a-zA-Z0-9]/.test(password)),
    firstName: z.string(),
    lastName: z.string()
})

export const login = z.object({
    email: z.string().email(),
    password: z.string().min(5)
})