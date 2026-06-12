import { useLoaderData, useOutletContext } from "react-router";

import { requireUserId } from "~/lib/auth.server";
import { getCompletedTodos } from "~/lib/todo.service.server";
import { TaskItem } from "~/components/TaskItem";
import type { Todo } from "~/types";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const todos = await getCompletedTodos(userId);
  return { todos };
}

export default function Completed() {
  const { todos } = useLoaderData<typeof loader>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();

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
      <div className="section-header">COMPLETED</div>

      <div className="tasks-panel">
        <div className="task-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? "No matching completed tasks." : "Nothing completed yet."}
            </div>
          ) : (
            filtered.map((todo: Todo) => (
              <TaskItem
                key={todo.id}
                todo={todo as unknown as Todo}
                view="completed"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
