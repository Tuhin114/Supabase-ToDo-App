"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import Providers from "../Shared/Providers";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import Form from "../Shared/Form";
import { signInAction } from "@/actions/auth/actions";

export default function SignIn() {
  const [showProviders, setShowProviders] = useState(true);
  const handleProvidersClick = () => {
    setShowProviders(!showProviders);
  };
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>
            Login with your Github or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Providers type="login" />
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Form type="login" action={signInAction} />
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/sign-up" className="underline underline-offset-4">
                Sign Up Now
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
