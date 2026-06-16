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
  const timeStr = today.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="dashboard-screen new-task-screen">
      {/* Header */}
      <div className="section-header">NEW TASK</div>

      <div className="new-task-content">
        <Form method="post" className="new-task-form">
          {/* Title row */}
          <div className="new-task-title-row">
            <div className="new-task-title-field">
              <label className="dashboard-label">Title:</label>
              {actionData?.errors?.title && (
                <p className="dashboard-error">{actionData.errors.title}</p>
              )}
              <input
                name="title"
                type="text"
                className="new-task-input"
                placeholder="What do you need to do?"
                autoFocus
              />
            </div>
            <div className="new-task-date">
              <span className="new-task-time">{timeStr}</span>
              <span>Date: {dateStr}</span>
            </div>
          </div>

          {/* Description */}
          <div className="new-task-description-field">
            <label className="dashboard-label">Description:</label>
            <textarea
              name="description"
              className="new-task-textarea"
              placeholder="Add more details about this task..."
            />
          </div>

          {/* Action buttons */}
          <div className="new-task-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="dashboard-action-btn"
            >
              <Bookmark className="dashboard-action-icon" strokeWidth={1.5} />
              <span>Save</span>
            </button>
            <button
              type="reset"
              className="dashboard-action-btn"
            >
              <Trash2 className="dashboard-action-icon" strokeWidth={1.5} />
              <span>Delete</span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
