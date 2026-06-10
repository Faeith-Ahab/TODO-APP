import { createCookieSessionStorage, redirect } from "react-router";

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__todo_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET || "todo-app-secret-key-change-in-production"],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}

export async function getUserId(request: Request): Promise<number | null> {
  const session = await getSession(request);
  const userId = session.get("userId");
  return userId ? Number(userId) : null;
}

export async function requireUserId(request: Request): Promise<number> {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/auth?mode=login");
  }
  return userId;
}

export async function createUserSession(userId: number, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function logout(request: Request) {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

