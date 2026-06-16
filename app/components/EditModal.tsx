import { useFetcher } from "react-router";
import { useEffect, useRef } from "react";
import { Bookmark, Trash2 } from "lucide-react";
import type { Todo } from "~/types";

const TITLE_MAX_LENGTH = 18;

interface EditModalProps {
  todo: Todo;
  onClose: () => void;
}

export function EditModal({ todo, onClose }: EditModalProps) {
  const fetcher = useFetcher();
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  const today = new Date();
  const dateLabel = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  const isBusy = fetcher.state !== "idle";

  return (
    <div className="dashboard-screen new-task-screen">

      {/* Header pill */}
      <div className="section-header">EDITING TASK</div>

      {/* Form */}
      <div className="new-task-content">
        <fetcher.Form
          method="post"
          action="/todos/action"
          className="new-task-form"
        >
          <input type="hidden" name="intent" value="edit" />
          <input type="hidden" name="todoId" value={todo.id} />

          {/* Title row */}
          <div className="new-task-title-row">
            <div className="new-task-title-field">
              <label className="dashboard-label">Title:</label>
              <input
                ref={titleRef}
                name="title"
                defaultValue={todo.title}
                placeholder="Title"
                className="new-task-input"
                maxLength={TITLE_MAX_LENGTH}
                required
              />
            </div>
            <span className="new-task-date">Date: {dateLabel}</span>
          </div>

          {/* Description */}
          <div className="new-task-description-field">
            <label className="dashboard-label">Description:</label>
            <textarea
              name="description"
              defaultValue={todo.description ?? ""}
              placeholder="Description"
              className="new-task-textarea"
            />
          </div>

          {/* Actions */}
          <div className="new-task-actions">
            <button type="submit" disabled={isBusy} className="dashboard-action-btn">
              <Bookmark className="dashboard-action-icon" strokeWidth={1.6} />
              {isBusy ? "Saving…" : "Save"}
            </button>

            <button
              type="button"
              disabled={isBusy}
              className="dashboard-action-btn"
              onClick={() => {
                const fd = new FormData();
                fd.set("intent", "softDelete");
                fd.set("todoId", String(todo.id));
                fetcher.submit(fd, { method: "post", action: "/todos/action" });
              }}
            >
              <Trash2 className="dashboard-action-icon" strokeWidth={1.6} />
              Delete
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}




// import { useFetcher } from "react-router";

// import { useEffect, useRef } from "react";
// import { X } from "lucide-react";
// import type { Todo } from "~/types";

// interface EditModalProps {
//   todo: Todo;
//   onClose: () => void;
// }

// export function EditModal({ todo, onClose }: EditModalProps) {
//   const fetcher = useFetcher();
//   const titleRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     titleRef.current?.focus();
//   }, []);

//   // Close on successful submit
//   useEffect(() => {
//     if (fetcher.state === "idle" && fetcher.data) {
//       onClose();
//     }
//   }, [fetcher.state, fetcher.data, onClose]);

//   return (
//     <div
//       className="fixed inset-0 z-50 flex items-center justify-center"
//       onClick={onClose}
//     >
//       <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
//       <div
//         className="glass-card relative w-full max-w-lg mx-4 p-6"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex items-center justify-between mb-5">
//           <h2 className="text-white font-semibold text-lg tracking-wide">Edit Task</h2>
//           <button
//             onClick={onClose}
//             className="icon-btn"
//             aria-label="Close"
//           >
//             <X size={20} />
//           </button>
//         </div>

//         <fetcher.Form method="post" action="/todos/action">
//           <input type="hidden" name="intent" value="edit" />
//           <input type="hidden" name="todoId" value={todo.id} />

//           <div className="mb-4">
//             <label className="text-white/70 text-sm mb-1 block">Title</label>
//             <input
//               ref={titleRef}
//               name="title"
//               defaultValue={todo.title}
//               className="glass-input w-full px-4 py-2.5"
//               required
//             />
//           </div>

//           <div className="mb-5">
//             <label className="text-white/70 text-sm mb-1 block">Description</label>
//             <textarea
//               name="description"
//               defaultValue={todo.description ?? ""}
//               rows={4}
//               className="glass-textarea w-full px-4 py-3"
//             />
//           </div>

//           <div className="flex gap-3 justify-end">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-5 py-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors text-sm"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={fetcher.state !== "idle"}
//               className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors text-sm font-medium"
//             >
//               {fetcher.state !== "idle" ? "Saving..." : "Save"}
//             </button>
//           </div>
//         </fetcher.Form>
//       </div>
//     </div>
//   );
// }
