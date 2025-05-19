"use client";
import { ArrowBigRight, MoveLeft, MoveRight } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

import { useState } from "react";
import SignupForm from "./SignupForm";
import Providers from "../Shared/Providers";

export default function Signup() {
  const [showProviders, setShowProviders] = useState(true);
  const handleProvidersClick = () => {
    setShowProviders(!showProviders);
  };
  return (
    <Card className="w-full max-w-4xl mx-auto bg-background rounded-lg border dark:border-zinc-800 p-10">
      <CardHeader className="space-y-1">
        {showProviders ? (
          <CardTitle className="text-4xl font-bold text-center ">
            Let's connect <br />
            <span className="">your provider</span>
          </CardTitle>
        ) : (
          <CardTitle className="text-4xl font-bold text-center ">
            Sign up for ToDo
          </CardTitle>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        {showProviders ? <Providers /> : <SignupForm />}
        {showProviders ? (
          <Button
            variant="link"
            className="text-center text-lg text-blue-400 hover:underline"
            onClick={handleProvidersClick}
          >
            Continue with Email
            <MoveRight className="ml-2" />
          </Button>
        ) : (
          <Button
            variant="link"
            className="text-center text-lg text-blue-400 hover:underline"
            onClick={handleProvidersClick}
          >
            <MoveLeft className="mr-2" />
            other Sign Up options
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
