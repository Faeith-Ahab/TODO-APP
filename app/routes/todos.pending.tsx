import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { useState } from "react";
import { requireUserId } from "~/lib/auth.server";
import { prisma } from "~/lib/prisma.server";
import { TaskItem } from "~/components/TaskItem";
import { EditModal } from "~/components/EditModal";
import type { Todo } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const todos = await prisma.todo.findMany({
    where: { userId, completed: false, deleted: false },
    orderBy: { createdAt: "desc" },
  });
  return json({ todos });
}

export default function Pending() {
  const { todos } = useLoaderData<typeof loader>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const filtered = todos.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description?.toLowerCase().includes(q) ?? false)
    );
  });

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="section-header">PENDING</div>

      <div className="glass-card flex-1 overflow-hidden">
        <div className="task-list h-full p-4 flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-white/40 text-base italic">
              {searchQuery ? "No matching tasks." : "No pending tasks. Add one!"}
            </div>
          ) : (
            filtered.map((todo) => (
              <TaskItem
                key={todo.id}
                todo={todo as unknown as Todo}
                view="pending"
                onEdit={(t) => setEditingTodo(t)}
              />
            ))
          )}
        </div>
      </div>

      {editingTodo && (
        <EditModal todo={editingTodo} onClose={() => setEditingTodo(null)} />
      )}
    </div>
  );
}
