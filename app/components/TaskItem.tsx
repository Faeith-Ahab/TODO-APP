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

  const formatTime = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`task-item task-enter task-item-${view}`}>
      {/* Title + meta */}
      <div className="task-title">
        {todo.title}
      </div>

      <div className="task-copy">
        <div className="task-description">
          {todo.description
            ? todo.description.length > 35
              ? todo.description.slice(0, 35) + "..."
              : todo.description
            : "No description"}
        </div>
        <div className="task-meta">
          {view === "completed" || view === "deleted" ? (
            <>
              <span className="task-meta-updated">
                Updated at: {formatDate(todo.updatedAt)} &nbsp;
              </span>
              Created at: {formatDate(todo.createdAt)} &nbsp; {formatTime(todo.createdAt)}
            </>
          ) : (
            <>Created at: {formatDate(todo.createdAt)} &nbsp; {formatTime(todo.createdAt)}</>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="task-actions">
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
              <Pen className="task-icon" strokeWidth={1.8} />
            </button>

            {/* Soft delete */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="softDelete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button type="submit" className="icon-btn" aria-label="Delete task">
                <Trash2 className="task-icon" strokeWidth={1.8} />
              </button>
            </fetcher.Form>
          </>
        )}

        {view === "completed" && (
          <>
            {/* Uncheck to move back to pending */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="uncomplete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button
                type="submit"
                className="custom-checkbox checked"
                aria-label="Move task back to pending"
              >
                <Check className="task-check-icon" strokeWidth={3} />
              </button>
            </fetcher.Form>

            {/* Edit */}
            <button
              className="icon-btn"
              onClick={() => onEdit?.(todo)}
              aria-label="Edit task"
            >
              <Pen className="task-icon" strokeWidth={1.8} />
            </button>

            {/* Soft delete */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="softDelete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button type="submit" className="icon-btn" aria-label="Delete task">
                <Trash2 className="task-icon" strokeWidth={1.8} />
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
                <RotateCcw className="task-icon" strokeWidth={1.8} />
              </button>
            </fetcher.Form>

            {/* Permanent delete */}
            <fetcher.Form method="post" action="/todos/action">
              <input type="hidden" name="intent" value="hardDelete" />
              <input type="hidden" name="todoId" value={todo.id} />
              <button type="submit" className="icon-btn" aria-label="Permanently delete">
                <Trash2 className="task-icon" strokeWidth={1.8} />
              </button>
            </fetcher.Form>
          </>
        )}
      </div>
    </div>
  );
}
