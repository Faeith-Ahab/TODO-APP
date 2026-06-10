import { redirect } from "react-router";
import { Form, useActionData, useNavigation } from "react-router";

import { Bookmark, Trash2 } from "lucide-react";
import { requireUserId } from "~/lib/auth.server";
import { createTodo } from "~/lib/todo.service.server";
import type { ActionData } from "~/types";

export async function loader({ request }: { request: Request }) {
  await requireUserId(request);
  return {};
}

export async function action({ request }: { request: Request }) {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;

  if (!title || title.trim() === "") {
    return Response.json(
      { errors: { title: "Title is required." } } satisfies ActionData,
      { status: 400 },
    );
  }

  await createTodo(userId, title.trim(), description?.trim() || null);

  return redirect("/todos/pending");
}

export default function NewTask() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const today = new Date();
  const dateStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Header */}
      <div className="section-header">NEW TASK</div>

      <div className="glass-card flex-1 flex flex-col p-6 gap-5 overflow-hidden">
        <Form method="post" className="flex flex-col h-full gap-5">
          {/* Title row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <label className="text-white/80 text-base font-light mb-2 block">Title:</label>
              {actionData?.errors?.title && (
                <p className="text-red-300 text-xs mb-1">{actionData.errors.title}</p>
              )}
              <input
                name="title"
                type="text"
                className="glass-input w-full px-5 py-3"
                autoFocus
              />
            </div>
            <div className="text-white/70 text-base font-light whitespace-nowrap mt-7">
              Date: {dateStr}
            </div>
          </div>

          {/* Description */}
          <div className="flex-1 flex flex-col">
            <label className="text-white/80 text-base font-light mb-2 block">Description:</label>
            <textarea
              name="description"
              className="glass-textarea flex-1 w-full px-5 py-4 text-base"
              placeholder="Add a description..."
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-center gap-10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-base"
            >
              <Bookmark size={22} strokeWidth={1.5} />
              <span>Save</span>
            </button>
            <button
              type="reset"
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-base"
            >
              <Trash2 size={22} strokeWidth={1.5} />
              <span>Delete</span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
