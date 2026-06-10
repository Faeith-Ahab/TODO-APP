import bcrypt from "bcryptjs";
import { prisma } from "./prisma.server";

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

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}