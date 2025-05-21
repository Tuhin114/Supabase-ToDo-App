import { FormMessage, Message } from "@/components/form-message";

import Signup from "@/components/auth/Sign Up/SignUp";

interface Props {
  searchParams: Promise<Message>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  if ("message" in params) {
    return (
      <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
        <FormMessage message={params} />
      </div>
    );
  }

  return (
    <>
      <Signup />
    </>
  );
}
