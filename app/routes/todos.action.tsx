import { redirect } from "react-router";

import { requireUserId } from "~/lib/auth.server";
import {
  completeTodo,
  deleteAllDeletedTodos,
  editTodo,
  hardDeleteTodo,
  restoreTodo,
  softDeleteTodo,
  uncompleteTodo,
} from "~/lib/todo.service.server";

export async function action({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const todoId = Number(formData.get("todoId"));

  switch (intent) {
    case "complete": {
      assertTodoId(todoId);
      await completeTodo(userId, todoId);
      return { success: true };
    }

    case "uncomplete": {
      assertTodoId(todoId);
      await uncompleteTodo(userId, todoId);
      return { success: true };
    }

    case "softDelete": {
      assertTodoId(todoId);
      await softDeleteTodo(userId, todoId);
      return { success: true };
    }

    case "hardDelete": {
      assertTodoId(todoId);
      await hardDeleteTodo(userId, todoId);
      return { success: true };
    }

    case "deleteAll": {
      await deleteAllDeletedTodos(userId);
      return { success: true };
    }

    case "restore": {
      assertTodoId(todoId);
      await restoreTodo(userId, todoId);
      return { success: true };
    }

    case "edit": {
      const title = formData.get("title") as string;
      const description = formData.get("description") as string;
      if (!title || title.trim() === "")
        return Response.json(
          { errors: { title: "Title is required." } },
          { status: 400 },
        );

      assertTodoId(todoId);
      await editTodo(userId, todoId, title, description || null);
      return { success: true };
    }

    default:
      return Response.json({ error: "Unknown intent" }, { status: 400 });
  }
}

export async function loader() {
  return redirect("/todos/pending");
}

function assertTodoId(todoId: number) {
  if (!Number.isInteger(todoId) || todoId < 1) {
    throw Response.json({ error: "Invalid todo id" }, { status: 400 });
  }
}
