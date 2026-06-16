import { prisma } from "./prisma.server";

export async function getPendingTodos(userId: number) {
  return prisma.todo.findMany({
    where: { userId, completed: false, deleted: false },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCompletedTodos(userId: number) {
  return prisma.todo.findMany({
    where: { userId, completed: true, deleted: false },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getDeletedTodos(userId: number) {
  return prisma.todo.findMany({
    where: { userId, deleted: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function searchTodos(userId: number, keyword: string) {
  const query = keyword.trim();
  const todos = await prisma.todo.findMany({
    where: query
      ? {
          userId,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : { userId },
    orderBy: { updatedAt: "desc" },
  });

  return todos.map((todo) => ({
    ...todo,
    status: todo.deleted ? "deleted" : todo.completed ? "complete" : "pending",
  }));
}

export async function createTodo(userId: number, title: string, description: string | null) {
  return prisma.todo.create({
    data: {
      title,
      description,
      userId,
    },
  });
}

async function requireOwnedTodo(userId: number, todoId: number) {
  const todo = await prisma.todo.findFirst({ where: { id: todoId, userId } });
  if (!todo) throw new Response("Not found", { status: 404 });
  return todo;
}

export async function completeTodo(userId: number, todoId: number) {
  await requireOwnedTodo(userId, todoId);
  return prisma.todo.update({
    where: { id: todoId },
    data: { completed: true, updatedAt: new Date() },
  });
}

export async function uncompleteTodo(userId: number, todoId: number) {
  await requireOwnedTodo(userId, todoId);
  return prisma.todo.update({
    where: { id: todoId },
    data: { completed: false, updatedAt: new Date() },
  });
}

export async function softDeleteTodo(userId: number, todoId: number) {
  await requireOwnedTodo(userId, todoId);
  return prisma.todo.update({
    where: { id: todoId },
    data: { deleted: true, updatedAt: new Date() },
  });
}

export async function hardDeleteTodo(userId: number, todoId: number) {
  await requireOwnedTodo(userId, todoId);
  return prisma.todo.delete({ where: { id: todoId } });
}

export async function deleteAllDeletedTodos(userId: number) {
  return prisma.todo.deleteMany({ where: { userId, deleted: true } });
}

export async function restoreTodo(userId: number, todoId: number) {
  await requireOwnedTodo(userId, todoId);
  return prisma.todo.update({
    where: { id: todoId },
    data: { deleted: false, completed: false, updatedAt: new Date() },
  });
}

export async function editTodo(
  userId: number,
  todoId: number,
  title: string,
  description: string | null,
) {
  const todo = await requireOwnedTodo(userId, todoId);
  const hasMeaningfulChange =
    stripWhitespace(title) !== stripWhitespace(todo.title) ||
    stripWhitespace(description ?? "") !== stripWhitespace(todo.description ?? "");

  return prisma.todo.update({
    where: { id: todoId },
    data: {
      title,
      description,
      completed: todo.completed && hasMeaningfulChange ? false : todo.completed,
      updatedAt: new Date(),
    },
  });
}

function stripWhitespace(value: string) {
  return value.replace(/\s+/g, "");
}
