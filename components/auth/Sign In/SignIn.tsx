"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import Providers from "../Shared/Providers";
import { Button } from "@/components/ui/button";
import { MoveLeft, MoveRight } from "lucide-react";
import SignInForm from "./SignInForm";
import { Message } from "@/components/form-message";

export default function SignIn({ searchParams }: { searchParams: Message }) {
  const [showProviders, setShowProviders] = useState(true);
  const handleProvidersClick = () => {
    setShowProviders(!showProviders);
  };
  return (
    <Card className="w-full max-w-4xl mx-auto bg-background rounded-lg border-none p-10">
      <CardHeader className="space-y-1">
        <CardTitle className="text-4xl font-bold text-center ">
          Log in to ToDo
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {showProviders ? (
          <Providers />
        ) : (
          <SignInForm searchParams={searchParams} />
        )}
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
