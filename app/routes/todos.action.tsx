import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/lib/auth.server";
import { prisma } from "~/lib/prisma.server";

export async function action({ request }: ActionFunctionArgs) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const todoId = Number(formData.get("todoId"));

  // Verify ownership helper
  async function verifyOwnership(id: number) {
    const todo = await prisma.todo.findFirst({ where: { id, userId } });
    if (!todo) throw new Response("Not found", { status: 404 });
    return todo;
  }

  switch (intent) {
    case "complete": {
      await verifyOwnership(todoId);
      await prisma.todo.update({
        where: { id: todoId },
        data: { completed: true, updatedAt: new Date() },
      });
      return json({ success: true });
    }

    case "softDelete": {
      await verifyOwnership(todoId);
      await prisma.todo.update({
        where: { id: todoId },
        data: { deleted: true, updatedAt: new Date() },
      });
      return json({ success: true });
    }

    case "hardDelete": {
      await verifyOwnership(todoId);
      await prisma.todo.delete({ where: { id: todoId } });
      return json({ success: true });
    }

    case "deleteAll": {
      await prisma.todo.deleteMany({ where: { userId, deleted: true } });
      return json({ success: true });
    }

    case "restore": {
      await verifyOwnership(todoId);
      await prisma.todo.update({
        where: { id: todoId },
        data: { deleted: false, completed: false, updatedAt: new Date() },
      });
      return json({ success: true });
    }

    case "edit": {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      if (!title) return json({ errors: { title: "Title is required." } }, { status: 400 });
      await verifyOwnership(todoId);
      await prisma.todo.update({
        where: { id: todoId },
        data: { title, description: description || null, updatedAt: new Date() },
      });
      return json({ success: true });
    }

    default:
      return json({ error: "Unknown intent" }, { status: 400 });
  }
}

export async function loader() {
  return redirect("/todos/pending");
}
