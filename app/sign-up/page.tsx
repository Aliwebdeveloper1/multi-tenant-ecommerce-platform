import { SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function SignUpPage() {
  const { userId } = auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            E-Commerce
          </h1>
          <p className="text-gray-600">Create your account</p>
        </div>

        <div className="rounded-lg bg-white shadow-xl p-8">
          <SignUp
            appearance={{
              elements: {
                formButtonPrimary:
                  "bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg",
                footerActionLink: "text-blue-600 hover:text-blue-700",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500",
                socialButtonsBlockButton:
                  "border border-gray-300 hover:border-gray-400 text-gray-700 font-semibold rounded-lg",
              },
            }}
            signInUrl="/sign-in"
            fallbackRedirectUrl="/dashboard"
            forceRedirectUrl="/dashboard"
          />
        </div>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}
          <a href="/sign-in" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
