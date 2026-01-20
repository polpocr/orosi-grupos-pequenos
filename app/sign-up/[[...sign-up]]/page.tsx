import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { clerkAppearance } from "@/app/components/auth/clerkAppearance";

export default function SignUpPage() {
  return (
    <AuthLayout subtitle="Crea tu cuenta para administrar grupos pequeños">
      <SignUp appearance={clerkAppearance} />
    </AuthLayout>
  );
}
