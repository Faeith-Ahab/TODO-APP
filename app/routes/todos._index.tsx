import { redirect } from "react-router";
import { requireUserId } from "~/lib/auth.server";

export async function loader({ request }: { request: Request }) {
  await requireUserId(request);
  return redirect("/todos/pending");
}

