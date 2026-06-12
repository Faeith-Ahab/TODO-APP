// import { useLoaderData, useOutletContext } from "react-router";
// import { useState, useRef } from "react";
// import { Search } from "lucide-react";
// import { requireUserId } from "~/lib/auth.server";
// import { searchTodos } from "~/lib/todo.service.server";
// import { TaskItem } from "~/components/TaskItem";
// import { EditModal } from "~/components/EditModal";
// import type { Todo } from "~/types";

// export async function loader({ request }: { request: Request }) {
//   const userId = await requireUserId(request);
//   const url = new URL(request.url);
//   const q = url.searchParams.get("q")?.trim() ?? "";
//   const todos = q.length > 0 ? await searchTodos(userId, q) : [];
//   return { todos, q };
// }

// /** Derive a human-readable status label + colour class from a Todo. */
// function getStatus(todo: Todo): { label: string; cls: string } {
//   if (todo.deleted)   return { label: "deleted",   cls: "search-status--deleted" };
//   if (todo.completed) return { label: "complete",  cls: "search-status--complete" };
//   return                     { label: "pending",   cls: "search-status--pending" };
// }

// /** StatusBadge — shown in the task-actions slot when rendered from search. */
// function StatusBadge({ todo }: { todo: Todo }) {
//   const { label, cls } = getStatus(todo);
//   return <span className={`search-status-badge ${cls}`}>{label}</span>;
// }

// export default function SearchPage() {
//   const { todos, q: initialQ } = useLoaderData<typeof loader>();
//   // Also consume the layout-level searchQuery so the sidebar stays wired up,
//   // but the search page manages its own independent query string.
//   useOutletContext<{ searchQuery: string }>();

//   const [query, setQuery]       = useState(initialQ);
//   const [submitted, setSubmitted] = useState(initialQ.length > 0);
//   const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
//   const formRef = useRef<HTMLFormElement>(null);

//   // Client-side filter so instant typing feels responsive after first load.
//   // The loader handles SSR / direct-URL access.
//   const filtered: Todo[] = todos.filter((t: Todo) => {
//     if (!query) return false;
//     const q = query.toLowerCase();
//     return (
//       t.title.toLowerCase().includes(q) ||
//       (t.description?.toLowerCase().includes(q) ?? false)
//     );
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuery(e.target.value);
//     if (e.target.value.trim().length === 0) setSubmitted(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       setSubmitted(true);
//       formRef.current?.requestSubmit();
//     }
//   };

//   return (
//     <div className="dashboard-screen search-screen">
//       {/* ── Header pill ───────────────────────────────────────────────── */}
//       <div className="section-header">SEARCH RESULTS</div>

//       {/* ── Search input bar ──────────────────────────────────────────── */}
//       <form
//         ref={formRef}
//         method="get"
//         action="/todos/search"
//         className="search-input-wrap"
//         onSubmit={() => setSubmitted(true)}
//       >
//         <div className="search-box search-box--page">
//           <Search className="search-icon" aria-hidden="true" />
//           <input
//             type="text"
//             name="q"
//             value={query}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             placeholder="Search"
//             autoFocus
//             autoComplete="off"
//           />
//         </div>
//         {/* Hidden submit so Enter works */}
//         <button type="submit" hidden aria-hidden="true" />
//       </form>

//       {/* ── Status column label ──────────────────────────────────────── */}
//       {submitted && query.trim().length > 0 && (
//         <div className="search-status-label">
//           <em>STATUS</em>
//         </div>
//       )}

//       {/* ── Results panel ────────────────────────────────────────────── */}
//       <div className="tasks-panel search-tasks-panel">
//         <div className="task-list">
//           {!submitted || query.trim().length === 0 ? (
//             <div className="empty-state">
//               Type a keyword and press Enter to search.
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="empty-state">No tasks match &ldquo;{query}&rdquo;.</div>
//           ) : (
//             filtered.map((todo: Todo) => (
//               <div key={todo.id} className="search-result-row">
//                 <TaskItem
//                   todo={todo as unknown as Todo}
//                   // Show the view that matches the task's real state so the
//                   // correct action buttons appear.
//                   view={
//                     todo.deleted
//                       ? "deleted"
//                       : todo.completed
//                       ? "completed"
//                       : "pending"
//                   }
//                   onEdit={(t: Todo) => setEditingTodo(t)}
//                 />
//                 <StatusBadge todo={todo} />
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {editingTodo && (
//         <EditModal todo={editingTodo} onClose={() => setEditingTodo(null)} />
//       )}
//     </div>
//   );
// }






// import { useLoaderData, useOutletContext } from "react-router";
// import { useState, useRef } from "react";
// import { Search } from "lucide-react";
// import { requireUserId } from "~/lib/auth.server";
// import { searchTodos } from "~/lib/todo.service.server";
// import { TaskItem } from "~/components/TaskItem";
// import { EditModal } from "~/components/EditModal";
// import type { Todo } from "~/types";

// // searchTodos returns Todo & { status: "pending" | "complete" | "deleted" }
// type SearchTodo = Todo & { status: "pending" | "complete" | "deleted" };

// export async function loader({ request }: { request: Request }) {
//   const userId = await requireUserId(request);
//   const url = new URL(request.url);
//   const q = url.searchParams.get("q")?.trim() ?? "";
//   const todos = q.length > 0 ? await searchTodos(userId, q) : [];
//   return { todos, q };
// }

// /** StatusBadge — uses the `status` field already computed by searchTodos. */
// function StatusBadge({ status }: { status: SearchTodo["status"] }) {
//   const cls =
//     status === "complete"
//       ? "search-status--complete"
//       : status === "deleted"
//       ? "search-status--deleted"
//       : "search-status--pending";
//   return <span className={`search-status-badge ${cls}`}>{status}</span>;
// }

// export default function SearchPage() {
//   const { todos, q: initialQ } = useLoaderData<typeof loader>();
//   useOutletContext<{ searchQuery: string }>();

//   const [query, setQuery] = useState(initialQ);
//   const [submitted, setSubmitted] = useState(initialQ.length > 0);
//   const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
//   const formRef = useRef<HTMLFormElement>(null);

//   // Client-side filter keeps results in sync while typing between submits.
//   const filtered = (todos as SearchTodo[]).filter((t) => {
//     if (!query) return false;
//     const q = query.toLowerCase();
//     return (
//       t.title.toLowerCase().includes(q) ||
//       (t.description?.toLowerCase().includes(q) ?? false)
//     );
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setQuery(e.target.value);
//     if (e.target.value.trim().length === 0) setSubmitted(false);
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter") {
//       setSubmitted(true);
//       formRef.current?.requestSubmit();
//     }
//   };

//   return (
//     <div className="dashboard-screen search-screen">

//       {/* ── Header pill ─────────────────────────────────────────────── */}
//       <div className="section-header">SEARCH RESULTS</div>

//       {/* ── Search input bar ────────────────────────────────────────── */}
//       <form
//         ref={formRef}
//         method="get"
//         action="/todos/search"
//         className="search-input-wrap"
//         onSubmit={() => setSubmitted(true)}
//       >
//         <div className="search-box search-box--page">
//           <Search className="search-icon" aria-hidden="true" />
//           <input
//             type="text"
//             name="q"
//             value={query}
//             onChange={handleChange}
//             onKeyDown={handleKeyDown}
//             placeholder="Search"
//             autoFocus
//             autoComplete="off"
//           />
//         </div>
//         <button type="submit" hidden aria-hidden="true" />
//       </form>

//       {/* ── "STATUS" label — right-aligned above results ─────────────── */}
//       {submitted && query.trim().length > 0 && (
//         <div className="search-status-label">
//           <em>STATUS</em>
//         </div>
//       )}

//       {/* ── Results panel ───────────────────────────────────────────── */}
//       <div className="tasks-panel search-tasks-panel">
//         <div className="task-list">
//           {!submitted || query.trim().length === 0 ? (
//             <div className="empty-state">
//               Type a keyword and press Enter to search.
//             </div>
//           ) : filtered.length === 0 ? (
//             <div className="empty-state">
//               No tasks match &ldquo;{query}&rdquo;.
//             </div>
//           ) : (
//             filtered.map((todo) => (
//               <div key={todo.id} className="search-result-row">
//                 <TaskItem
//                   todo={todo as unknown as Todo}
//                   view={
//                     todo.deleted
//                       ? "deleted"
//                       : todo.completed
//                       ? "completed"
//                       : "pending"
//                   }
//                   onEdit={(t: Todo) => setEditingTodo(t)}
//                 />
//                 <StatusBadge status={todo.status} />
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {editingTodo && (
//         <EditModal todo={editingTodo} onClose={() => setEditingTodo(null)} />
//       )}
//     </div>
//   );
// }




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
  return <span className={`search-status-badge ${cls}`}>{status}</span>;
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

      <div className="section-header">SEARCH RESULTS</div>

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
            placeholder="Search"
            autoFocus
            autoComplete="off"
          />
        </div>
        <button type="submit" hidden aria-hidden="true" />
      </form>

      {submitted && query.trim().length > 0 && (
        <div className="search-status-label">
          <em>STATUS</em>
        </div>
      )}

      <div className="tasks-panel search-tasks-panel">
        <div className="task-list">
          {!submitted || query.trim().length === 0 ? (
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
