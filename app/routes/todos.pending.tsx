import { useLoaderData, useOutletContext } from "react-router";
import { useState } from "react";
import { requireUserId } from "~/lib/auth.server";
import { getPendingTodos } from "~/lib/todo.service.server";
import { TaskItem } from "~/components/TaskItem";
import { EditModal } from "~/components/EditModal";
import type { Todo } from "~/types";

export async function loader({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const todos = await getPendingTodos(userId);
  return { todos };
}

export default function Pending() {
  const { todos } = useLoaderData<typeof loader>();
  const { searchQuery } = useOutletContext<{ searchQuery: string }>();
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // ── If a task is being edited, replace the whole screen ──
  if (editingTodo) {
    return <EditModal todo={editingTodo} onClose={() => setEditingTodo(null)} />;
  }

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
      <div className="section-header">PENDING</div>

      <div className="tasks-panel">
        <div className="task-list">
          {filtered.length === 0 ? (
            <div className="empty-state">
              {searchQuery ? "No matching tasks." : "No pending tasks. Add one!"}
            </div>
          ) : (
            filtered.map((todo: Todo) => (
              <TaskItem
                key={todo.id}
                todo={todo as unknown as Todo}
                view="pending"
                onEdit={(t: Todo) => setEditingTodo(t)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}



// import { useLoaderData, useOutletContext } from "react-router";

// import { useState } from "react";
// import { requireUserId } from "~/lib/auth.server";
// import { getPendingTodos } from "~/lib/todo.service.server";
// import { TaskItem } from "~/components/TaskItem";
// import { EditModal } from "~/components/EditModal";
// import type { Todo } from "~/types";

// export async function loader({ request }: { request: Request }) {
//   const userId = await requireUserId(request);
//   const todos = await getPendingTodos(userId);
//   return { todos };
// }

// export default function Pending() {
//   const { todos } = useLoaderData<typeof loader>();
//   const { searchQuery } = useOutletContext<{ searchQuery: string }>();
//   const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

//   const filtered = todos.filter((t: Todo) => {
//     if (!searchQuery) return true;
//     const q = searchQuery.toLowerCase();
//     return (
//       t.title.toLowerCase().includes(q) ||
//       (t.description?.toLowerCase().includes(q) ?? false)
//     );
//   });

//   return (
//     <div className="dashboard-screen">
//       <div className="section-header">PENDING</div>

//       <div className="tasks-panel">
//         <div className="task-list">
//           {filtered.length === 0 ? (
//             <div className="empty-state">
//               {searchQuery ? "No matching tasks." : "No pending tasks. Add one!"}
//             </div>
//           ) : (
//             filtered.map((todo: Todo) => (
//               <TaskItem
//                 key={todo.id}
//                 todo={todo as unknown as Todo}
//                 view="pending"
//                 onEdit={(t: Todo) => setEditingTodo(t)}
//               />
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
