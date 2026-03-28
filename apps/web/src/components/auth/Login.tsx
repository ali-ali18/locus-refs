import Link from "next/link";
import { AuthLayout } from "./AuthLayout";
import { FormLogin } from "./FormLogin";

export function Login() {
  return (
    <AuthLayout
      title="Faça login em sua conta"
      description="Digite seu email e senha para acessar sua conta"
      footer={
        <>
          Não tem conta?{" "}
          <Link
            href="/register"
            className="underline underline-offset-4 hover:text-primary ml-1"
          >
            Cadastre-se
          </Link>
        </>
      }
    >
      <FormLogin />
    </AuthLayout>
  );
}
