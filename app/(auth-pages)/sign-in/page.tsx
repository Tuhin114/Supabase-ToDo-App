import { signInAction, signInWithGoogleAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex-1 flex flex-col min-w-64 gap-8">
      <div>
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm text-foreground">
          Don't have an account?{" "}
          <Link className="text-foreground font-medium underline" href="/sign-up">
            Sign up
          </Link>
        </p>
      </div>

      <form action={signInWithGoogleAction}>
        <Button type="submit" className="w-full flex gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M15.4001 8.116c0-.584-.052-1.147-.148-1.686H8v3.187h4.134a3.545 3.545 0 01-1.534 2.326v1.927h2.475c1.453-1.338 2.325-3.309 2.325-5.754z" fill="#4285F4"/>
            <path d="M8 15.9999c2.07 0 3.804-.684 5.075-1.859l-2.475-1.927c-.686.46-1.564.731-2.6.731-1.999 0-3.689-1.35-4.293-3.162H1.137v1.991c1.26 2.504 3.837 4.226 6.863 4.226z" fill="#34A853"/>
            <path d="M3.707 9.683a4.798 4.798 0 01-.25-1.518c0-.527.091-1.039.25-1.518V4.656H1.137A8.001 8.001 0 000 8.165c0 1.282.308 2.494.852 3.565l2.855-2.047z" fill="#FBBC05"/>
            <path d="M8 3.485c1.126 0 2.137.387 2.935 1.146l2.195-2.195C11.744.943 10.01.165 8 .165c-3.026 0-5.603 1.722-6.863 4.226l2.855 2.047C4.311 4.835 6.001 3.485 8 3.485z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </Button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t"></span>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <form className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input name="email" placeholder="you@example.com" required />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
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
          />
        </div>
        <SubmitButton pendingText="Signing In..." formAction={signInAction}>
          Sign in with Email
        </SubmitButton>
        <FormMessage message={searchParams} />
      </form>
    </div>
  );
}