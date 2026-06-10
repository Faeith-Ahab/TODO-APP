import { Form, Link, useFetcher } from "react-router";
import { json, redirect } from "@react-router";
import { useActionData, useSearchParams } from "@react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { createUser, createUserSession, getUserId, verifyLogin } from "~/lib/auth.server";
import { Navbar } from "~/components/Navbar";
import type { ActionData } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/todos/pending");
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const mode = formData.get("mode") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return json<ActionData>(
      { errors: { general: "Email and password are required." } },
      { status: 400 }
    );
  }

  if (mode === "signup") {
    const username = formData.get("username") as string;
    if (!username) {
      return json<ActionData>({ errors: { username: "Username is required." } }, { status: 400 });
    }
    // Check existing
    try {
      const user = await createUser(email, username, password);
      return createUserSession(user.id, "/todos/pending");
    } catch (e: any) {
      if (e.code === "P2002") {
        return json<ActionData>(
          { errors: { general: "Email or username already in use." } },
          { status: 400 }
        );
      }
      return json<ActionData>({ errors: { general: "Something went wrong." } }, { status: 500 });
    }
  }

  // Login
  const user = await verifyLogin(email, password);
  if (!user) {
    return json<ActionData>(
      { errors: { general: "Invalid email or password." } },
      { status: 400 }
    );
  }
  return createUserSession(user.id, "/todos/pending");
}

export default function Auth() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<ActionData>();
  const mode = searchParams.get("mode") ?? "login";
  const isLogin = mode === "login";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="page-bg" />
      <div className="page-content min-h-screen flex flex-col">
        <Navbar />

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          <div className="glass-card w-full max-w-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            {/* Logo */}
            <div className="flex-shrink-0 hidden md:block">
              <div className="logo-font text-5xl leading-none">TODO</div>
              <div className="logo-font text-5xl leading-none">APP</div>
            </div>

            {/* Form */}
            <div className="flex-1 w-full max-w-sm mx-auto md:mx-0">
              <Form method="post" className="flex flex-col gap-5">
                <input type="hidden" name="mode" value={mode} />

                {actionData?.errors?.general && (
                  <div className="text-red-300 text-sm bg-red-900/30 rounded-xl px-4 py-2">
                    {actionData.errors.general}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="text-white/80 text-base mb-2 block">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="glass-input w-full px-5 py-3 text-base"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-white/80 text-base mb-2 block">Password</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="glass-input w-full px-5 py-3 pr-12 text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Username (signup only) */}
                {!isLogin && (
                  <div>
                    <label className="text-white/80 text-base mb-2 block">User name</label>
                    <input
                      name="username"
                      type="text"
                      required
                      className="glass-input w-full px-5 py-3 text-base"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="mt-1 py-3 rounded-full bg-white/20 hover:bg-white/30 text-white font-medium tracking-wide transition-colors"
                >
                  {isLogin ? "Sign In" : "Sign Up"}
                </button>
              </Form>

              <div className="mt-4 text-center text-white/70 text-sm">
                {isLogin ? (
                  <>
                    Don't have an account?{" "}
                    <Link
                      to="/auth?mode=signup"
                      className="text-white font-semibold hover:underline ml-1"
                    >
                      SIGNUP
                    </Link>
                  </>
                ) : (
                  <>
                    Already have an account?{" "}
                    <Link
                      to="/auth?mode=login"
                      className="text-white font-semibold hover:underline ml-1"
                    >
                      SIGN IN
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
