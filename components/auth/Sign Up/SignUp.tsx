"use client";
import { ArrowBigRight, MoveLeft, MoveRight } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";

import { useState } from "react";
import Providers from "../Shared/Providers";
import Form from "../Shared/Form";
import { signUpAction } from "@/actions/auth/actions";

export default function Signup() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome!</CardTitle>
          <CardDescription>
            Sign Up with your Github or Google account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Providers type="sign up" />
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
            <Form type="sign up" action={signUpAction} />
            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="/sign-in" className="underline underline-offset-4">
                Log In Now
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
