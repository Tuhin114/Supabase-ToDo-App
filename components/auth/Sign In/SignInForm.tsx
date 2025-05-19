import { Input } from "@/components/ui/input";
import Link from "next/link";
import { SubmitButton } from "../Shared/submit-button";
import { signInAction } from "@/actions/auth/actions";
import { FormMessage, Message } from "@/components/form-message";

export default function SignInForm({
  searchParams,
}: {
  searchParams: Message;
}) {
  return (
    <form className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Input
          name="email"
          placeholder="you@example.com"
          required
          className="w-full border py-6 border-zinc-600 text-lg text-white placeholder:text-zinc-500 focus:border-none focus:ring-0 focus:outline-none bg-transparent"
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Link
            className="text-xs text-foreground underline"
            href="/forgot-password"
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type="password"
          name="password"
          placeholder="Your password"
          required
          className="w-full border py-6 border-zinc-600 text-lg text-white placeholder:text-zinc-500 focus:border-none focus:ring-0 focus:outline-none bg-transparent"
        />
      </div>
      <SubmitButton pendingText="Signing In..." formAction={signInAction}>
        Sign in with Email
      </SubmitButton>
      <FormMessage message={searchParams} />
    </form>
  );
}
