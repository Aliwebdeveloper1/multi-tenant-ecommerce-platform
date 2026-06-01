import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignInVerifyEmailPage() {
  const { userId } = auth();
  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Email Verified!
        </h1>
        <p className="text-gray-700 mb-6">
          Your email has been verified. Please{' '}
          <a href="/sign-in" className="text-blue-600 hover:text-blue-700 font-semibold">
            sign in
          </a>{' '}
          to continue.
        </p>
      </div>
    </div>
  );
}