import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./Submit-Btn";

interface FormProps {
  type: string;
  action: (formData: FormData) => Promise<any>;
}

export default function Form({ type, action }: FormProps) {
  const pendingText = type === "login" ? "Logging in..." : "Signing up...";
  const btnText = type === "login" ? "Log In" : "Sign Up";
  return (
    <form action={action} suppressHydrationWarning={true}>
      <div className="grid gap-6">
        <div className="grid gap-6">
          {type === "sign up" && (
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {type === "login" && (
                <a
                  href="/forgot-password"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              )}
            </div>
            <Input id="password" name="password" type="password" required />
          </div>
          <SubmitButton pendingText={pendingText}>{btnText}</SubmitButton>
        </div>
      </div>
    </form>
  );
}
