import { useFetcher, useLoaderData, useOutletContext } from "react-router";

import { requireUserId } from "~/lib/auth.server";
import { getDeletedTodos } from "~/lib/todo.service.server";
import { TaskItem } from "~/components/TaskItem";
import type { Todo } from "~/types";
import { Trash2 } from "lucide-react";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const todos = await getDeletedTodos(userId);
  return { todos };
}

export default function Deleted() {
  const { todos } = useLoaderData<typeof loader>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const fetcher = useFetcher();

  const filtered = todos.filter((t: Todo) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="dashboard-screen">
      <div className="section-header">DELETED</div>

      <div className="tasks-panel">
        <div className="task-list">
          {/* Delete all bar */}
          {filtered.length > 0 && (
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="deleteAll" />
              <button
                type="submit"
                className="delete-all-bar"
              >
                <Trash2 className="delete-all-icon" strokeWidth={1.5} />
                <span>Delete all? </span>
                <em>This action can not be undone.</em>
              </button>
            </fetcher.Form>
          )}

          {filtered.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? "No matching deleted tasks." : "No deleted tasks."}
            </div>
          ) : (
            filtered.map((todo: Todo) => (
              <TaskItem
                key={todo.id}
                todo={todo as unknown as Todo}
                view="deleted"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
