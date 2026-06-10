import { useFetcher } from "react-router";

import { Pen, Trash2, RotateCcw, Check } from "lucide-react";
import type { Todo } from "~/types";

interface TaskItemProps {
  todo: Todo;
  view: "pending" | "completed" | "deleted";
  onEdit?: (todo: Todo) => void;
}

export function TaskItem({ todo, view, onEdit }: TaskItemProps) {
  const fetcher = useFetcher();

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
  };

  return (
    <div className="task-item task-enter flex items-center gap-4 px-5 py-3">
      {/* Title + meta */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-white text-base truncate">{todo.title}</div>
        <div className="text-white/60 text-sm truncate">
          {todo.description
            ? todo.description.length > 35
              ? todo.description.slice(0, 35) + "..."
              : todo.description
            : "No description"}
        </div>
        <div className="text-white/50 text-xs mt-0.5">
          {view === "completed" || view === "deleted" ? (
            <>Updated at: {formatDate(todo.updatedAt)} &nbsp; Created at: {formatDate(todo.createdAt)}</>
          ) : (
            <>Created at: {formatDate(todo.createdAt)}</>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {view === "pending" && (
          <>
            {/* Checkbox to complete */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="complete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button
                type="submit"
                className="custom-checkbox"
                aria-label="Mark complete"
              />
            </fetcher.Form>

            {/* Edit */}
            <button
              className="icon-btn"
              onClick={() => onEdit?.(todo)}
              aria-label="Edit task"
            >
              <Pen size={18} strokeWidth={1.8} />
            </button>

            {/* Soft delete */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="softDelete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button type="submit" className="icon-btn" aria-label="Delete task">
                <Trash2 size={18} strokeWidth={1.8} />
              </button>
            </fetcher.Form>
          </>
        )}

        {view === "completed" && (
          <>
            {/* Checked checkbox (already completed) */}
            <div className="custom-checkbox checked">
              <Check size={14} className="text-gray-700" strokeWidth={3} />
            </div>

            {/* Soft delete */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="softDelete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button type="submit" className="icon-btn" aria-label="Delete task">
                <Trash2 size={18} strokeWidth={1.8} />
              </button>
            </fetcher.Form>
          </>
        )}

        {view === "deleted" && (
          <>
            {/* Restore */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="restore" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button type="submit" className="icon-btn" aria-label="Restore task">
                <RotateCcw size={18} strokeWidth={1.8} />
              </button>
            </fetcher.Form>

            {/* Permanent delete */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="hardDelete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button type="submit" className="icon-btn" aria-label="Permanently delete">
                <Trash2 size={18} strokeWidth={1.8} />
              </button>
            </fetcher.Form>
          </>
        )}
      </div>
    </div>
  );
}
