import { Login } from "./Login";
import { Register } from "./Register";
import { VerifyEmail } from "./VerifyEmail";

export function LoginPage() {
  return <Login />;
}

export function RegisterPage() {
  return <Register />;
}

export function VerifyEmailPage(props: {
  email: string;
  alreadyVerified: boolean;
  callbackURL: string | null;
}) {
  return <VerifyEmail {...props} />;
}