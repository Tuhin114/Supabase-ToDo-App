// components/SignupForm.tsx
"use client";

import { signUpAction } from "@/actions/auth/actions";
import { Input } from "@/components/ui/input";

import { Mail } from "lucide-react";
import { SubmitButton } from "../Shared/submit-button";

export default function SignupForm() {
  return (
    <form className="flex flex-col w-96 mx-auto gap-4" action={signUpAction}>
      <div className="flex flex-col gap-2">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="w-full border py-6 border-zinc-600 text-lg text-white placeholder:text-zinc-500 focus:border-none focus:ring-0 focus:outline-none bg-transparent"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Your password"
          minLength={6}
          required
          className="w-full border py-6 border-zinc-600 text-lg text-white placeholder:text-zinc-500 focus:border-none focus:ring-0 focus:outline-none bg-transparent"
        />
      </div>

      <SubmitButton pendingText="Signing up...">
        <Mail className="mr-2" />
        Sign up with Email
      </SubmitButton>
    </form>
  );
}
