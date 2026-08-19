import type { Metadata } from "next";
import { SignupForm } from "./SignupForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an InterviewHub account. Your profile is saved so you can sign in anytime.",
};

export default function SignupPage() {
  return <SignupForm />;
}
