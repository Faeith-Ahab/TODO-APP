import { createCookieSessionStorage, redirect } from "@react-router/node";
import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";

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

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;
  return prisma.user.findUnique({ where: { id: userId } });
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

export async function createUser(email: string, username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: { email, username, password: hashedPassword },
  });
}

export async function verifyLogin(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
}
