import { SignIn } from "@clerk/nextjs";
import AuthLayout from "@/app/components/auth/AuthLayout";
import { clerkAppearance } from "@/app/components/auth/clerkAppearance";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn appearance={clerkAppearance} />
    </AuthLayout>
  );
}
