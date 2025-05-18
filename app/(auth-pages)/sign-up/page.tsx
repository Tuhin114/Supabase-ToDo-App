import { FormMessage, Message } from "@/components/form-message";

import { SmtpMessage } from "../smtp-message";
import SignupForm from "@/components/SignupForm";

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

  // no “message” → show the interactive form
  return (
    <>
      <SignupForm />
      <SmtpMessage />
    </>
  );
}
