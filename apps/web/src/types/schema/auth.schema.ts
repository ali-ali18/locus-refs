import * as z from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
  .regex(/[A-Z]/, "Deve conter ao menos 1 letra maiúscula")
  .regex(/[0-9]/, "Deve conter ao menos 1 número")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Deve conter ao menos 1 caractere especial");

const formSchema = z.object({
  email: z.email({ message: "Email inválido" }),
  password: passwordSchema,
});

type FormSchema = z.infer<typeof formSchema>;

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Nome deve ter pelo menos 2 caracteres" }),
    email: z.email({ message: "Email inválido" }),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export { formSchema, registerSchema, type FormSchema, type RegisterSchema };
