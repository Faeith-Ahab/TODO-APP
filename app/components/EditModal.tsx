import { useFetcher } from "@remix-run/react";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Todo } from "~/types";

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

  // Close on successful submit
  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data) {
      onClose();
    }
  }, [fetcher.state, fetcher.data, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="glass-card relative w-full max-w-lg mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold text-lg tracking-wide">Edit Task</h2>
          <button
            onClick={onClose}
            className="icon-btn"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <fetcher.Form method="post" action="/todos/action">
          <input type="hidden" name="intent" value="edit" />
          <input type="hidden" name="todoId" value={todo.id} />

          <div className="mb-4">
            <label className="text-white/70 text-sm mb-1 block">Title</label>
            <input
              ref={titleRef}
              name="title"
              defaultValue={todo.title}
              className="glass-input w-full px-4 py-2.5"
              required
            />
          </div>

          <div className="mb-5">
            <label className="text-white/70 text-sm mb-1 block">Description</label>
            <textarea
              name="description"
              defaultValue={todo.description ?? ""}
              rows={4}
              className="glass-textarea w-full px-4 py-3"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={fetcher.state !== "idle"}
              className="px-5 py-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors text-sm font-medium"
            >
              {fetcher.state !== "idle" ? "Saving..." : "Save"}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}
