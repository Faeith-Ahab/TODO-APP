import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { Trash2 } from "lucide-react";
import { requireUserId } from "~/lib/auth.server";
import { prisma } from "~/lib/prisma.server";
import { TaskItem } from "~/components/TaskItem";
import type { Todo } from "~/types";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireUserId(request);
  const todos = await prisma.todo.findMany({
    where: { userId, deleted: true },
    orderBy: { updatedAt: "desc" },
  });
  return json({ todos });
}

export default function Deleted() {
  const { todos } = useLoaderData<typeof loader>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const fetcher = useFetcher();

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
      <div className="section-header">DELETED</div>

      <div className="glass-card flex-1 overflow-hidden">
        <div className="task-list h-full p-4 flex flex-col gap-2">
          {/* Delete all bar */}
          {filtered.length > 0 && (
            <fetcher.Form method="post" action="/todos/action" className="mb-1">
              <input type="hidden" name="intent" value="deleteAll" />
              <button
                type="submit"
                className="delete-all-bar w-full text-left hover:text-white/90 transition-colors"
              >
                <Trash2 size={20} strokeWidth={1.5} />
                <span>Delete all? </span>
                <em>This action can not be undone.</em>
              </button>
            </fetcher.Form>
          )}

          {filtered.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-white/40 text-base italic">
              {searchQuery ? "No matching deleted tasks." : "No deleted tasks."}
            </div>
          ) : (
            filtered.map((todo) => (
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
