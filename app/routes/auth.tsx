import { Form, Link, useSearchParams, redirect } from "react-router";
import { useActionData } from "react-router";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { createUserSession, getUserId } from "~/lib/auth.server";
import { createUser, verifyLogin } from "~/lib/auth.service.server";
import { Navbar } from "~/components/Navbar";
import type { ActionData } from "~/types";
type LoaderArgs = { request: Request };

type ActionArgs = { request: Request };

export async function loader({ request }: LoaderArgs) {

  const userId = await getUserId(request);
  if (userId) return redirect("/todos/pending");
  return new Response(JSON.stringify({}), { status: 200, headers: { "Content-Type": "application/json" } });

}

export async function action({ request }: ActionArgs) {

  const formData = await request.formData();
  const mode = formData.get("mode") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return new Response(JSON.stringify({ errors: { general: "Email and password are required." } }), { status: 400, headers: { "Content-Type": "application/json" } });

  }

  if (mode === "signup") {
    const username = formData.get("username") as string;
    if (!username) {
      return new Response(JSON.stringify({ errors: { username: "Username is required." } }), { status: 400, headers: { "Content-Type": "application/json" } });

    }
    // Check existing
    try {
      const user = await createUser(email, username, password);
      return createUserSession(user.id, "/todos/pending");
    } catch (e: any) {
      if (e.code === "P2002") {
        return new Response(JSON.stringify({ errors: { general: "Email or username already in use." } }), { status: 400, headers: { "Content-Type": "application/json" } });

      }
      return new Response(JSON.stringify({ errors: { general: "Something went wrong." } }), { status: 500, headers: { "Content-Type": "application/json" } });

    }
  }

  // Login
  const user = await verifyLogin(email, password);
  if (!user) {
    return new Response(JSON.stringify({ errors: { general: "Invalid email or password." } }), { status: 400, headers: { "Content-Type": "application/json" } });

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

        <main className="auth-main">
          <section className={`auth-frame ${isLogin ? "auth-frame-login" : "auth-frame-signup"}`}>
            <div className="auth-panel">
              <div className="auth-logo">
                <div className="logo-font auth-logo-line">TODO</div>
                <div className="logo-font auth-logo-line">APP</div>
              </div>

              <div className="auth-form-area">
                <Form method="post" className="auth-form">
                  <input type="hidden" name="mode" value={mode} />

                  {actionData?.errors?.general && (
                    <div className="auth-error">
                      {actionData.errors.general}
                    </div>
                  )}

                  <div className="auth-field">
                    <label className="auth-label">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="auth-input"
                    />
                  </div>

                  <div className="auth-field">
                    <label className="auth-label">Password</label>
                    <div className="auth-password-wrap">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className="auth-input auth-password-input"
                      />
                      {!isLogin && (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="auth-eye-btn"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff size={44} /> : <Eye size={44} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="auth-field">
                      <label className="auth-label">User name</label>
                      <input
                        name="username"
                        type="text"
                        required
                        className="auth-input"
                      />
                    </div>
                  )}

                  <button type="submit" className="auth-submit">
                    {isLogin ? "Sign In" : "Sign Up"}
                  </button>
                </Form>

                <div className="auth-switch">
                  {isLogin ? (
                    <>
                      Don&rsquo;t have an account?
                      <Link to="/auth?mode=signup">SIGNUP</Link>
                    </>
                  ) : (
                    <>
                      Already have an account?
                      <Link to="/auth?mode=login">SIGN IN</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
