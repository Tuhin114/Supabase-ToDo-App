import { FormMessage, Message } from "@/components/form-message";

import SignIn from "@/components/auth/Sign In/SignIn";

interface Props {
  searchParams: Promise<Message>;
}

export default async function Login({ searchParams }: Props) {
  const params = await searchParams;
  if ("message" in params) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={params} />
      </div>
    );
  }
  return (
    <div className="flex w-full flex-col gap-6">
      <SignIn />
    </div>
  );
}
