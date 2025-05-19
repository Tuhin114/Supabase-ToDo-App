import {
  signInAction,
  signInWithGithubAction,
  signInWithGoogleAction,
} from "@/actions/auth/actions";
import { FormMessage, Message } from "@/components/form-message";

import SignIn from "@/components/auth/Sign In/SignIn";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <>
      <SignIn searchParams={searchParams} />
    </>
  );
}
