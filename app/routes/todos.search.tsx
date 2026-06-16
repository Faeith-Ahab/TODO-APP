import { useLoaderData, useOutletContext } from "react-router";
import { useState, useRef } from "react";
import { Search } from "lucide-react";
import { requireUserId } from "~/lib/auth.server";
import { searchTodos } from "~/lib/todo.service.server";
import { TaskItem } from "~/components/TaskItem";
import { EditModal } from "~/components/EditModal";
import type { Todo } from "~/types";

type SearchTodo = Todo & { status: "pending" | "complete" | "deleted" };

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const todos = q.length > 0 ? await searchTodos(userId, q) : [];
  return { todos, q };
}

function StatusBadge({ status }: { status: SearchTodo["status"] }) {
  const cls =
    status === "complete"
      ? "search-status--complete"
      : status === "deleted"
      ? "search-status--deleted"
      : "search-status--pending";
  const desktopLabel =
    status === "complete" ? "Completed" : status === "deleted" ? "Deleted" : "Pending";
  const mobileLabel =
    status === "complete" ? "complete" : status === "deleted" ? "deleted" : "pending";
  return (
    <span className={`search-status-badge ${cls}`}>
      <span className="status-label-desktop">{desktopLabel}</span>
      <span className="status-label-mobile">{mobileLabel}</span>
    </span>
  );
}

export default function SearchPage() {
  const { todos, q: initialQ } = useLoaderData<typeof loader>();
  useOutletContext<{ searchQuery: string }>();

  const [query, setQuery] = useState(initialQ);
  const [submitted, setSubmitted] = useState(initialQ.length > 0);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // ── If a task is being edited, replace the whole screen ──
  if (editingTodo) {
    return <EditModal todo={editingTodo} onClose={() => setEditingTodo(null)} />;
  }

  const filtered = (todos as SearchTodo[]).filter((t) => {
    if (!query) return false;
    const q = query.toLowerCase();
    return (
      t.title.toLowerCase().includes(q) ||
      (t.description?.toLowerCase().includes(q) ?? false)
    );
  });
  const hasActiveQuery = submitted && query.trim().length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim().length === 0) setSubmitted(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSubmitted(true);
      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="dashboard-screen search-screen">

      <div className={`section-header ${hasActiveQuery ? "search-results-heading" : ""}`}>
        <span className="search-heading-desktop">
          {hasActiveQuery ? "SEARCH RESULTS" : "SEARCH"}
        </span>
        <span className="search-heading-mobile">
          {hasActiveQuery ? "SEARCH RESULTS" : "SEARCH"}
        </span>
      </div>

      <form
        ref={formRef}
        method="get"
        action="/todos/search"
        className="search-input-wrap"
        onSubmit={() => setSubmitted(true)}
      >
        <div className="search-box search-box--page">
          <Search className="search-icon" aria-hidden="true" />
          <input
            type="text"
            name="q"
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a keyword and press Enter to search."
            autoFocus
            autoComplete="off"
          />
        </div>
        <button type="submit" hidden aria-hidden="true" />
      </form>

      <div
        className={`tasks-panel search-tasks-panel ${
          hasActiveQuery ? "" : "search-tasks-panel--idle"
        }`}
      >
        <div className="task-list">
          {!hasActiveQuery ? (
            <div className="empty-state">
              Type a keyword and press Enter to search.
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              No tasks match &ldquo;{query}&rdquo;.
            </div>
          ) : (
            filtered.map((todo) => (
              <div key={todo.id} className="search-result-row">
                <TaskItem
                  todo={todo as unknown as Todo}
                  view={
                    todo.deleted
                      ? "deleted"
                      : todo.completed
                      ? "completed"
                      : "pending"
                  }
                  onEdit={(t: Todo) => setEditingTodo(t)}
                />
                <StatusBadge status={todo.status} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
