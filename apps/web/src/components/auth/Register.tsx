import Link from "next/link";
import { AuthLayout } from "./AuthLayout";
import { FormRegister } from "./FormRegister";

export function Register() {
  return (
    <AuthLayout
      title="Crie sua conta"
      description="Preencha os dados abaixo para criar sua conta"
      footer={
        <>
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary ml-1"
          >
            Faça login
          </Link>
        </>
      }
      reversePanel
    >
      <FormRegister />
    </AuthLayout>
  );
}
