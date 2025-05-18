// components/SignupForm.tsx
"use client";

import { signUpAction } from "@/app/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/submit-button";
import Link from "next/link";

export default function SignupForm() {
  return (
    <form
      className="flex flex-col min-w-64 max-w-64 mx-auto gap-4 mt-24"
      action={signUpAction}
    >
      <h1 className="text-2xl font-medium">Sign up</h1>
      <p className="text-sm text-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary font-medium underline">
          Sign in
        </Link>
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Your password"
          minLength={6}
          required
        />
      </div>

      <SubmitButton pendingText="Signing up...">Sign up</SubmitButton>
    </form>
  );
}
